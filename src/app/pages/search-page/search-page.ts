import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { GeolocationService } from '../../services/geolocation';
import { PlacesService } from '../../services/places';
import { WishlistService } from '../../services/wishlist';
import { Place } from '../../types';

@Component({
  selector: 'app-search-page',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './search-page.html',
  styleUrl: './search-page.scss',
})
export class SearchPage {
  keyword = '';
  places: Place[] = [];
  loading = false;
  error: string | null = null;
  hasSearched = false;

  constructor(
    private placesService: PlacesService,
    private wishlistService: WishlistService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private geolocationService: GeolocationService,
  ) {}

  onSearch(): void {
    if (!this.keyword.trim()) {
      this.error = 'Please enter a keyword';
      return;
    }

    this.loading = true;
    this.error = null;
    this.places = [];
    this.hasSearched = true;

    this.geolocationService.getCurrentPosition().subscribe({
      next: (position) => {
        this.placesService
          .searchPlaces(this.keyword, position.latitude, position.longitude)
          .subscribe({
            next: (results) => {
              this.places = results || [];
              this.loading = false;
              this.cdr.detectChanges();
            },
            error: (err) => {
              this.error = 'Failed to search places. Please try again.';
              this.loading = false;
              this.cdr.detectChanges();
            },
          });
      },
      error: (err) => {
        this.error = 'Failed to get your location. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onAddToWishlist(place: Place): void {
    this.wishlistService.addToWishlist(place).subscribe();
    this.cdr.detectChanges();
  }

  isInWishlist(fsqId: string): boolean {
    return this.wishlistService.isInWishlist(fsqId);
  }
}
