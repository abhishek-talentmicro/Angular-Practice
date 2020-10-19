import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class NotesService {

  constructor(private http: HttpClient) { }


  api_url = environment.SERVER_URL;
  getReqNotes(params) {
    return this.http.get(this.api_url + 'Requirement/Notes', {
      params: params
    })
  }

  saveReqNotes(obj, params?) {
    return this.http.post(this.api_url + 'Requirement/Notes', obj,
      {
        params: params
      })
  }

  getResNotes(params) {
    return this.http.get(this.api_url + 'Resume/getNotes', {
      params: params
    })
  }

  saveResNotes(obj, params?) {
    return this.http.post(this.api_url + 'Resume/Notes', obj,
      {
        params: params
      })
  }


}
