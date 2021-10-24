import { Injectable } from "@angular/core";
import { Stop } from "../models/stops.model";

@Injectable({ providedIn: 'root' })
export default class SharedDataService {
    public static stop: Stop;
    public userName: string = '';
}