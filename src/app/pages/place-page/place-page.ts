import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { PlacesService } from '../../services/places';
import { WishlistService } from '../../services/wishlist';
import { Place } from '../../types';

@Component({
  selector: 'app-place-page',
  imports: [AsyncPipe],
  templateUrl: './place-page.html',
  styleUrl: './place-page.scss',
})
export class PlacePage implements OnInit {
  place$!: Observable<Place>;
  isInWishlist = false;

  constructor(
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private wishlistService: WishlistService,
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.place$ = this.placesService.getPlaceDetails(id);
      this.isInWishlist = this.wishlistService.isInWishlist(id);
    }
  }

  toggleWishlist(place: Place): void {
    if (this.isInWishlist) {
      this.wishlistService.removeFromWishlist(place.fsq_place_id).subscribe();
      this.isInWishlist = false;
    } else {
      this.wishlistService.addToWishlist(place).subscribe();
      this.isInWishlist = true;
    }
  }
}
