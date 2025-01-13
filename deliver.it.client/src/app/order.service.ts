import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, switchMap } from 'rxjs';
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
    return this.http.get<Food[]>(`${this.apiUrl}/getFoods`);
  }
  createOrder(orderData: Order): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-order`, orderData);
  }
  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/orders/${id}`);
  }
  updateOrder(orderId: number, updatedOrder: Order): Observable<Order> {
    return this.calculateTotalPrice(updatedOrder.orderFoods).pipe(
      switchMap(totalPrice => {
        updatedOrder.totalPrice = totalPrice;
        updatedOrder.id = orderId;
        return this.http.put<any>(`${this.apiUrl}/updateOrder`, updatedOrder);
      })
    );
  }
  claimOrder(orderId: number): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<any>(`${this.apiUrl}/claim-order`, { orderId }, { headers });
  }
  deliverOrder(orderId: number): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<any>(`${this.apiUrl}/deliver-order`, { orderId }, { headers });
  }
  private calculateTotalPrice(orderFoods: any[]): Observable<number> {
    return this.getAvailableFoods().pipe(
      map(foods => {
        let totalPrice = 0;
        orderFoods.forEach(orderFood => {
          const food = foods.find(f => f.id === orderFood.foodId);
          if (food) {
            totalPrice += food.price * orderFood.quantity;
          }
        });
        return totalPrice;
      })
    );
  }
}
