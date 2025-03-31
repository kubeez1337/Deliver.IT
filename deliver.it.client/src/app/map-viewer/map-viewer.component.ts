import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { Order } from '../models/order.model';
import { OrderService } from '../order.service';
import { AddressService } from '../address.service';
import { Address } from '../models/address.model';
import { OsrmService } from '../osrm.service';
import * as polyline from '@mapbox/polyline';

@Component({
  selector: 'app-map-viewer',
  templateUrl: './map-viewer.component.html',
  styleUrls: ['./map-viewer.component.css'],
  standalone: false
})
export class MapViewerComponent implements AfterViewInit, OnInit {

  @Output() addressSelected = new EventEmitter<Address>();
  private map!: L.Map;
  private marker!: L.Marker;
  private orders: Order[] = [];
  private addresses: Address[] = [];
  private markers: L.Marker[] = [];
  private markerClusterGroup!: L.MarkerClusterGroup;
  private routeLayer!: L.GeoJSON;

  constructor(private orderService: OrderService, private addressService: AddressService, private osrmService: OsrmService) { }
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
    this.markerClusterGroup = L.markerClusterGroup({
      maxClusterRadius: 40,
      disableClusteringAtZoom: 18
    });
    this.map.addLayer(this.markerClusterGroup);
    this.map.on('moveend', () => {
      this.updateVisibleMarkers();
    });
  }
  private loadAddresses(): void {
    this.addressService.getAddresses().subscribe(
      (data: Address[]) => {
        this.addresses = data;
        this.addAddressMarkers();
      },

      (error) => {
        console.error('Error fetching addresses:', error);
      }
    );
  }
  private addAddressMarkers(): void {
    this.addresses.forEach(address => {
      const marker = L.marker([parseFloat(address.latitude), parseFloat(address.longitude)])
        .bindPopup(`${address.street} ${address.houseNumber}, ${address.city}`)
        .on('click', () => this.addressSelected.emit(address));

      this.markerClusterGroup.addLayer(marker);
    });
  }
  private addMarkers(): void {
    this.orders.forEach(order => {
      if (order.customerAddress && order.customerAddress.latitude && order.customerAddress.longitude) {
        const marker = L.marker([parseFloat(order.customerAddress.latitude), parseFloat(order.customerAddress.longitude)])
          .bindPopup(`<b>${order.customerName}</b><br>${order.phoneNumber}</br><br>${order.customerAddress.completeAddress}`);
        this.markerClusterGroup.addLayer(marker);
      }
    });
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
  calculateRoute(): void {
    const coordinates = this.orders.map(order => `${order.customerAddress.longitude},${order.customerAddress.latitude}`).join(';');
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
  calculateTrip(): void {
    const coordinates = this.orders.map(order => `${order.customerAddress.longitude},${order.customerAddress.latitude}`).join(';');
    this.osrmService.getOptimizedRoute(coordinates).subscribe(
      (data) => {
        if (this.routeLayer) {
          this.map.removeLayer(this.routeLayer);
        }
        if (data.trips && data.trips.length > 0) {
          const decodedGeometry = polyline.toGeoJSON(data.trips[0].geometry);
          this.routeLayer = L.geoJSON(decodedGeometry).addTo(this.map);
          this.map.fitBounds(this.routeLayer.getBounds());
        } else {
          console.error('No trips found in the response');
          alert('No trips found in the response');
        }
      },
      (error) => {
        console.error('Error fetching route:', error);
        alert(`Error fetching route: ${error.message}`);
      }
    );
  }
  addAll(): void {
    this.addresses.forEach(address => {
      if (address.latitude && address.longitude) {
        const marker = L.marker([parseFloat(address.latitude), parseFloat(address.longitude)])
          .bindPopup(`<b>${address.completeAddress}</b>`);
        //this.markers.push(marker);
        this.markerClusterGroup.addLayer(marker);
      }
    });
    this.updateVisibleMarkers();
  }

  deleteAll(): void {
    this.markerClusterGroup.clearLayers();
    this.markers.forEach(marker => {
      if (this.map.hasLayer(marker)) {
        marker.remove();
      }
    });
    this.markers = [];
    this.addMarkers();
  }
      
  
}
