/* 
  Created by:Sundar Natarajan
  Created on: 26-July-19 2:15 PM
  Purpose: User Login Service Page
*/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SessionService } from '../session/session.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { jsonToQueryString } from 'src/app/functions/functions';
@Injectable()
export class LoginService {
  refresh_token_flag = 0;
  api_url = environment.SERVER_URL + "Referral/";
  login_url = environment.SERVER_URL;

  constructor(
    private http: HttpClient,
    private session_svc: SessionService,
    private router: Router
  ) { }

  generateAccessToken(params) {
    params.username = params.username || 'tester';
    params.password = params.password || 'testing';
    params['Primary-Role'] = 'vendor';
    let query_string = jsonToQueryString(params);
    return this.http.post(this.login_url + "token", query_string, { headers: { "Content-Type": "application/x-www-form-urlencoded" } })
      .pipe(
        map(res => {
          this.session_svc.setSession(res);
          return res;
        }, err => {
          return err;
        })
      );
  }

  generateNewAccessToken() {
    if (!this.refresh_token_flag || 1) {
      this.refresh_token_flag = 1;
      let params = this.session_svc.user;
      params['username'] = params['userName'] || 'tester';
      params['password'] = params['password'] || 'testing';
      params['grant_type'] = 'refresh_token';
      params['refresh_token'] = params['refresh_token'];
      params['Primary-Role'] = 'recruiter';
      params['client_id'] = 't@ll!nt';
      params['client_secret'] = 't@ll!nt';
      let query_string = jsonToQueryString(params);
      this.http.post(this.login_url + 'token', query_string, { headers: { "Content-Type": "application/x-www-form-urlencoded" } }).subscribe(res => {
        this.session_svc.setSession(res);
        this.refresh_token_flag = 0;
      }, err => {
        this.router.navigate(['/login']);
      });
    }
  }

  generateNewAccessToken1() {
    return new Observable((obs) => {
      if (!this.refresh_token_flag || 1) {
        this.refresh_token_flag = 1;
        let params = this.session_svc.user;
        params['username'] = params['userName'] || 'tester';
        params['password'] = params['password'] || 'testing';
        params['grant_type'] = 'refresh_token';
        params['refresh_token'] = params['refresh_token'];
        params['Primary-Role'] = 'recruiter';
        params['client_id'] = 't@ll!nt';
        params['client_secret'] = 't@ll!nt';
        let query_string = jsonToQueryString(params);
        this.http.post(this.login_url + 'token', query_string, { headers: { "Content-Type": "application/x-www-form-urlencoded" } }).subscribe(res => {
          obs.next(true);
          this.session_svc.setSession(res);
          this.refresh_token_flag = 0;
        }, err => {
          obs.next(false);
          this.router.navigate(['/login']);
        });
      }
    })
  }

  forgotPassword(userId: string) { //method for sending email via user ID
    return this.http.post(this.login_url + "UserPassword/ForgotPassword?lng_id=1", {
      "user_name": userId
    },
      {
        observe: 'body'
      })
  }
}

