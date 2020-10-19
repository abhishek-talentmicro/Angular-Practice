import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor(private http: HttpClient) { }

  uploadFiles(file: any, filename) {
    let fileFormatedData = new FormData();
    fileFormatedData.append('attachment', file, filename);
    return this.http.post("environment.ATTACHMENT_URL", fileFormatedData,
    )
  }
}



