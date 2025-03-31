import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Order } from '../models/order.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OsrmService } from '../osrm.service';
import * as polyline from '@mapbox/polyline';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { OrderSortingService } from '../order-sorting.service';
import {ViewOrderDialogComponent} from '../view-order-dialog/view-order-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-courier-orders',
  templateUrl: './courier-orders.component.html',
  styleUrls: ['./courier-orders.component.css'],
  standalone: false
})
export class CourierOrdersComponent implements OnInit, AfterViewInit {
  activeOrders: Order[] = [];
  optimalRoute: any;
  private map!: L.Map;
  private markerClusterGroup!: L.MarkerClusterGroup;
  private routeLayer!: L.GeoJSON;
  private markers: L.Marker[] = [];
  private currentLat: number | null = null;
  private currentLon: number | null = null;
  private currentPositionMarker!: L.Marker;
  private currentPositionCircle!: L.Circle;
  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private osrmService: OsrmService,
    private orderSortingService: OrderSortingService,
    private dialog: MatDialog
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
  private initMap(): void {
    this.map = L.map('map').setView([49.2231, 18.7394], 13).whenReady(() => {
      setTimeout(() => {
        this.map.invalidateSize();
      }, 100);
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
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
    //this.addMarkers();
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
    if (this.currentLat !== null && this.currentLon !== null) {
      const currentPosition = `${this.currentLon},${this.currentLat}`;
      const coordinates = this.activeOrders.map(order => `${order.customerAddress.longitude},${order.customerAddress.latitude}`).join(';');
      const fullCoordinates = `${currentPosition};${coordinates}`;

      this.osrmService.getRoute(fullCoordinates).subscribe(
        (data) => {
          if (this.routeLayer) {
            this.map.removeLayer(this.routeLayer);
          }
          this.routeLayer = L.geoJSON(data.routes[0].geometry).addTo(this.map);
          this.map.fitBounds(this.routeLayer.getBounds());
          //this.calculateDistancesFromRoute(data.routes[0].legs);
        },
        (error) => {
          console.error('Error fetching route:', error);
          alert(`Error fetching route: ${error.message}`);
        }
      );
    } else {
      alert('Current location is not available.');
    }
  }
  loadCurrentPosition(): void {
    this.orderSortingService.getCurrentLocation().subscribe(
      (position) => {
        this.currentLat = position.coords.latitude;
        this.currentLon = position.coords.longitude;
        this.map.setView([this.currentLat, this.currentLon], 13);
        const accuracy = position.coords.accuracy;
        const redIcon = L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          shadowSize: [41, 41]
        });
        if (this.currentPositionMarker) {
          this.map.removeLayer(this.currentPositionMarker);
        }
        if (this.currentPositionCircle) {
          this.map.removeLayer(this.currentPositionCircle);
        }

        this.currentPositionMarker = L.marker([this.currentLat, this.currentLon], { icon: redIcon })
          .bindPopup('Current Position')
          .addTo(this.map);

        this.currentPositionCircle = L.circle([this.currentLat, this.currentLon], {
          color: 'blue',
          fillColor: '#4A90E2',
          fillOpacity: 0.3,   
          radius: accuracy    
        }).addTo(this.map);
      },
      (error) => {
        console.error('Error fetching current location:', error);
        alert(`Error fetching current location: ${error.message}`);
      }
    );
  }
  calculateDistancesFromRoute(legs: any[]): void {
    this.activeOrders.forEach((order, index) => {
      if (legs[index + 1]) {
        order.distance = legs[index + 1].distance / 1000;
      } else {
        order.distance = Infinity;
      }
    });
  }
  sortOrdersByFurthest(): void {
    if (this.currentLat !== null && this.currentLon !== null) {
      const currentPosition = `${this.currentLon},${this.currentLat}`;
      const coordinates = this.activeOrders
        .map(order => `${order.customerAddress.longitude},${order.customerAddress.latitude}`)
        .join(';');

      const fullCoordinates = `${currentPosition};${coordinates}`;

      this.osrmService.getDistanceMatrix(fullCoordinates).subscribe(
        (data) => {
          const distances = data.distances[0];

          this.activeOrders.forEach((order, index) => {
            order.distance = distances[index + 1] / 1000; 
          });

          this.activeOrders.sort((a, b) => (b.distance ?? 0) - (a.distance ?? 0));

          console.log('Sorted Orders:', this.activeOrders);
        },
        (error) => {
          console.error('Error fetching distance matrix:', error);
          alert(`Error fetching distance matrix: ${error.message}`);
        }
      );
    } else {
      alert('Current location is not available.');
    }
  }
  sortOrdersByClosest(): void {
    if (this.currentLat !== null && this.currentLon !== null) {
      const currentPosition = `${this.currentLon},${this.currentLat}`;
      const coordinates = this.activeOrders
        .map(order => `${order.customerAddress.longitude},${order.customerAddress.latitude}`)
        .join(';');

      const fullCoordinates = `${currentPosition};${coordinates}`;

      this.osrmService.getDistanceMatrix(fullCoordinates).subscribe(
        (data) => {
          const distances = data.distances[0];

          this.activeOrders.forEach((order, index) => {
            order.distance = distances[index + 1] / 1000; 
          });

          this.activeOrders.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0)); 

          console.log('Sorted Orders (Closest First):', this.activeOrders);
        },
        (error) => {
          console.error('Error fetching distance matrix:', error);
          alert(`Error fetching distance matrix: ${error.message}`);
        }
      );
    } else {
      alert('Current location is not available.');
    }
  }
  sortOrdersByOldest(): void {
    this.activeOrders.sort((a, b) => {
      const timeA = a.timeCreated ? new Date(a.timeCreated).getTime() : 0;
      const timeB = b.timeCreated ? new Date(b.timeCreated).getTime() : 0;
      return timeA - timeB; 
    });

    console.log('Sorted Orders (Oldest First):', this.activeOrders);
  }
  sortOrdersByMostFoodItems(): void {
    this.activeOrders.sort((a, b) => {
      const totalItemsA = a.orderFoods.reduce((sum, food) => sum + food.quantity, 0);
      const totalItemsB = b.orderFoods.reduce((sum, food) => sum + food.quantity, 0);
      return totalItemsB - totalItemsA; // Most food items first
    });

    console.log('Sorted Orders (Most Food Items First):', this.activeOrders);
  }
  viewOrderInfo(order: Order): void {
    if (order.customerAddress.latitude && order.customerAddress.longitude) {
      const lat = parseFloat(order.customerAddress.latitude);
      const lon = parseFloat(order.customerAddress.longitude);

      
      this.map.setView([lat, lon], 15);

      
      const orderMarker = this.markers.find(marker => {
        const markerLatLng = marker.getLatLng();
        return markerLatLng.lat === lat && markerLatLng.lng === lon;
      });

      if (orderMarker) {
        orderMarker.openPopup();
      }
    }
  }
  viewOrderDetails(order: Order): void {
    this.dialog.open(ViewOrderDialogComponent, {
      width: '400px',
      data: order
    });
  }
  
}
