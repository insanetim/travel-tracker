import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Place } from '../types';

const WISHLIST_STORAGE_KEY = 'travel_tracker_wishlist';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private wishlist: Place[] = [];

  constructor() {
    this.loadWishlist();
  }

  private loadWishlist(): void {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (stored) {
      try {
        this.wishlist = JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse wishlist from localStorage', e);
        this.wishlist = [];
      }
    }
  }

  private saveWishlist(): void {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(this.wishlist));
  }

  getWishlist(): Observable<Place[]> {
    return of([...this.wishlist]);
  }

  addToWishlist(place: Place): Observable<Place[]> {
    const exists = this.wishlist.some((p) => p.fsq_place_id === place.fsq_place_id);
    if (!exists) {
      this.wishlist.push(place);
      this.saveWishlist();
    }
    return of([...this.wishlist]);
  }

  removeFromWishlist(fsqId: string): Observable<Place[]> {
    this.wishlist = this.wishlist.filter((p) => p.fsq_place_id !== fsqId);
    this.saveWishlist();
    return of([...this.wishlist]);
  }

  isInWishlist(fsqId: string): boolean {
    return this.wishlist.some((p) => p.fsq_place_id === fsqId);
  }

  clearWishlist(): Observable<Place[]> {
    this.wishlist = [];
    this.saveWishlist();
    return of([...this.wishlist]);
  }
}
