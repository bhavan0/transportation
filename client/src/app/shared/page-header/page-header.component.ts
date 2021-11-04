import { Component, OnInit } from '@angular/core';
import SharedDataService from '../service/shared-data.service';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent implements OnInit {

  userName = '';

  constructor(private sharedDataService: SharedDataService) { 
    this.userName = this.sharedDataService.userName;
  }

  ngOnInit(): void {
  }

}
