import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth-gaurd';
import { SubscribedBusesComponent } from './features/bus/subscribed-buses/subscribed-buses.component';
import { LoginComponent } from './features/login/login.component';
import { AllStopsComponent } from './features/stops/all-stops/all-stops.component';
import { StopViewComponent } from './features/stops/stop-view/stop-view.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: "buses",
    component: SubscribedBusesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "stops",
    component: AllStopsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "stops/single/:id",
    component: StopViewComponent,
    canActivate: [AuthGuard]
  },
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
