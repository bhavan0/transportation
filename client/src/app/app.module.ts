import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AllBusesComponent } from './features/bus/all-buses/all-buses.component';
import { AddBusesComponent } from './features/bus/add-buses/add-buses.component';
import { ButtonModule, DialogModule, DynamicDialogModule, InputTextModule, TableModule, ToastModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './shared/header/header.component';
import { PageHeaderComponent } from './shared/page-header/page-header.component';
import { MenubarModule } from 'primeng/menubar';
import { DisplayMapComponent } from './shared/display-map/display-map.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { AllStopsComponent } from './features/stops/all-stops/all-stops.component';
import { HighlightTextPipe } from './shared/pipes/highlight-text.pipe';
import { StopViewComponent } from './features/stops/stop-view/stop-view.component';
import { SubscribedBusesComponent } from './features/bus/subscribed-buses/subscribed-buses.component';
import { LoginComponent } from './features/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    AllBusesComponent,
    AddBusesComponent,
    HeaderComponent,
    PageHeaderComponent,
    DisplayMapComponent,
    AllStopsComponent,
    HighlightTextPipe,
    StopViewComponent,
    SubscribedBusesComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TableModule,
    DynamicDialogModule,
    DialogModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MenubarModule,
    GoogleMapsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
