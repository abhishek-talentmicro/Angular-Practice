import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionService } from '../../session/session.service';
import { LanguageService } from 'src/app/services/shared/language/language.service';
import { LoaderService } from 'src/app/modules/loader/services/loader/loader.service';
import { Session } from '../../../classes/session/session';

@Injectable()
export class RequestInterceptorService {
  session: Session;

  loading = [];

  private requests: HttpRequest<any>[] = [];

  constructor(
    private _LanguageService: LanguageService,
    private _session: SessionService,
    private loader_svc: LoaderService
  ) {
    this._session.getSession().subscribe(res => {
      this.session = res;
    })
  }

  removeRequest(req: HttpRequest<any>) {

    // const i = this.requests.indexOf(req);

    // if (i >= 0) {
    //   this.requests.splice(i, 1);
    // }

    this.requests.splice(0, 1);
    if (this.requests.length <= 0) {
      this.loader_svc.loader_sub.next(false);
    }

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request instanceof HttpRequest)
      this.requests.push(request);

    let token;

    if (this.session && this.session.access_token) {
      token = this.session.access_token;
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.session.access_token}`
        }
      });
    }

    let language = this._LanguageService.getCurrentLanguage() || {};
    request = request.clone({
      setParams: {
        lng_id: language.lng_id || 1,
      }
    })

    return Observable.create(observer => {
      this.loader_svc.showLoader();
      const subscription = next.handle(request)
        .subscribe(
          event => {

            if (event instanceof HttpResponse) {

              if (event.status === 401 || event.body.code == 401) {
                // auto logout if 401 response returned from api
                console.log('anAuth')
                this._session.logout();
                // location.reload(true);
              }
              this.removeRequest(request);
              observer.next(event);
            }
          },
          err => {
            this.removeRequest(request);
            observer.error(err);
          });
      // remove request from queue when cancelled
      return () => {
        this.removeRequest(request);
        subscription.unsubscribe();
      };
    });
  }
}
