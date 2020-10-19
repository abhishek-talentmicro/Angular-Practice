import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class VendorRegistrationService {
  api_url;
  constructor(
    private http: HttpClient
  ) {
    this.api_url = environment.SERVER_URL;
  }
  getFormDetails(params) {
    return this.http.get(this.api_url + "DynamicTemplate/FormPlot", {
      params: params
    })
    // return this.http.get('assets/sample/data.json')
  }

  getFormMaster(obj, params) {
    return this.http.post(this.api_url + "DynamicTemplate/FormPlotMasters", obj, {
      params: params
    });
  }
}
