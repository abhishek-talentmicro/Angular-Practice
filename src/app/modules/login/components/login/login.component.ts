
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { LoaderService } from 'src/app/modules/loader/services/loader/loader.service';
import { LoginService } from '../../services/login/login.service';
import { ProfileSettingsService } from 'src/app/services/shared/profile-settings/profile-settings.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'src/app/services/shared/notification/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [
    LoginService
  ]
})
export class LoginComponent implements OnInit {

  constructor(
    private loginService: LoginService,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private loader: LoaderService,
    private profile_svc: ProfileSettingsService,
    private notification_svc: NotificationService
  ) { }

  form_flag = 1;
  hide: boolean = false;
  social_media: any = [];
  focus: boolean = false;
  login_form = this.formBuilder.group({
    username: '',
    password: ''
  })

  ngOnInit() {
    // this.loader.hideLoader();
  }

  loginWithUsernamePassword() {
    let obj = {
      grant_type: 'authorization',
      username: this.login_form.value.username,
      password: this.login_form.value.password,
      client_id: 't@ll!nt',
      client_secret: 't@ll!nt'
    };

    this.loginService.generateAccessToken(obj).subscribe(res => {

      if (res['Code'] == "200") {
        this.profile_svc.getAccessRights().subscribe(res => {

          try {
            // this.workbench_tabs.removeAllTabs();
            if (res['data'] && res['data']['access_rights'] && res['data']['access_rights']['form_data']) {
              let data = res['data']['access_rights']['form_data']

              var str = (data);
              str = str.replace(/\\/g, "");
              this.profile_svc.setaccess_right(str);
              if (res && res['data'] && (res['data']['def_app_filter_id'] || res['data']['def_req_filter_id'])) {
                this.profile_svc.setDefaultFilter({
                  def_app_filter_id: res['data']['def_app_filter_id'],
                  def_req_filter_id: res['data']['def_req_filter_id']
                })
              }
              if (this.route.snapshot.queryParams.from) {
                this.router.navigate([this.route.snapshot.queryParams.from.replace(/%2F/g, '/')]);
              }
              else {
                this.router.navigate(['/dashboard']);
              }
            }
          }
          catch (err) {

          }
        })

      }
      else {
        this.notification_svc.snackbar(res['message'], 'Close', 3000);
      }
    }, err => {

      this.notification_svc.snackbar("Invalid Credentials", 'Close', 3000);
    })
  }

  forgotPassword() {
    const dialog = this.dialog.open(ForgotPasswordComponent, {
      width: '300px',

      data: {
      }
    });

    return dialog;
  }
}

