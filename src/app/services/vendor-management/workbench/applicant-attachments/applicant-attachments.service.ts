import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApplicantAttachmentsService {

  api_url = environment.SERVER_URL;

  constructor(private http: HttpClient) { }

  uploadAttachments(obj, params?) {
    return this.http.post(this.api_url + '', obj, {
      params: params
    })
  }
}
