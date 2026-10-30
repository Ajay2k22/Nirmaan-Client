import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.page.html',
  styleUrls: ['./location-picker.page.scss'],
})
export class LocationPickerPage implements AfterViewInit {
  map!: L.Map;
  marker!: L.Marker;
  lat = 19.2094; lng = 73.1955;
  address = 'Tap on map to select';
  searchText = '';

  constructor(private router: Router) {}

  ngAfterViewInit() { setTimeout(() => this.initMap(), 300); }

  initMap() {
    this.map = L.map('picker-map').setView([this.lat, this.lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OSM' }).addTo(this.map);
    this.marker = L.marker([this.lat, this.lng], { draggable: true }).addTo(this.map);

    this.map.on('click', (e: any) => this.update(e.latlng.lat, e.latlng.lng));
    this.marker.on('dragend', () => {
      const p = this.marker.getLatLng();
      this.update(p.lat, p.lng);
    });
    this.myLocation();
  }

  update(lat: number, lng: number) {
    this.lat = lat; this.lng = lng;
    this.marker.setLatLng([lat, lng]);
    this.map.setView([lat, lng]);
    this.reverse();
  }

  async myLocation() {
    try {
      const pos = await Geolocation.getCurrentPosition();
      this.update(pos.coords.latitude, pos.coords.longitude);
    } catch {}
  }

  async reverse() {
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${this.lat}&lon=${this.lng}`);
      const d = await r.json();
      this.address = d.display_name;
    } catch {}
  }

  async search() {
    if (!this.searchText) return;
    const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${this.searchText}&limit=1`);
    const d = await r.json();
    if (d[0]) this.update(parseFloat(d[0].lat), parseFloat(d[0].lon));
  }

  confirm() {
    this.router.navigate(['/create-complaint'], { state: { lat: this.lat, lng: this.lng, address: this.address } });
  }
}
