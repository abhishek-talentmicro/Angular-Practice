import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-export-confirmation',
  templateUrl: './export-confirmation.component.html',
  styleUrls: ['./export-confirmation.component.scss']
})
export class ExportConfirmationComponent implements OnInit {

  export_flag = '1';
  constructor(
    private dialog_ref: MatDialogRef<ExportConfirmationComponent>
  ) { }

  ngOnInit() {
  }
  close(flag?) {

    if (flag) {
      this.dialog_ref.close(this.export_flag)
    }
    else {
      this.dialog_ref.close(null);
    }
  }

}
