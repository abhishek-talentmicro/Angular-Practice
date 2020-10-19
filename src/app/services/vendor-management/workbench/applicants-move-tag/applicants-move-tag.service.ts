import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class ApplicantsMoveTagService {

  constructor(
    private http:HttpClient,
  ) { }
  getRequirementReason(){
    return this.http.get(environment.SERVER_URL+'Req/GetMove')
  }
  saveMoveRequirement(obj){
    return this.http.post(environment.SERVER_URL+'Req/Move',obj)
  }
}
