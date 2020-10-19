import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http'
import { environment } from '../../../../environments/environment';

@Injectable()
export class WorkbenchService {
  api_url: string = environment.SERVER_URL;
  // stage_status = new StageStatusData();
  constructor(private HttpService: HttpClient) {

  }

  // setStageStatusData(obj) {
  //   console.log
  //   this.stage_status.status = obj.status;
  //   this.stage_status.stage = obj.stage;
  // }

  // getStageStatusData() {
  //   return {
  //     status: this.stage_status.status,
  //     stage: this.stage_status.stage
  //   }
  // }

  saveFilterTemplate(obj) {
    return this.HttpService.post(this.api_url + 'saveFilterTemplate', obj)
  }

  reqResumeList(template_code, t_id) {
    return this.HttpService.get(this.api_url + 'ReqResume/ApplicantDetails?template_code=' + template_code + '&t_id=' + t_id)
  }
  getInterviewDetails(template_code, form_code, interview_id) {
    return this.HttpService.get(this.api_url + 'interview/InvMaster', {
      params: {
        t_id: interview_id,
        template_code: template_code,
        form_code: form_code
      }
    })
  }
  getApplicantStatus(t_id) {
    return this.HttpService.get(this.api_url + 'ReqResume/ApplicantStatus?Reqid=' + t_id + '&tn_id=1')
  }

  getApplicantList(obj) {
    return this.HttpService.post(this.api_url + 'ReqResume/Details', obj || {
    });
  }

  getRequirements(obj) {
    return this.HttpService.post(this.api_url + 'Requisition/List?tn_id=1', obj);
  }

  getResumeDetails(details) {
    return this.HttpService.post(this.api_url + 'ReqOrgNodeMap/ResumeList', details, { params: { tn_id: '1' } });
  }


  getReqApplicantDetails(obj) {
    return this.HttpService.post(this.api_url + "Workflowaction/GetReqApplicantDetails", obj)
  }

  getFormDetails(params) {
    return this.HttpService.get(this.api_url + "DynamicTemplate/FormPlot", {
      params: params
    })
    // return this.HttpService.get('assets/sample/data.json')
  }   

  getFormMaster(obj, params) {
    return this.HttpService.post(this.api_url + "DynamicTemplate/FormPlotMasters", obj, {
      params: params
    });
  }
}