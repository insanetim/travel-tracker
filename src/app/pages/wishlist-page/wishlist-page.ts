import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { WishlistService } from '../../services/wishlist';
import { Place } from '../../types';

@Component({
  selector: 'app-wishlist-page',
  imports: [AsyncPipe, CommonModule, RouterLink],
  templateUrl: './wishlist-page.html',
  styleUrl: './wishlist-page.scss',
})
export class WishlistPage implements OnInit {
  wishlist$!: Observable<Place[]>;
  loading = false;

  constructor(
    private wishlistService: WishlistService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    this.wishlist$ = this.wishlistService.getWishlist();
  }

  onRemoveFromWishlist(fsqId: string): void {
    this.wishlistService.removeFromWishlist(fsqId).subscribe(() => {
      this.loadWishlist();
      this.cdr.detectChanges();
    });
  }

  onClearWishlist(): void {
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
      this.wishlistService.clearWishlist().subscribe(() => {
        this.loadWishlist();
        this.cdr.detectChanges();
      });
    }
  }

  navigateToPlace(placeId: string): void {
    this.router.navigate(['/place', placeId]);
  }
}
