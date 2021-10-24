import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class EventService {

    constructor() {
    }

    private userLogin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    onLogin(): Observable<boolean> {
        return this.userLogin.asObservable();
    }

    updateLoginRecieved(){
        this.userLogin.next(true);
    }
}