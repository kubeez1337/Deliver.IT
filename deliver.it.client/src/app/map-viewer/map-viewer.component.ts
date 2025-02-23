import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-viewer',
  templateUrl: './map-viewer.component.html',
  styleUrls: ['./map-viewer.component.css'],
  standalone: false
})
export class MapViewerComponent implements AfterViewInit {

  private map!: L.Map;
  private marker!: L.Marker;

  constructor() { }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© Kubissoft'
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }
      this.marker = L.marker(e.latlng).addTo(this.map);
      // Optionally, you can store the coordinates in a service or component property
      console.log(`Latitude: ${e.latlng.lat}, Longitude: ${e.latlng.lng}`);
    });
    setTimeout(() => {
      this.map.invalidateSize();
    }, 0);
  }

}
