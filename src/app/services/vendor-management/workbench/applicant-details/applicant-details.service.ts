import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class ApplicantDetailsService {

  constructor(
    private http: HttpClient
  ) { }
  getStageStatus(req_id, req_res_id) {
    return this.http.get(environment.SERVER_URL + 'stagestatus', { params: { tn_id: '1', req_id: req_id, req_res_id: req_res_id } })
  }
  // getStageStatusMaster(){
  //   return this.http.get(environment.SERVER_URL+'stagestatus')
  // }

  getAssessmentDetails(obj) {
    return this.http.get(environment.SERVER_URL + 'Assessment/Details', {
      params: {
        req_res_id: obj
      }
    })
  }

  updateStageStatus(obj, template_code, section_id?, req_res_id?) {
    return this.http.post(environment.SERVER_URL + 'ReqResume/ScreeningFeedback', obj,
      {
        params:
        {
          template_code: template_code,
          section_id: section_id,
          req_res_id: req_res_id
        }
      })
  }

  setOnlyStageStatus(obj) {
    return this.http.post(environment.SERVER_URL + 'WorkflowAction/SaveReqResStage?tn_id=1&reason_flag=1', obj)
  }

}
