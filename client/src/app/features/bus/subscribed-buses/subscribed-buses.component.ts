import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/core/data-service';
import { SubscribedBus } from 'src/app/shared/models/subscribed-bus.model';
import SharedDataService from 'src/app/shared/service/shared-data.service';
import { SocketService } from 'src/app/shared/service/socket-service';

@Component({
  selector: 'app-subscribed-buses',
  templateUrl: './subscribed-buses.component.html',
  styleUrls: ['./subscribed-buses.component.scss'],
  providers: [MessageService]
})
export class SubscribedBusesComponent implements OnInit, OnDestroy {

  cols: any[] = [];
  allBuses: SubscribedBus[] = [];
  subscriptions: Subscription[] = [];
  selectedBuses: SubscribedBus[] = [];
  userName?: string;

  constructor(
    private socketService: SocketService,
    private dataService: DataService,
    private sharedDataService: SharedDataService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.socketService.connect();
    this.userName = this.sharedDataService.userName;
    this.cols = [
      { field: 'vehicleId', header: 'Number' },
      { field: 'latitude', header: 'Latitude' },
      { field: 'longitude', header: 'Longitude' },
      { field: 'routeId', header: 'RouteId' },
      { field: 'destination', header: 'Destination' },
      { field: 'distance', header: 'Distance' },
      { field: 'delay', header: 'Delay' }
    ];
    this.getCurrentSubscribedBuses();
    this.getBuses();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => {
      x.unsubscribe();
    })
    this.socketService.emit('disconnect-client', this.userName!);
    this.socketService.disconnect(this.userName!);
  }

  getCurrentSubscribedBuses() {
    this.dataService.getCurrentSubscribedBuses(this.userName!).subscribe(allLoc => {
      this.allBuses = [];
      allLoc.locations.forEach(loc => {
        const temp: SubscribedBus = {
          latitude: +loc.latitude,
          longitude: +loc.longitude,
          vehicleId: +loc.vehicleId,
          distance: +loc.distance,
          routeId: +loc.routeId,
          destination: loc.destination,
          delay: loc.delay === false ? 'No' : 'Yes'
        };
        this.allBuses.push(temp);
      });
    });
  }

  getBuses() {
    this.socketService.emit('user', this.userName);
    this.subscriptions.push(this.socketService.listen(this.userName + '-res').subscribe(data => {
      const buses = JSON.parse(data);

      console.log(buses)


      buses?.forEach((serverBus: any) => {
        let busData = this.allBuses.filter(x => +x.vehicleId === +serverBus.vehicleId)?.shift();

        if (busData != null || busData != undefined) {
          busData!.latitude = +serverBus.latitude;
          busData!.longitude = +serverBus.longitude;
          busData!.distance = +serverBus.distance;
          busData!.destination = serverBus.destination;
          busData!.delay = serverBus.delay === false ? 'No' : 'Yes'
          busData!.routeId = serverBus.routeId;
        }
      });

      this.allBuses = [...this.allBuses];
      this.busUpdatedToaster();
    }));
  }

  unsubscribeBuses() {
    this.dataService.removeSubscription(this.userName!, this.selectedBuses.map(x => x.vehicleId))
      .subscribe(data => {
        this.allBuses = this.allBuses.filter(x => !this.selectedBuses.map(s => s.vehicleId).includes(x.vehicleId));
        this.messageService.add({ severity: 'success', summary: 'Buses Unsubscribed' });
      });
  }

  get noOfSelectedBus() {
    return this.selectedBuses?.length;
  }

  busUpdatedToaster() {
    this.messageService.add({ severity: 'success', summary: 'Buses Updated' });
  }

}
