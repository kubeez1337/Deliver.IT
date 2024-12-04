import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'https://localhost:59038/getFoods';
  getFoods(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
