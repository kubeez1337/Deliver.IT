import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Restaurant } from './models/restaurant.model';
import { RestaurantRequest } from './models/restaurant-request.model';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private apiUrl = 'https://localhost:59038';

  constructor(private http: HttpClient) {}

  requestRestaurant(request: RestaurantRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/request-restaurant`, request);
  }

  getPendingRequests(): Observable<RestaurantRequest[]> {
    return this.http.get<RestaurantRequest[]>(`${this.apiUrl}/pending-restaurant`);
  }

  approveRequest(requestId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/approve-restaurant`, requestId);
  }

  getRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(`${this.apiUrl}/getRestaurants`);
  }
  rejectRequest(requestId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reject-restaurant`, requestId);
  }
  addManager(userId: string, restaurantId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add-manager`, { userId, restaurantId });
  }
  getManagedRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(`${this.apiUrl}/managed-restaurants`);
  }
  revokeManager(restaurantId: number, managerId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/revoke-manager`, { restaurantId, managerId });
  }
}
