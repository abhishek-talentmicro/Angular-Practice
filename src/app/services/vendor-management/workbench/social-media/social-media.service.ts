import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable()
export class SocialMediaService {

  api_url = environment.SERVER_URL + 'Referral/';
  social_media = new Subject();
  subscription;

  constructor(private http: HttpClient) {
    this.subscription = this.getSocialMediaDetails().subscribe(res => {
      if (res && res['data'] && res['data'].Portals && res['data'].Portals.length) {
        this.social_media.next(res['data'].Portals);
        this.subscription.unsubscribe();
      }
    })
  }

  getSocialMediaDetails() {
    return this.http.get(this.api_url + 'PortalsData', { params: { lng_id: '1' } });
  }

  getShareLink(req_id) {
    return this.http.get(this.api_url + 'sharelinkData', { params: { req_id: req_id } });
  }
}
