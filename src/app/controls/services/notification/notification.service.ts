import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private _snackbar: MatSnackBar
  ) { }

  successSnackbar(title, action, duration) {
    this._snackbar.open(title, action, {
      duration: duration
    });
  }
  snackbar(title,action , duration){
    this._snackbar.open(title,action, {
      duration : duration
    });
  }
}
