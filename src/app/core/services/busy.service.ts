import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  loading: boolean = false;
  busyReuestsCount = 0;
  busy(){
    this.busyReuestsCount++;
    this.loading = true;
  }
  idle(){
    this.busyReuestsCount--;
    if(this.busyReuestsCount <= 0){
      this.busyReuestsCount = 0;
      this.loading = false;
    } 
  }
  constructor() { }
}
