import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Bus } from "../shared/models/bus.model";
import { HttpClient } from '@angular/common/http';
import { AllBusesResponse } from "../shared/models/all-buses-response.model";
import { AllStopsResponse } from "../shared/models/all-stops-response.model";
import { AllPredictionsResponse } from "../shared/models/all-predictions-response.model";
import { AllVehicleLocationResponse } from "../shared/models/all-vehicle-location-response.model";

@Injectable({
    providedIn: 'root'
})
export class DataService {

    apiBaseUrl = '';

    constructor(private httpClient: HttpClient) {
    }

    loadAssetConfigurations(configPath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.httpClient.get(configPath).toPromise().then((response: any) => {
                this.apiBaseUrl = response.apiBaseUrl;
                return resolve(this.apiBaseUrl);
            }).then(() => resolve(this.apiBaseUrl))
                .catch(() => reject());
        });
    }

    getAllBuses(): Observable<AllBusesResponse> {
        const url = 'buses';
        return this.getData<AllBusesResponse>(url);
    }

    addBus(bus: Bus): Observable<boolean> {
        const url = 'buses';
        return this.postData(url, bus);
    }

    updateBus(bus: Bus): Observable<boolean> {
        const url = 'buses';
        return this.putData(url, bus);
    }

    getAllStops(): Observable<AllStopsResponse> {
        const url = 'stops';
        return this.getData<AllStopsResponse>(url);
    }

    getAllStopPredictions(stopId: number): Observable<AllPredictionsResponse> {
        const url = `predictions?stopId=${stopId}`
        return this.getData<AllPredictionsResponse>(url);
    }

    getVehicleLocation(vehicleIds: number[]): Observable<AllVehicleLocationResponse> {
        const url = `vehicles?vid=${vehicleIds.join()}`
        return this.getData<AllVehicleLocationResponse>(url);
    }

    getCurrentSubscribedBuses(userName: string): Observable<AllVehicleLocationResponse>{
        const url = `user/subscribed-vehicles?userName=${userName}`
        return this.getData<AllVehicleLocationResponse>(url);
    }

    addUser(userName: string): Observable<any> {
        const url = `user/add?userName=${userName}`
        return this.getData<any>(url);
    }

    addUserSubscriptions(userName: string, vehicleIds: number[]): Observable<any> {
        const url = `user/add-subscription`
        const req = {
            'userName': userName,
            'subscribedBuses': vehicleIds.join(',')
        }
        return this.postData<any>(url, req);
    }

    removeSubscription(userName: string, vehicleIds: number[]): Observable<any> {
        const url = `user/remove-subscription`
        const req = {
            'userName': userName,
            'subscribedBuses': vehicleIds.join(',')
        }
        return this.postData<any>(url, req);
    }

    private getData<T>(apiUrl: string): Observable<T> {
        const url = this.apiBaseUrl + apiUrl;
        return this.httpClient.get<T>(url);
    }

    private postData<T>(apiUrl: string, data: any): Observable<T> {
        const url = this.apiBaseUrl + apiUrl;
        return this.httpClient.post<T>(url, data);
    }

    private putData<T>(apiUrl: string, data: any): Observable<T> {
        const url = this.apiBaseUrl + apiUrl;
        return this.httpClient.put<T>(url, data);
    }
}