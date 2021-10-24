import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng';
import { DataService } from 'src/app/core/data-service';
import { Location } from 'src/app/shared/models/location.model';
import { Predictions } from 'src/app/shared/models/predictions.model';
import { Stop } from 'src/app/shared/models/stops.model';
import { VehicleMarker } from 'src/app/shared/models/vehicle-marker.model';
import SharedDataService from 'src/app/shared/service/shared-data.service';

@Component({
  selector: 'app-stop-view',
  templateUrl: './stop-view.component.html',
  styleUrls: ['./stop-view.component.scss'],
  providers: [MessageService]
})
export class StopViewComponent implements OnInit {

  cols: any[] = [];
  stop!: Stop;
  stopLongitude!: number;
  stopId!: number;
  predictions: Predictions[] = [];
  busLocations: VehicleMarker[] = [];
  currentLocation!: Location;
  selectedBuses: VehicleMarker[] = [];
  showBuses = false;
  userName?: string;

  constructor(
    private activatedroute: ActivatedRoute,
    private dataService: DataService,
    private sharedDataService: SharedDataService,
    private messageService: MessageService) {
    this.stopId = +this.activatedroute.snapshot.paramMap.get("id")!;
  }

  ngOnInit(): void {
    this.userName = this.sharedDataService.userName;
    this.cols = [
      { field: 'busId', header: 'Number' },
      { field: 'latitude', header: 'Latitude' },
      { field: 'longitude', header: 'Longitude' },
      { field: 'routeId', header: 'RouteId' },
      { field: 'destination', header: 'Destination' },
      { field: 'distance', header: 'Distance' },
      { field: 'delay', header: 'Delay' }
    ];

    this.stop = SharedDataService.stop;
    this.setCurrentLocation()
    this.getPredicitons();
  }

  getPredicitons() {
    this.dataService.getAllStopPredictions(this.stopId).subscribe(data => {
      this.predictions = data.predictions;
      const busIds = this.predictions.map(x => +x.vehicleId);
      this.busLocations = [];
      this.dataService.getVehicleLocation(busIds).subscribe(allLoc => {
        allLoc.locations.forEach(loc => {
          const temp: VehicleMarker = {
            latitude: +loc.latitude,
            longitude: +loc.longitude,
            busId: +loc.vehicleId,
            distance: +loc.distance,
            routeId: +loc.routeId,
            destination: loc.destination,
            delay: loc.delay === false ? 'No' : 'Yes'
          };
          this.busLocations.push(temp);

        });
      });
    });
  }

  setCurrentLocation() {
    this.currentLocation = {
      latitude: +this.stop.latitude,
      longitude: +this.stop.longitude,
    }
  }

  get noOfSelectedBus() {
    return this.selectedBuses?.length;
  }

  subscribeBuses() {
    this.dataService.addUserSubscriptions(this.userName!, this.selectedBuses.map(x => x.busId!)).subscribe(data => {
      console.log('buses subscribed');
      this.selectedBuses = [];
      this.messageService.add({ severity: 'success', summary: 'Buses Subscribed' });
    })
  }
}
