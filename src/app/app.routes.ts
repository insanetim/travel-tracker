import { Routes } from '@angular/router';
import { PlacePage } from './pages/place-page/place-page';
import { SearchPage } from './pages/search-page/search-page';
import { WishlistPage } from './pages/wishlist-page/wishlist-page';

export const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  { path: 'search', component: SearchPage },
  { path: 'wishlist', component: WishlistPage },
  { path: 'place/:id', component: PlacePage },
  { path: '**', redirectTo: 'search' },
];
