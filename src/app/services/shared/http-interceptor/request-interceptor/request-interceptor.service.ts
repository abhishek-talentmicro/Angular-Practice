import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LanguageService } from '../../language/language.service';
import { LoaderService } from '../../../../modules/loader/services/loader/loader.service';
import { Session } from 'src/app/modules/login/classes/session/session';
import { SessionService } from 'src/app/modules/login/services/session/session.service';

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
          // Authorization: 'NVDlfPjf15EJtLQWppBYhqlgK6PhEWx4f_JyscAa7H_ZKR_6_HG4SHYVlOnpID-sI0ruAT5YHt2Pe7rq5ww-l52IGqJjKZkmKUwAUcJdkjhWnqDWlZSm75ywmencz2FyY-pJMVwTguNFv-ZobZx3iWyVeK8I0G7it21EWkL5ojrYIqHORgz61gBk0xr9gT7dXz2GNuiRepufjnhj9FvSPZHaJEz7LFXLT_aEbdW-vMtm5imLuD2inQe2ZObFqdDjl7VqRJlBNaXXS4L9mhPA6xIhYL70xyoHa_jb0YMng2WDjvX6fKfzvN82xqDdkO8qACfaXA40UKSmxWnLbaDp4klffcyd5cGtQ2XFcRFGJxZD0HTNstkTUDHOQaTAumT-r2ycA2e9eVlJVd2GT11Qpg'
        }
      });
    }

    let language = this._LanguageService.getCurrentLanguage() || {};
    request = request.clone({
      setParams: {
        lng_id: language.lng_id || 0,
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
