import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-custom-time',
  templateUrl: './custom-time.component.html',
  styleUrls: ['./custom-time.component.scss']
})
export class CustomTimeComponent implements OnInit {
  permission;
  tag_flag: boolean = false;
  loading: boolean = false;
  custom_time_form: FormGroup
  constructor(
    private dialog_ref: MatDialogRef<CustomTimeComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private snackbar: MatSnackBar
  ) {
    this.custom_time_form = new FormGroup({
      from: new FormControl(null),
      to: new FormControl(null)
    })
  }

  ngOnInit() {
    console.log(this.data)
  }

  close(flag?) {
    if (flag) {
      if (this.custom_time_form.value.from && this.custom_time_form.value.to) {
        if (this.custom_time_form.value.to >= this.custom_time_form.value.from) {
          this.dialog_ref.close(this.custom_time_form.value)
        }
        else {
          this.openSnackbar('End date must be greater than start date', 'Close', 3000)
        }
      }
      else {
        this.openSnackbar('Please pick date to proceed', 'Close', 3000)
      }
    }
    else
      this.dialog_ref.close(null)
  }

  openSnackbar(title, action, duration) {
    this.snackbar.open(title, action, {
      duration: duration
    })
  }
  onChange(ev, item?) {
    console.log(this.custom_time_form.value)
  }
}
