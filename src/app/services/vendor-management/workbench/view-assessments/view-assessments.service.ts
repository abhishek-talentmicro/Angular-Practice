import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ViewAssessmentsService {
  api=environment
  constructor(
    private HttpService:HttpClient
  ) {   }
  getDetails(id){
    return this.HttpService.get(this.api.SERVER_URL+'ReqResume/FeedBackForm?',{params:{
      t_id:id
    }})
  }
}
