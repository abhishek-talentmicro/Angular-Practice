import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PasswordManagerService {
  api_url = environment.SERVER_URL
  constructor(private http: HttpClient) { }

  getPasswordStatus(user_id) {
    return this.http.get(this.api_url + 'UserPassword/LinkExpiry', { params: { user_id: user_id } });
  }


  resetPassword(user_id, obj) {
    return this.http.post(this.api_url + 'UserPassword/Data', obj, { params: { user_id: user_id } });
  }

}
