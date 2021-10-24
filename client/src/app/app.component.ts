import { Component } from '@angular/core';
import { DataService } from './core/data-service';
import { environment } from 'src/environments/environment';
import SharedDataService from './shared/service/shared-data.service';
import { Router } from '@angular/router';
import { EventService } from './shared/service/event.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'transportation-client';
  configLoaded = false;
  loaded = false;

  constructor(
    private dataService: DataService,
    private sharedDataService: SharedDataService,
    private router: Router,
    private eventService: EventService) {

  }

  ngOnInit(): void {
    this.loadConfigurations();
  }

  loadConfigurations() {
    this.dataService.loadAssetConfigurations(environment.configurationPath).then(() => {
      this.configLoaded = true;
      this.validateLogin();
    });
  }

  validateLogin() {
    if (this.sharedDataService.userName?.length === 0) {
      this.loaded = false;
      this.eventService.onLogin().subscribe((change: boolean) => {
        if (change) {
          this.loaded = true;
        }
      });
      this.router.navigate(['login']);
    } else {
      this.loaded = true;
    }
  }
}
