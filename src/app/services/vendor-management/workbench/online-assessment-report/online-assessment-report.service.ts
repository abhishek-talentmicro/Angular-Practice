import {environment} from 'src/environments/environment';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OnlineAssessmentReportService {

  constructor(private http: HttpClient) {}


  saveAssessment(obj, template_code, section_id?, req_res_id?) {
    return this.http.post(environment.SERVER_URL + 'ReqResume/ScreeningFeedback', obj, {params: {template_code: template_code, section_id: section_id, req_res_id: req_res_id}})
  }
}
