import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-email-model-view',
  templateUrl: './email-model-view.component.html',
  styleUrls: ['./email-model-view.component.scss']
})
export class EmailModelViewComponent implements OnInit {

  inbox: any = []
  constructor(
    private dialog_ref: MatDialogRef<EmailModelViewComponent>,
    @Inject(MAT_DIALOG_DATA) public email
  ) { }

  ngOnInit() {
    if (this.email) {
      this.inbox = this.email;
    }
  }
  close() {
    this.dialog_ref.close()
  }

}
