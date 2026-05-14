import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GeolocationService {
  getCurrentPosition(): Observable<GeolocationPosition> {
    return new Observable((observer) => {
      if (!navigator.geolocation) {
        observer.error('Geolocation is not supported by this browser.');
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          observer.next(position);
          observer.complete();
        },
        (error) => observer.error(error),
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 },
      );
    });
  }
}
