import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/core/data-service';
import { Stop } from 'src/app/shared/models/stops.model';
import SharedDataService from 'src/app/shared/service/shared-data.service';

@Component({
  selector: 'app-all-stops',
  templateUrl: './all-stops.component.html',
  styleUrls: ['./all-stops.component.scss']
})
export class AllStopsComponent implements OnInit {

  cols: any[] = [];
  stops: Stop[] = [];
  searchText: string = '';
  totalRecords = 0;

  constructor(
    private dataService: DataService,
    private router: Router) { }

  ngOnInit(): void {
    this.cols = [
      { field: 'stopId', header: 'Id' },
      { field: 'name', header: 'Name' },
      { field: 'desc', header: 'Description' },
      { field: 'latitude', header: 'Latitude' },
      { field: 'longitude', header: 'Longitude' },
    ];
    this.getAllStops();
  }

  getAllStops() {
    this.dataService.getAllStops().subscribe(data => {
      this.stops = data.stops;
      this.totalRecords = this.stops.length;
    });
  }

  onStopsSelection(stop: Stop) {
    SharedDataService.stop = stop;
    this.router.navigate(['stops/single', stop.stopId]);
  }

}
