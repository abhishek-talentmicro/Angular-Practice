/*
  Created 
    by: Pramod Kumar Reddy
    on: 26-Jul-2019 1:00 PM
    purpose: Change Password component
   
*/

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RoutesService } from 'src/app/modules/login/services/routes/routes.service';
import { Subscription } from 'rxjs';
import { ChangePassword } from 'src/app/modules/login/classes/change-password/change-password';
import { ChangePasswordService } from '../../services/change-password/change-password.service';
import { SessionService } from '../../services/session/session.service';
import { NotificationService } from 'src/app/services/shared/notification/notification.service';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  providers: [
    ChangePasswordService
  ]
})
export class ChangePasswordComponent implements OnInit {

  change_new_password = new ChangePassword();

  change_password = [];

  //variable for form
  change_password_form: FormGroup;

  ChangePasswordRef = ChangePassword;

  route_subscription: Subscription;
  session_subscription: Subscription;

  init() {
    this.change_new_password.resetStaticVariables();
    this.change_new_password = new ChangePassword();
    this.change_new_password.setData();

    this.change_password_form = new FormGroup({
      current_password: new FormControl(''),
      new_password: new FormControl('', [Validators.required]),
      reenter_password: new FormControl('', Validators.required),
      user_id: new FormControl('')
      /* current_password: new FormControl('', [
        Validators.required,
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&]).{6,}')
       ]),
         new_password: new FormControl('', [
           Validators.required,
           Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&]).{6,}')
          ]),
        reenter_password: new FormControl('',[
          Validators.required,
          Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&]).{6,}')
         ]),*/

    },
      {
        // validators: MustMatch('new_password', 'reenter_password')
      });

  }



  constructor(
    private change_password_service: ChangePasswordService,
    private routes_service: RoutesService,
    private router: Router,
    private activated_route: ActivatedRoute,
    private dialog: MatDialog,
    private session_svc: SessionService,
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    private notification_svc: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data

  ) { }

  ngOnInit() {
    this.init();
    this.session_subscription = this.session_svc.getSession().subscribe(res => {

      if (res && res['user_id']) {
        this.change_password_form.patchValue({ user_id: res['user_id'] })
      }
    })
    this.getChangedPassword();
    //subscribe to route changes. if the user selects another changepassword, listen to route changes and call the API only if user_id is present in the URL and user_id in the URL is not same as the one that is already present
    this.route_subscription = this.routes_service.routeListener().subscribe((val) => {
      if (!this.change_new_password || (this.change_new_password && this.change_new_password.user_id != val['user_id'])) {
        this.init();
        this.getChangedPassword()
      }
    })
  }

  getChangedPassword() {
    this.change_password_service.getChangePassword(this.change_new_password).subscribe(res => {

      if (res['data']) {
        let pattern = "";
        if (res['data'].password_min_length && res['data'].password_max_length) {
          if (this.change_password_form.get('new_password')) {
            this.change_password_form.controls['new_password'].setValidators([Validators.required, Validators.maxLength(res['data'].password_max_length)]);
          }/* else {
            this.change_password_form.controls['new_password'].setValidators([Validators.maxLength(res['data'].password_max_length)]);
          }*/
          if (this.change_password_form.get('new_password')) {
            this.change_password_form.controls['new_password'].setValidators([Validators.required, Validators.minLength(res['data'].password_min_length)]);
          } /*else {
            this.change_password_form.controls['new_password'].setValidators([Validators.minLength(res['data'].password_min_length)]);
          }*/

          if (res['data'].alpha_numeric == 1) {
            this.change_password_form.controls['new_password'].setValidators([Validators.required, Validators.pattern('^[a-zA-Z0-9-]*$')]);
          } else {
            // this.change_password_form.controls['new_password'].setValidators([Validators.pattern('[^a-zA-Z0-9-]*$')]);
            pattern = '/[^a-zA-Z0-9-]*$+[A-Z]+[$@$!%?&]$/'
          }
          if (res['data'].upper_case == 1) {
            this.change_password_form.controls['new_password'].setValidators([Validators.required, Validators.pattern('[A-Z]')]);
          }/* else {
            this.change_password_form.controls['new_password'].setValidators([Validators.pattern('[^A-Z]')]);
             pattern ='/[a-zA-Z0-9-]*$+[^A-Z]+[$@$!%?&]$/'
        }*/
          if (res['data'].special_characters == 1) {
            this.change_password_form.controls['new_password'].setValidators([Validators.required, Validators.pattern('[$@$!%?&]')]);
          } /*else {
            this.change_password_form.controls['new_password'].setValidators([Validators.pattern('[^$@$!%?&]')]);
             pattern ='/[a-zA-Z0-9-]*$+[A-Z]+[^$@$!%?&]$/'
          }*/

        }
      }
    })
  }


  save() {

    this.change_password_service.saveChangePassword(this.change_password_form.value).subscribe(res => {

      this.notification_svc.snackbar(res['message'], 'Cancel', 5000);
      this.dialogRef.close();
    })

  }
  cancel() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    try {
      this.route_subscription.unsubscribe();
      this.session_subscription.unsubscribe();

    }
    catch (err) {

    }
  }

}


















