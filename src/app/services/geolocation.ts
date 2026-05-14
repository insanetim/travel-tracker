import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { GeolocationPosition } from '../types';

@Injectable({ providedIn: 'root' })
export class GeolocationService {
  getCurrentPosition(): Observable<GeolocationPosition> {
    if (!navigator.geolocation) {
      return of({ latitude: 50.4501, longitude: 30.5234 });
    }

    return from(
      new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.warn('Geolocation error, using default coordinates:', error);
            resolve({ latitude: 50.4501, longitude: 30.5234 });
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000,
          },
        );
      }),
    );
  }
}
