import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { LoginService } from '../../services/login/login.service';
import { NotificationService } from 'src/app/services/shared/notification/notification.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  providers: [
    LoginService
  ]
})
export class ForgotPasswordComponent implements OnInit {

  isOTPSendSuccessfully = false;
  resetPasswordRequest = false;
  isOTPVariedSuccessfully = false;
  userId;
  OTP;
  newPassword;

  isLoaded = false;
  isSubmitted = false;
  userPostResData;
  isChangePasswordClicked = false;
  userValid;
  userLogin = false;
  forgetPassword = false;
  isLinkSendSuccessfully = true;
  invalid = false;
  constructor(private login_service: LoginService,
    private notification_svc:NotificationService,
    private dialogRef:MatDialogRef<ForgotPasswordComponent>) { }

  ngOnInit() {
    this.init();
  }
  password_form: FormGroup;
  init() {
    this.password_form = new FormGroup(
      {
        login_id: new FormControl("", Validators.required),

      }
    );
  }

  onResetPassword(form) {
    this.isLoaded = true;
    this.userId = form.value.userId;

    if (this.userId == "") {

      this.invalid = true;


    }
    else {
      this.invalid = false;
    }
    if (!this.isOTPSendSuccessfully) {
      this.login_service.forgotPassword(this.userId).subscribe(resData => {

        if (resData['status'] == true) {
          this.isOTPSendSuccessfully = true;

          this.isLinkSendSuccessfully = false;
          this.isLoaded = false;
          this.notification_svc.success(resData['message'])
        }
        else {
          this.notification_svc.snackbar(resData['message'],"Close",3000)
        }

      },
        errorData => {
          this.notification_svc.snackbar(errorData,"Close",3000)
        }

      );
    }
    else {

    }
  }
  save() {
    if (this.password_form.value.login_id == "") {

      this.invalid = true;


    }
    else {
      this.invalid = false;


      this.login_service.forgotPassword(this.password_form.value.login_id).subscribe(resData => {

        if (resData['status'] == true) {
          this.isOTPSendSuccessfully = true;

          this.notification_svc.success(resData['message'])

        }else{
          this.notification_svc.snackbar(resData['message'],"Close",3000)
        }
      },err=>{
        this.notification_svc.snackbar(err['message'],"Close",3000)
      });
    }
  }
  close(){
    this.dialogRef.close()
  }
}
