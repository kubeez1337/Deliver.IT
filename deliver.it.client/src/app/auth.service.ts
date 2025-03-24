import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Food } from './models/food.model';
import { User } from './models/user.model';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:59038';  
  private isAdminSubject = new BehaviorSubject<boolean>(this.checkAdmin());
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkLoggedIn());
  private isManagerSubject = new BehaviorSubject<boolean>(this.checkManager());
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const loginData = { username, password };
    return this.http.post<any>(`${this.apiUrl}/login`, loginData);
  }
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.isAdminSubject.next(false);
    this.isLoggedInSubject.next(false);
    this.isManagerSubject.next(false);
  }
  getAllUsers(): Observable<User[]> {
    const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get<User[]>(`${this.apiUrl}/getUsers`, { headers });
  }
  updateAdminStatus(): void {
    this.isAdminSubject.next(this.checkAdmin());
    this.isLoggedInSubject.next(this.checkLoggedIn());
  }
  updateManagerStatus(): void {
    this.isManagerSubject.next(this.checkManager());
    this.isLoggedInSubject.next(this.checkLoggedIn());
  }
  isAdmin(): Observable<boolean> {
    return this.isAdminSubject.asObservable();
  }
  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }
  isManager(): Observable<boolean> {
    if (this.isManagerSubject.value === true) {
      return this.isManagerSubject.asObservable();
    }
    if (this.isAdminSubject.value === true) {
      return this.isAdminSubject.asObservable();
    }
    return this.isManagerSubject.asObservable();
  }
  private checkAdmin(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === '1';
  }
  private checkCustomer(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === '0';
  }
  private checkCourier(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === '2';
  }
  private checkManager(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === '3';
  }
  register(username: string, firstName: string, lastName: string, phoneNumber: string, email: string, password: string): Observable<any> {
    const registerData = { username, firstName, lastName, phoneNumber, email, password };
    return this.http.post<any>(`${this.apiUrl}/register`, registerData);
  }
  private checkLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  getUserRole(): string {
    if (this.checkAdmin()) {
      return '1';
    }
    if (this.checkCustomer()) {
      return '0';
    }
    if (this.checkCourier()) {
      return '2';
    }
    if (this.checkManager()) {
      return '3';
    }
    else {
      return '';
    }
  }
  getUser(): Observable<User> {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);
    if (!token) {
      throw new Error('No token found');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    console.log('Headers:', headers);
    return this.http.get<User>(`${this.apiUrl}/getUser`, { headers });
  }
  uploadFoods(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`${this.apiUrl}/uploadFoods`, formData, { headers });
  }
  exportFoods(): Observable<Blob> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/exportFoods`, { headers, responseType: 'blob' });
  }
  updateFood(food: Food): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(`${this.apiUrl}/updateFood`, food, { headers });
  }
  getFoods(): Observable<Food[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Food[]>(`${this.apiUrl}/getFoods`, { headers });
  }
  updateFoods(foods: Food[], restaurantId: number | null): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(`${this.apiUrl}/updateFoods?restaurantId=${restaurantId}`, foods, { headers });
  }

  deleteFoods(foodIds: number[]): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.request<any>('delete', `${this.apiUrl}/deleteFoods`, { headers, body: foodIds });
  }
  updateUser(user: User): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(`${this.apiUrl}/updateUser`, user, { headers });
  }

  applyForCourier(message: string): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.apiUrl}/applyForCourier`, {message}, { headers });
  }
  getCourierApplications(): Observable<any[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.apiUrl}/getCourierApplications`, { headers });
  }

  processCourierApplication(applicationId: string, approve: boolean): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.apiUrl}/processCourierApplication`, { applicationId, approve }, { headers });
  }
  addFoods(foods: Food[], restaurantId: number | null): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(`${this.apiUrl}/addFoods?restaurantId=${restaurantId}`, foods, { headers });
  }
  getUserByUsername(username: string): Observable<User> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<User>(`${this.apiUrl}/getUserByUsername?username=${username}`, { headers });
  }
  uploadFoodPicture(foodId: number, formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`${this.apiUrl}/foods/${foodId}/upload-picture`, formData, { headers });
  }
  getFoodsByRestaurant(restaurantId: number): Observable<Food[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Food[]>(`${this.apiUrl}/getFoods/${restaurantId}`, { headers });
  }
}
