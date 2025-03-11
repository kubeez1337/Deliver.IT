import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Order } from '../models/order.model';
import { OrderService } from '../order.service';
import { AddressService } from '../address.service';
import { Address } from '../models/address.model';

@Component({
  selector: 'app-map-viewer',
  templateUrl: './map-viewer.component.html',
  styleUrls: ['./map-viewer.component.css'],
  standalone: false
})
export class MapViewerComponent implements AfterViewInit, OnInit {

  private map!: L.Map;
  private marker!: L.Marker;
  private orders: Order[] = [];
  private addresses: Address[] = [];
  private markers: L.Marker[] = [];
  constructor(private orderService: OrderService, private addressService: AddressService) { }
  ngOnInit(): void {
    this.loadOrders();
    this.loadAddresses();
  }
  ngAfterViewInit(): void {
    this.initMap();
  }
  private loadOrders(): void {
    this.orderService.getOrders().subscribe(
      (data: Order[]) => {
        this.orders = data;
        this.addMarkers();
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }
  private initMap(): void {
    this.map = L.map('map').setView([49.2231, 18.7394], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© Kubissoft'
    }).addTo(this.map);

    this.map.on('moveend', () => {
      this.updateVisibleMarkers();
    });
  }
  private loadAddresses(): void {
    this.addressService.getAddresses().subscribe(
      (data: Address[]) => {
        this.addresses = data;
      },
      (error) => {
        console.error('Error fetching addresses:', error);
      }
    );
  }
  private addMarkers(): void {
    this.orders.forEach(order => {
      if (order.customerAddress && order.customerAddress.latitude && order.customerAddress.longitude) {
        const marker = L.marker([parseFloat(order.customerAddress.latitude), parseFloat(order.customerAddress.longitude)])
          .addTo(this.map)
          .bindPopup(`<b>${order.customerName}</b><br>${order.phoneNumber}</br><br>${order.customerAddress.completeAddress}`);
        this.markers.push(marker);
      }
    });
    this.updateVisibleMarkers();
  }
  private updateVisibleMarkers(): void {
    const bounds = this.map.getBounds();
    this.markers.forEach(marker => {
      if (bounds.contains(marker.getLatLng())) {
        if (!this.map.hasLayer(marker)) {
          marker.addTo(this.map);
        }
      } else {
        if (this.map.hasLayer(marker)) {
          marker.remove();
        }
      }
    });
  }
  addAll(): void {
    this.addresses.forEach(address => {
      if (address.latitude && address.longitude) {
        const marker = L.marker([parseFloat(address.latitude), parseFloat(address.longitude)])
          .bindPopup(`<b>${address.completeAddress}</b>`);
        this.markers.push(marker);
      }
    });
    this.updateVisibleMarkers();
  }

  deleteAll(): void {
    this.markers.forEach(marker => {
      if (this.map.hasLayer(marker)) {
        marker.remove();
      }
    });
    this.markers = [];
    this.addMarkers();
  }
      
  
}
