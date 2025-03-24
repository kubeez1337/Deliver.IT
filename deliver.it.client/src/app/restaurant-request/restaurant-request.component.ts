import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RestaurantService } from '../restaurant.service';
import { RestaurantRequest } from '../models/restaurant-request.model';
import { AddressService } from '../address.service';
import { Address } from '../models/address.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-restaurant-request',
  templateUrl: './restaurant-request.component.html',
  styleUrls: ['./restaurant-request.component.css'],
  standalone: false
})
export class RestaurantRequestComponent implements OnInit {
  restaurant: RestaurantRequest = {
    name: '',
    address: {
      id: 0,
      latitude: '',
      longitude: '',
      city: '',
      conscriptionNumber: '',
      houseNumber: '',
      postcode: '',
      street: '',
      streetNumber: '',
      suburb: '',
      completeAddress: ''
    },
    requestedBy: ''
  };
  addresses: Address[] = [];
  filteredAddresses: Address[] = [];
  searchQuery: string = '';
  showAddresses: boolean = false;

  constructor(
    private restaurantService: RestaurantService,
    private addressService: AddressService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.fetchAddresses();
  }

  fetchAddresses(): void {
    this.addressService.getAddresses().subscribe((data: Address[]) => {
      this.addresses = data;
    });
  }

  filterAddresses(event: any): void {
    const query = event.target.value.toLowerCase();
    if (query.length >= 3) {
      this.filteredAddresses = this.addresses.filter(address =>
        `${address.street} ${address.houseNumber}, ${address.city}`.toLowerCase().includes(query)
      );
    } else {
      this.filteredAddresses = [];
    }
  }

  selectAddress(address: Address): void {
    this.restaurant.address = address;
    this.searchQuery = `${address.street} ${address.houseNumber}, ${address.city}`;
    this.filteredAddresses = [];
  }

  showAddressList(): void {
    this.showAddresses = true;
  }

  hideAddressList(): void {
    setTimeout(() => {
      this.showAddresses = false;
    }, 200); // Delay to allow click event to register
  }

  onSubmit() {
    this.authService.getUser().subscribe(user => {
      this.restaurant.requestedBy = user.userName;
      this.restaurantService.requestRestaurant(this.restaurant).subscribe(
        response => {
          alert('Restaurant request submitted successfully!');
          this.restaurant = {
            name: '',
            address: {
              id: 0,
              latitude: '',
              longitude: '',
              city: '',
              conscriptionNumber: '',
              houseNumber: '',
              postcode: '',
              street: '',
              streetNumber: '',
              suburb: '',
              completeAddress: ''
            },
            requestedBy: ''
          };
          this.searchQuery = '';
        },
        error => {
          console.error('Error submitting restaurant request:', error);
          alert('Error submitting restaurant request.');
        }
      );
    });
  }
}
