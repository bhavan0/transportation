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
        // Connect to a random subscriber
        const rndInt = Math.floor(Math.random() * 3) + 1
        const baseUrl = `http://localhost:900${rndInt}`
        console.log('Connected to subscriber ' + rndInt);
        this.socket = io(baseUrl);
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