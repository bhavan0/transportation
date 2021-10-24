import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/core/data-service';
import { EventService } from 'src/app/shared/service/event.service';
import SharedDataService from 'src/app/shared/service/shared-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userName: string = '';
  returnUrl?: string;

  constructor(
    private sharedDataService: SharedDataService,
    private router: Router,
    private route: ActivatedRoute,
    private eventService: EventService,
    private dataService: DataService
  ) {
    if (this.sharedDataService.userName?.length > 0) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get disableSave() {
    return this.userName?.length === 0;
  }

  login() {
    this.sharedDataService.userName = this.userName;
    this.dataService.addUser(this.userName).subscribe(data => {
      this.eventService.updateLoginRecieved();
      this.router.navigate([this.returnUrl]);
    });
  }
}
