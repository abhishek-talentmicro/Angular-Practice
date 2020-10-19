import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private _snackBar: MatSnackBar) {
  }

  success(obj) {
    this._snackBar.open(obj);
  }

  snackbar(title,action , duration){
    this._snackBar.open(title,action, {
      duration : duration
    });
  }
}
