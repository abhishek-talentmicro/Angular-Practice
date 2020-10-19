import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DynamicModalService {
  api_url: string = environment.SERVER_URL;

  constructor(
    private HttpService: HttpClient
  ) { }


  getFormDetails(params) {
    return this.HttpService.get(this.api_url + "DynamicTemplate/GetFilterTemplate?", {
      params: params
    })
  }
}
