import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { PasswordManager } from '../../classes/password-manager/password-manager';
import { RoutesService } from 'src/app/modules/login/services/routes/routes.service';
import { PasswordManagerService } from 'src/app/services/shared/password-manager/password-manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-password-manager',
  templateUrl: './password-manager.component.html',
  styleUrls: ['./password-manager.component.scss'],
  providers: [
    PasswordManagerService
  ]
})
export class PasswordManagerComponent implements OnInit {
  password_manager = new PasswordManager();
  hide;
  hide_pass;
  //variable for form
  password_manager_form: FormGroup;

  PasswordManagerRef = PasswordManager;

  route_subscription: Subscription;

  init() {
    this.password_manager = new PasswordManager();
    this.password_manager_form = new FormGroup({
      password: new FormControl('', [Validators.required]),
      re_enter_password: new FormControl('', Validators.required),


    });

  }



  constructor(
    private password_manager_service: PasswordManagerService,
    private router: Router,
    private activated_route: ActivatedRoute,
    private snackbar: MatSnackBar,
  ) { }
  // :encrypted_user_id/:time_stamp/:expire_hours',
  user_id;
  ngOnInit() {
    this.init();
    this.user_id = this.activated_route.snapshot.params.user_id;
    this.password_manager_service.getPasswordStatus(this.user_id).subscribe(res => {



      // if (res["code"] == 200) {
      //   // this.getPasswordManager();
      // }
      // // else
        if (res["code"] == 401) {
          this.router.navigate(['/link-exipred']);
        }

    });

    //subscribe to route changes. if the user selects another changepassword, listen to route changes and call the API only if user_id is present in the URL and user_id in the URL is not same as the one that is already present

    // this.route_subscription = this.routes_service.routeListener().subscribe((val) => {
    //   if (!this.password_manager || (this.password_manager && this.password_manager.user_id != val['user_id'])) {
    //     this.init();
    //     this.getPasswordManager()
    //   }
    // })
  }

  // getPasswordManager() {

  //   this.password_manager_service.getPasswordStatus(this.user_id).subscribe(res => {
  
  //   })
  // }


  save() {

    this.password_manager_service.resetPassword(this.user_id, this.password_manager_form.value).subscribe(res => {

      if (res['code'] == 200 && res["status"] == false) {
        this.snackbar.open(res["message"]);
      }
      if (res["code"] == 200 && res["status"] == true) {
        this.router.navigate(['/login']);
        this.snackbar.open(res["message"]);
      }
      if (res["code"] == 401) {
        this.router.navigate(['/link-exipred']);
      }
    })

  }
  cancel() {

  }

  // ngOnDestroy() {
  //   this.route_subscription.unsubscribe();
  // }

}

