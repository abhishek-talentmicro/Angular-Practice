import { Component, OnInit, Input, OnChanges, Inject } from '@angular/core';

import { trigger, state, style, transition, animate, group } from '@angular/animations';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmailModelViewComponent } from './email-model-view/email-model-view.component';
import * as moment from "moment";
@Component({
  selector: 'app-emails',
  templateUrl: './emails.component.html',
  styleUrls: ['./emails.component.scss'],
  animations: [
    trigger('toggleBox', [
      // ...
      state('open', style({
        maxHeight: '300px',
        minHeight: '80px',
        overflow: 'auto',
      })),
      state('closed', style({
        height: '0px',
        overflow: 'hidden'
      })),
      transition('open => closed', [
        animate('0.3s')
      ]),
      transition('closed => open', [
        animate('0.4s')
      ]),
    ])
  ]
})
export class EmailsComponent implements OnInit, OnChanges {
  on_view_click = false;

  @Input() email;
  inbox: any = []
  // inbox = {
  //   img_path: 'assets/default_dp.png',
  //   from_name: 'Dibya Jyothi',
  //   to_name: 'Sampath',
  //   subject: 'Memo For Leave Application!',
  //   mail_body: '<p style="margin-left:0px;">Hello Team,</p><p style="margin-left:0px;">&nbsp;</p><p style="margin-left:0px;">This is to inform you that before or after availing leaves you should apply in WhatMate if this is not done before the month end then we will surely make that leave as LOP(loss of pay), so please be sure about applying your leave in WhatMate.</p><p style="margin-left:0px;">And if any employee is taking work from home or going for any client place they should apply in WhatMate ,once it is approved then only we consider it as an attendance, if not then again it will go for LOP.</p><p style="margin-left:0px;">&nbsp;</p><p style="margin-left:0px;">&nbsp;</p><p style="margin-left:0px;"><strong>Note: If your approver has not approved your leaves it would be considered as LOP.</strong></p><p style="margin-left:0px;">&nbsp;</p><p style="margin-left:0px;">&nbsp;</p><p style="margin-left:0px;">&nbsp;</p><p style="margin-left:0px;">With Warm Regards</p><p style="margin-left:0px;">Lavanya K</p><p style="margin-left:0px;">Human Resource</p><p style="margin-left:0px;"><strong>HireCraft Software Pvt. Ltd.</strong></p><p style="margin-left:0px;">#4112, KR Road, Banashankari 2nd Stage, Bangalore - 560 070 INDIA</p><p style="margin-left:0px;">Phone +91-(0)80-43531100 , Extn: 43531111</p><p style="margin-left:0px;">Presence at: Bangalore | Chennai | Mumbai | New Delhi | Dubai (UAE) | USA</p><p style="margin-left:0px;"><strong>Indias largest Recruitment Software and globally emerging talent management software provider...</strong></p><p style="margin-left:0px;">&nbsp;</p><p style="margin-left:0px;">This email is intended only for the person to whom it is addressed and/or otherwise authorized personnel. The information contained herein and attached is confidential and the property of HireCraft Software Pvt. Ltd. If you are not the intended recipient, please be advised that viewing this message and any attachments, as well as copying, forwarding, printing, and disseminating any information related to this email is prohibited,&nbsp;and that you should not&nbsp;take any action based on the content of this email and/or its attachments. If you received this message in error, please contact the sender and destroy all copies of this email and any attachment. Please note that the views and opinions expressed herein are solely those of the author and do not necessarily reflect those of the company. While antivirus protection tools have been employed, you should check this email and attachments for the presence of viruses.&nbsp;No warranties or assurances are made in relation to the safety and content of this email and attachments.&nbsp;HireCraft Software Pvt. Ltd. accepts no liability for any damage caused by any virus transmitted by or contained in this email and attachments.&nbsp;No liability is accepted for any consequences arising from this email.</p>',
  //   mail_sent_date: 'Jan 25 2020 3:30 PM',
  //   attachments: ''
  // }
  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    console.log(this.email);
    if (this.email) {
      this.inbox = this.email;
    }
  }

  ngOnChanges(e) {
    console.log(e);
    if (e.email) {
      this.inbox = this.email;
    }
  }

  viewMail() {
    this.on_view_click = !this.on_view_click;
  }

  openModelView() {
    this.dialog.open(EmailModelViewComponent, {
      width: '65vw',
      data: this.email,
      height: 'fit-content',
      minWidth: '360px'
    })
  }
  getDate(val: Date) {
    return moment.utc(val).toDate();
  }
}


  