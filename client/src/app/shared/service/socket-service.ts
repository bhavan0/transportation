import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SocketService {

    private socket: any

    constructor() {
    }

    connect() {
        this.socket = io('http://localhost:9000');
    }

    listen(eventName: string): Observable<any> {
        return new Observable((subscriber) => {
            this.socket.on(eventName, (data: any) => {
                subscriber.next(data)
            })
        })
    }

    disconnect(eventName: string) {
        this.socket.disconnect(eventName);
    }

    emit(eventName: any, data: any) {
        this.socket.emit(eventName, data)
    }

}