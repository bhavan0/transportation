import { Component, OnInit } from '@angular/core';
import { DialogService, MessageService } from 'primeng';
import { DataService } from 'src/app/core/data-service';
import { Bus } from 'src/app/shared/models/bus.model';
import { SocketService } from 'src/app/shared/service/socket-service';
import { AddBusesComponent } from '../add-buses/add-buses.component';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-all-buses',
  templateUrl: './all-buses.component.html',
  styleUrls: ['./all-buses.component.scss'],
  providers: [DialogService, MessageService]
})
export class AllBusesComponent implements OnInit {

  cols: any[] = [];
  buses: Bus[] = [];
  busDetailsRef: any;
  private socket: any;

  constructor(
    private dialogService: DialogService,
    private messageService: MessageService,
    private dataService: DataService) { 
      this.socket = io('http://localhost:5000');
    }

  ngOnInit(): void {
    this.cols = [
      { field: 'number', header: 'Number' },
      { field: 'name', header: 'Name' }
    ];
    this.getAllBuses();
  }

  getAllBuses() {
    this.dataService.getAllBuses().subscribe(data => {
      this.buses = data.buses;
    });
  }

  onAddBus() {
    this.busDetailsRef = this.dialogService.open(AddBusesComponent, {
      header: 'Bus Details',
      width: '680px'
    });

    this.busDetailsRef.onClose.subscribe((updatedBus: Bus) => {
      if (updatedBus.name) {
        this.displayToaster();
        this.getAllBuses();
      }
    });
  }

  onEditBus(bus: Bus) {
    this.busDetailsRef = this.dialogService.open(AddBusesComponent, {
      header: 'Bus Details',
      width: '680px',
      data: { bus: { ...bus } }
    });

    this.busDetailsRef.onClose.subscribe((updatedBus: Bus) => {
      if (updatedBus.name) {
        this.displayToaster();
        this.getAllBuses();
      }
    });
  }

  displayToaster() {
    this.messageService
      .add({
        severity: 'success',
        detail: 'Bus updated successfully'
      });
  }

  updateLocation() {
    this.sendmessage();
    this.setReceiveMethod();
  }

  setReceiveMethod() {
    // var socket = io('http://localhost:5000');
    this.socket.on('data-tmp', (data: any) => {
      console.log(data);
    });
  }

  sendmessage() {
    // var socket = io('http://localhost:5000');
    const data ={
      'test': 1,
      'test2': 2
    }
    this.socket.emit('new-message', data);
  }

}
