import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  navItems: MenuItem[] = [];
  activeRoute = -1;

  constructor(private router: Router) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.url.indexOf('buses') !== -1) {
          this.activeRoute = 0;
        } else if (event.url.indexOf('stops') !== -1) {
          this.activeRoute = 1;
        }
        this.setUpMenu();
      });
  }

  ngOnInit(): void {
    this.setUpMenu();
  }

  setUpMenu() {
    this.navItems = [
      {
        label: 'Buses',
        icon: 'ei ei-bus',
        routerLink: './buses',
        routerLinkActiveOptions: {},
        styleClass: (this.activeRoute === 0) ? 'ui-state-active' : ''
      },
      {
        label: 'Stops',
        icon: 'ei ei-cart',
        routerLink: './stops',
        routerLinkActiveOptions: {},
        styleClass: (this.activeRoute === 0) ? 'ui-state-active' : ''
      }
    ];
  }

}
