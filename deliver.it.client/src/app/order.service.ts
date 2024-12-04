import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from './models/order.model';
import { Food } from './models/food.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'https://localhost:59038'; 
  constructor(private http: HttpClient) { }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`);
  }
  getAvailableFoods(): Observable<Food[]> {
    return this.http.get<Food[]>(`${this.apiUrl}/foods`);
  }
  createOrder(orderData: Order): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-order`, orderData);
  }
  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/orders/${id}`);
  }
  updateOrder(orderId: number, updatedOrder: Order): Observable<Order> {
    
    return this.http.put<Order>(`${this.apiUrl}/orders/${orderId}`, updatedOrder);
  }
}
