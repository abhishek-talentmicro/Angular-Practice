import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  loader_sub = new BehaviorSubject(null);
  loader_flag;
  constructor() {
    this.loader_sub.next(false);
  }

  showLoader() {
    this.loader_sub.next(true);
  };

  hideLoader() {
    this.loader_sub.next(false);
  };

}
