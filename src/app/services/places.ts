import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, shareReplay, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { CacheEntry, Place } from '../types';

@Injectable({ providedIn: 'root' })
export class PlacesService {
  private baseUrl = '/api/places';
  private headers: HttpHeaders;
  private cache = new Map<string, CacheEntry>();
  private cacheDuration = 10 * 60 * 1000;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      Authorization: `Bearer ${environment.foursquareApiKey}`,
      'Content-Type': 'application/json',
      'X-Places-Api-Version': '2025-06-17',
    });
  }

  searchPlaces(keyword: string, lat: number, lng: number): Observable<Place[]> {
    const roundedLat = Math.round(lat * 10000) / 10000;
    const roundedLng = Math.round(lng * 10000) / 10000;
    const cacheKey = `${keyword}_${roundedLat}_${roundedLng}`;

    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return of(cached.data);
    }

    const params = {
      query: keyword,
      ll: `${lat},${lng}`,
      radius: '50000',
      limit: '20',
    };

    return this.http
      .get<{ results: Place[] }>(`${this.baseUrl}/search`, { headers: this.headers, params })
      .pipe(
        map((response) => response.results),
        tap((data) => {
          this.cache.set(cacheKey, { data, timestamp: Date.now() });
        }),
        shareReplay(1),
      );
  }

  getPlaceDetails(fsqId: string): Observable<Place> {
    const params = {
      fields: 'fsq_id,name,categories,location,geocodes,rating,photos,tips',
    };
    return this.http.get<Place>(`${this.baseUrl}/${fsqId}`, { headers: this.headers, params });
  }

  getPlaceTips(fsqId: string): Observable<{ tips: { text: string; created_at: string }[] }> {
    return this.http.get<{ tips: { text: string; created_at: string }[] }>(
      `${this.baseUrl}/${fsqId}/tips`,
      { headers: this.headers, params: { limit: '5' } },
    );
  }
}
