export class SubscribedBus {
    vehicleId!: number;
    latitude!: number;
    longitude!: number;
    routeId!: number;
    destination!: string;
    distance!: number;
    delay!: string;

    constructor(vehicelId: number) {
        this.vehicleId = vehicelId;
    }
}