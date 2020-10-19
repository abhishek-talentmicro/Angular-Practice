
/* Created by:K Pramod Kumar Reddy
Created on: 26-Jul-2019 01:00 PM
Purpose: service for Change Password*/


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class ChangePasswordService {

  constructor(private http: HttpClient) { }

  getChangePassword(user_id) {
    return this.http.get(environment.SERVER_URL + 'password/getPassword', { params: { user_id: '1' } });
  }

  saveChangePassword(data) {
    return this.http.post(environment.SERVER_URL + 'password/ChangePassword', data);
  }
}