import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class GetMastersService {

  constructor(private http: HttpClient) { }
  api_url = environment.SERVER_URL;
  
  getMasters(obj) {
    return this.http.post(this.api_url + `Master/MasDynMasters`, obj)
  }

  saveGridCols(obj) {
    return this.http.post(this.api_url + 'UserGrid/Save', obj);
  }


}
