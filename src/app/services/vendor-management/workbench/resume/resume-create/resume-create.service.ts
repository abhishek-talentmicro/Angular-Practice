import { environment } from './../../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResumeCreateService {

  constructor(
    private http: HttpClient
  ) { }

  getResumeDetails(params) {
    return this.http.get(environment.SERVER_URL + 'resume/Details', {
      params: params
    });
  }

  saveResumeDetails(obj, res_id) {
    return this.http.post(environment.SERVER_URL + 'Resume/saveHGSResume', obj, {
      params: {
        id: res_id || 0
      }
    });
  }

  parseResumeDetails(obj, template_code, req_id) {
    return this.http.post(environment.SERVER_URL + 'resume/fetchParsedata', obj, {
      params: {
        form_code: template_code,
        resume_id: '0',
        req_id: req_id
      }
    })
  }
}