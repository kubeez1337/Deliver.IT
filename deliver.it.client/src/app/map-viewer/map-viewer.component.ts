import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Order } from '../models/order.model';
import { OrderService } from '../order.service';

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

  constructor(private orderService: OrderService) { }
  ngOnInit(): void {
    this.loadOrders();
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

  }
  private addMarkers(): void {
    this.orders.forEach(order => {
      if (order.customerAddress && order.customerAddress.latitude && order.customerAddress.longitude) {
        const marker = L.marker([parseFloat(order.customerAddress.latitude), parseFloat(order.customerAddress.longitude)])
          .addTo(this.map)
          .bindPopup(`<b>${order.customerName}</b><br>${order.phoneNumber}</br><br>${order.customerAddress.completeAddress}`);
      }
    });
  }

}
