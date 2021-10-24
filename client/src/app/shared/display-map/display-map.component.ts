import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Location } from '../models/location.model';
import { VehicleMarker } from '../models/vehicle-marker.model';

@Component({
  selector: 'app-display-map',
  templateUrl: './display-map.component.html',
  styleUrls: ['./display-map.component.scss']
})
export class DisplayMapComponent implements OnInit {

  private displayLocationsLocal: VehicleMarker[] = [];
  private currentLocationLocal!: Location;

  get currentLocation(): Location {
    return this.currentLocationLocal;
  }
  @Input() set currentLocation(value: Location) {
    this.currentLocationLocal = value;
    this.addCurrentLocation();
  }

  get displayLocations(): VehicleMarker[] {
    return this.displayLocationsLocal;
  }
  @Input() set displayLocations(value: VehicleMarker[]) {
    if (value.length > 0) {
      this.displayLocationsLocal = value;
      this.addLocations();
    }
  }

  apiLoaded: Observable<boolean>;
  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  markers: any[] = [];

  constructor(httpClient: HttpClient) {
    this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyBOJ4jGecnLXC20MTDsxMX8Roln9IIytEw', 'callback')
      .pipe(
        map(() => true),
        catchError(() => of(false)),
      );
  }

  ngOnInit(): void {
  }

  addLocations() {
    this.displayLocations.forEach(loc => {
      this.markers.push({
        position: {
          lat: +loc.latitude,
          lng: +loc.longitude
        },
        label: {
          color: 'black',
          text: loc.busId?.toString()
        },
        title: loc.busId?.toString()
      })
    });
  }

  addCurrentLocation() {
    this.center = { lat: +this.currentLocationLocal.latitude, lng: +this.currentLocationLocal.longitude };
  }

  openInfo(markerInfo: any) {
    debugger;
  }
}
