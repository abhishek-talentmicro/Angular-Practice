import {environment} from './../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class ConditionalOfferService {

  constructor(
    private http: HttpClient
  ) {}

  generateOffer(offer_code, req_res_id) {
    return this.http.get(environment.SERVER_URL + 'OfferBreakup/LetterOfIntent', {
      params: {
        'offer_code': offer_code,
        'req_res_id': req_res_id
      }
    });
  }
}
