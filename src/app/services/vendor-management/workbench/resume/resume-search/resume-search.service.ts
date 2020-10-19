import {environment} from 'src/environments/environment';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class ResumeSearchService {
  constructor(
    private http: HttpClient
  ) {}

  // getMaster(obj) {
  //   return this.http.post(environment.SERVER_URL + 'ReqOrgNodeMap/ResumeList', obj)
  // }

  getRequirementList() {
    return this.http.get(environment.SERVER_URL + 'Req/Master');
  }

  tagResume(obj) {
    return this.http.post(environment.SERVER_URL + 'Resumes/ReqRes', obj);
  }

  getResumeList(obj) {
    return this.http.post(environment.SERVER_URL + 'ReqOrgNodeMap/ResumeList', obj);
  }
  getRequirements(obj) {
    return this.http.post(environment.SERVER_URL + 'Requisition/List?tn_id=1', obj);
  }
}

// 'http://192.168.0.147:8088/api/ReqOrgNodeMap/ResumeList?lng_id=1'
