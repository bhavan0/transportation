import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng';
import { DataService } from 'src/app/core/data-service';
import { Bus } from 'src/app/shared/models/bus.model';

@Component({
  selector: 'app-add-buses',
  templateUrl: './add-buses.component.html',
  styleUrls: ['./add-buses.component.scss']
})
export class AddBusesComponent implements OnInit {

  bus!: Bus;
  editMode = false;
  constructor(public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private dataService: DataService) {
    this.editMode = false;
    if (config?.data?.bus) {
      this.bus = config.data.bus;
      this.editMode = true;
    } else{
      this.bus = new Bus();
    }
  }

  ngOnInit(): void {

  }

  disableSave(): boolean {
    if (this.bus && (!this.bus.name || this.bus.name === '' || !this.bus.number)) {
      return true;
    }
    return false;
  }

  closeDialogBox(bus: Bus) {
    this.ref.close(bus);
  }

  saveBus() {
    if(this.editMode){
      this.dataService.updateBus(this.bus).subscribe(() => {
        this.closeDialogBox(this.bus);
      });
    } else{
      this.dataService.addBus(this.bus).subscribe(() => {
        this.closeDialogBox(this.bus);
      });
    }
  }

}
