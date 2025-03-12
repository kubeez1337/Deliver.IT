import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OsrmService {
  private osrmUrlRoute = '/osrm/route/v1/driving';
  private osrmUrlTrip = '/osrm/trip/v1/driving';

  constructor(private http: HttpClient) { }

  
  getRoute(
    coordinates: string,
    overview: 'full' | 'simplified' | 'false' = 'full',
    geometries: 'geojson' | 'polyline' | 'polyline6' = 'geojson'
  ): Observable<any> {
    const url = `${this.osrmUrlRoute}/${coordinates}?overview=${overview}&geometries=${geometries}`;

    return this.http.get<any>(url).pipe(
      map((response) => {
        return response;
      }),
      catchError(this.handleError)
    );
  }
  getOptimizedRoute(coordinates: string): Observable<any> {
    const restaurantCoordinates = '18.7737394,49.2135079';
    const url = `${this.osrmUrlTrip}/${restaurantCoordinates};${coordinates};${restaurantCoordinates}?source=first&destination=last&roundtrip=false`;
    return this.http.get<any>(url).pipe(
      map((response) => response),
      catchError(this.handleError)
    );
  }
  private handleError(error: HttpErrorResponse) {
    console.error('OSRM API Error:', error);
    return throwError(() => new Error('Failed to fetch route from OSRM.'));
  }
}
