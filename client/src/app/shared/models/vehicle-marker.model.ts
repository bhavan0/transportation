import { Location } from "./location.model";

export class VehicleMarker extends Location {
    busId: number | undefined;
    distance: number | undefined;
    routeId: number | undefined;
    destination: string | undefined;
    delay: string | undefined;

    constructor(busId?: number) {
        super();
        this.busId = busId;
    }
}