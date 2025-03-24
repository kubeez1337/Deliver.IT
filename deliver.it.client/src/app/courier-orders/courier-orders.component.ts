import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Order } from '../models/order.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OsrmService } from '../osrm.service';
import * as polyline from '@mapbox/polyline';
import * as L from 'leaflet';
import 'leaflet.markercluster';

@Component({
  selector: 'app-courier-orders',
  templateUrl: './courier-orders.component.html',
  styleUrls: ['./courier-orders.component.css'],
  standalone: false
})
export class CourierOrdersComponent implements OnInit {
  activeOrders: Order[] = [];
  optimalRoute: any;
  private map!: L.Map;
  private markerClusterGroup!: L.MarkerClusterGroup;
  private routeLayer!: L.GeoJSON;
  private markers: L.Marker[] = [];
  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private osrmService: OsrmService
  ) { }

  ngOnInit(): void {
    this.loadActiveOrders();
  }
  ngAfterViewInit(): void {
    this.initMap();
  }
  loadActiveOrders(): void {
    this.authService.getActiveOrders().subscribe(
      (orders) => {
        this.activeOrders = orders;
        this.addMarkers();
      },
      (error) => {
        console.error('Error fetching active orders', error);
        this.snackBar.open('Error fetching active orders', '', {
          duration: 3000,
        });
      }
    );
  }
  initMap(): void {
    this.map = L.map('map').setView([49.2231, 18.7394], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© Kubissoft'
    }).addTo(this.map);
    this.markerClusterGroup = L.markerClusterGroup({
      maxClusterRadius: 40,
      disableClusteringAtZoom: 18
    });
    this.map.addLayer(this.markerClusterGroup);
    this.map.on('moveend', () => {
      this.updateVisibleMarkers();
    });
  }
  drop(event: CdkDragDrop<Order[]>): void {
    moveItemInArray(this.activeOrders, event.previousIndex, event.currentIndex);
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
  addMarkers(): void {
    this.activeOrders.forEach(order => {
      if (order.customerAddress && order.customerAddress.latitude && order.customerAddress.longitude) {
        const marker = L.marker([parseFloat(order.customerAddress.latitude), parseFloat(order.customerAddress.longitude)])
          .bindPopup(`<b>${order.customerName}</b><br>${order.phoneNumber}</br><br>${order.customerAddress.completeAddress}`);
        this.markerClusterGroup.addLayer(marker);
      }
    });
  }
  computeOptimalRoute(): void {
    const coordinates = this.activeOrders.map(order => `${order.customerAddress.longitude},${order.customerAddress.latitude}`).join(';');
    this.osrmService.getRoute(coordinates).subscribe(
      (data) => {
        if (this.routeLayer) {
          this.map.removeLayer(this.routeLayer);
        }
        this.routeLayer = L.geoJSON(data.routes[0].geometry).addTo(this.map);
        this.map.fitBounds(this.routeLayer.getBounds());
      },
      (error) => {
        console.error('Error fetching route:', error);
        alert(`Error fetching route: ${error.message}`);
      }
    );
  }

}
