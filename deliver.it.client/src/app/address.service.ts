import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Address } from './models/address.model';

@Injectable({
  providedIn: 'root'
})

export class AddressService {
  private apiUrl = 'https://localhost:59038';

  constructor(private http: HttpClient) { }

  getAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.apiUrl}/getAddresses`);
  }
  loadAddresses(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/setAddressesFromJson`,null);
  }
}
