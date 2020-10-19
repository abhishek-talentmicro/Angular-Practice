import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment';

@Injectable()
export class ResumeImportService {
  url;
  constructor(
    private http: HttpClient
  ) {
    this.url = environment.SERVER_URL;
  }

  saveResume(obj) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    return this.http.post(this.url + 'Parsing/XMLToJSON', obj, { headers: headers });
  }

  importResume(obj, flag) {
    return this.http.post(this.url + 'ResumeBank/import', obj, {
      params: {
        multiple_flag: flag
      }
    });
  }

  getMaster(obj) {
    return this.http.get(this.url + 'ReqOrgNodeMap/ResumeImportMaster')
  }

  getJobPortalList(params?) {
    return this.http.get(this.url + 'UserRoleBasedPortals', { params: params })
  }

  getJobPortalCredentials(request_params) {
    return this.http.get(this.url + 'UserGroupPortalsCre', { params: request_params })
  }

}
