import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LoginService } from '../../services/login/login.service';
import { LoaderService } from 'src/app/modules/loader/services/loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sso',
  templateUrl: './sso.component.html',
  styleUrls: ['./sso.component.scss'],
  providers: [
    LoginService
  ]
})
export class SsoComponent implements OnInit {

  constructor(private loader_svc: LoaderService, private activated_route: ActivatedRoute,
    private loginService: LoginService, private router: Router, private change_detector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.loginWithUsernamePassword();
  }
  loginWithUsernamePassword() {
    let obj = {
      grant_type: 'authorization',
      username: this.activated_route.snapshot.params.id,
      password: this.activated_route.snapshot.params.id,
      client_id: 't@ll!nt',
      client_secret: 't@ll!nt'
    };
      this.loginService.generateAccessToken(obj).subscribe(res => {
        if (res['Code'] == "200") {
          this.router.navigate(['/dashboard']);
        }
      }, err => {
  
      })
    }
}
