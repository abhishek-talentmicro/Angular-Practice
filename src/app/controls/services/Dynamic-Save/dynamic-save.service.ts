import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class DynamicSaveService {
  api_url = environment.SERVER_URL;
  constructor(private http: HttpClient) { }

  apiCall(method, url, obj?, params?) {

    if (method.toLowerCase() == 'get') {
      return this.http.get(url);
    }
    else if (method.toLowerCase() == 'post') {

      return this.http.post(url, obj, {
        params: params
      });
    }
  }

  verifyDocument(obj, params?) {
    return this.http.post(this.api_url + 'OnBoarding/DocumentsVerification', obj, {
      params: params
    })
  }

  sendNotification(params) {
    return this.http.get(this.api_url + 'NotifList/WhatmateNotification', {
      params: params
    })
  }
  integrationApi(data) {
    return this.http.post(this.api_url + 'integrations', data)
  }
}