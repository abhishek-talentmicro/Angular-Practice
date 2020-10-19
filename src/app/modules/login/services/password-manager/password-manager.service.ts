
// /* 
//   Created by:Upendram Reddy Tanuja
//   Created on: 21-Aug-19 07:30 PM
//   Purpose: User Password Manager Service Page
//  */
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { environment } from 'src/environments/environment';

// @Injectable()
// export class PasswordManagerService {
//   api_url: string = environment.SERVER_URL + "User/";

//   // api_url: string = "../assets.options.json"
//   constructor(private http: HttpClient) {

//   }
//   getPasswordStatus(user_id) {
//     return this.http.get(this.api_url + 'getLinkExpiry', { params: { user_id: user_id } });
//   }
//   getDetails(user_id) {
//     return this.http.get(this.api_url + 'getPasswordValidation', { params: { user_id: user_id } });
//   }

//   saveDetails(user_id, obj) {
//     return this.http.post(this.api_url + 'saveUserPassword', obj, { params: { user_id: user_id } });

//   }
// }