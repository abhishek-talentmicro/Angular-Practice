/* Created by:Upendram Reddy Tanuja
Created on: 05-Aug-2019 12:30 PM
Purpose: service for Profile Settings*/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { provideRoutes } from '@angular/router';
import { Subject, Observable, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProfileSettingsService {
  access_rights = new Object()

  access_right_change: Subject<object> = new Subject<object>();
  notification: BehaviorSubject<any> = new BehaviorSubject(null);
  private default_filter_source = new BehaviorSubject(null);
  default_filter_change = this.default_filter_source.asObservable();
  def_app_filter_id;
  def_req_filter_id;
  constructor(private http: HttpClient) { }
  api_url: string = environment.SERVER_URL + 'User/';

  getProfileDetails() {
    return this.http.get(this.api_url + 'ProfileMaster')
  }
  saveProfileDetails(profile_settings) {
    return this.http.post(this.api_url + 'UpdateProfile', profile_settings);
  }
  getAccessRights() {
    return this.http.get(environment.SERVER_URL + 'NotifList/Details', { params: { origin: 'localhost' } })
  }

  setDefaultFilter(obj) {
    try {
      // this.default_filter_source.next(obj)
      if (obj.def_app_filter_id != 0)
        this.def_app_filter_id = obj.def_app_filter_id;
      if (obj.def_req_filter_id != 0)
        this.def_req_filter_id = obj.def_req_filter_id;
      this.default_filter_source.next({ def_app_filter_id: this.def_app_filter_id, def_req_filter_id: this.def_req_filter_id });
    }
    catch (err) {

    }
  }

  resetDefaultFilter(obj) {
    try {
      // this.default_filter_source.next(obj)
      if (obj.def_app_filter_id != 0)
        this.def_app_filter_id = obj.def_app_filter_id;
      if (obj.def_req_filter_id != 0)
        this.def_req_filter_id = obj.def_req_filter_id;
    }
    catch (err) {

    }
  }

  setaccess_right(value) {
    try {
      this.access_right_change.next(this.access_rights = JSON.parse(value)
      );
    }
    catch{

      this.access_right_change.next(
        this.access_rights = (value)
      );


    }
    this.getAccessRightObj


  }
  // getAccessRightObj() {
  //   return (this.access_rights)
  // }
  getAccessRightObj(): Observable<any> {
    return this.access_right_change.asObservable();
  }


  getNotification(value) {
    this.notification.next(value);
  }
  invalid_field = new Subject();
  triggerInvalidField(item) {
    this.invalid_field.next(item);
  }


  getInvalidField(): Observable<any> {
    return this.invalid_field.asObservable();
  }
}