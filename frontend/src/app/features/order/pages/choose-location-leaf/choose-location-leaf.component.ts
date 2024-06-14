import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { MessageDialogService } from 'src/app/shared/dialogs/message-dialog/message-dialog.service';
import { CartService } from 'src/app/features/cart/services/cart.service';


const config = {
  latitude: 5.537216, longitude: 2.3488896  // Default coordinates
}

@Component({
  selector: 'app-choose-location-leaf',
  templateUrl: './choose-location-leaf.component.html',
  styleUrls: ['./choose-location-leaf.component.scss']
})
export class ChooseLocationLeafComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('mapId', { static: true }) mapContainer!: ElementRef;
  loading = true;
  map!: L.Map;
  marker!: L.Marker;

  constructor(
    private messageDialogService: MessageDialogService,
    private cartService: CartService,
    private router: Router,
    private httpClient: HttpClient,
    private location: Location,
  ) { }

  ngOnInit(): void {
    // this.initMap();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
  async initMap(): Promise<void> {
    try {
      await this.loadMapScript();
      this.setupMap();
    } catch (error) {
      this.messageDialogService.openMessageDlg({message: 'Failed to load map', type: 'error'});
      this.loadMapFallback();
    }
  }

  private async loadMapScript(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet/dist/leaflet.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Script load error'));
      document.head.appendChild(script);
    });
  }

  private setupMap(): void {
    try {
      const initialCoords: L.LatLngExpression = [config.latitude, config.longitude]; // Default coordinates

      this.map = L.map(this.mapContainer.nativeElement).setView(initialCoords, 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);
      this.marker = L.marker(initialCoords, { draggable: true }).addTo(this.map);
      const popupMessage = "<b>Hello OSM world!</b><br>I am a popup.";
      this.marker.bindPopup(popupMessage).openPopup();

      this.marker.on('dragend', this.handleMarkerDragEnd.bind(this));

      this.setupGeolocation();
    } catch (error) {
      console.error('Failed to setup the map:', error);
      this.messageDialogService.openMessageDlg({message: 'Map setup failed', type: 'error'});
    }
  }

  private handleMarkerDragEnd(): void {
    const position = this.marker.getLatLng();
    this.cartService.saveShippingLocation(position.lat, position.lng);
  };

  private setupGeolocation(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      const currentPos: L.LatLngExpression = [position.coords.latitude, position.coords.longitude];
      this.map.setView(currentPos, 13);
      this.marker.setLatLng(currentPos);
    }, (err) => {
      this.messageDialogService.openMessageDlg({message: err.message, type: 'error'});
    });
  }

  confirm(): void {
    const position = this.marker.getLatLng();
    this.cartService.saveShippingLocation(position.lat, position.lng);
    this.router.navigate(['/shipping']);
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy(): void {
    try {
      this.map.remove();
    } catch (error) {
      console.error('Failed to remove the map:', error);
      this.messageDialogService.openMessageDlg({message: 'Error removing map', type: 'error'});
    }
  }

  private loadMapFallback(): void {
    try {
      const mapContainer = document.getElementById('mapId');
      if (mapContainer) {
        mapContainer.innerHTML = 'Map failed to load. Showing fallback content.';
        mapContainer.style.backgroundColor = '#f2f2f2';
        mapContainer.style.padding = '16px';
        mapContainer.style.textAlign = 'center';
        mapContainer.style.fontWeight = 'bold';
        mapContainer.style.color = '#666666';
        mapContainer.style.border = '1px solid #cccccc';
        mapContainer.style.borderRadius = '4px';
        mapContainer.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
      } else {
        throw new Error('Map container not found.');
      }
    } catch (err: any) {
      console.error(err);
      this.messageDialogService.openMessageDlg({message: err.message, type: 'error'});
    }
  }

}