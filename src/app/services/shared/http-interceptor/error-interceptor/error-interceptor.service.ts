import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SessionService } from 'src/app/modules/login/services/session/session.service';

@Injectable()
export class ErrorInterceptorService implements HttpInterceptor {

  constructor(
    private session_svc: SessionService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        // auto logout if 401 response returned from api
        this.session_svc.logout();
        // location.reload(true);
      }

      // const error = err.error.message || err.statusText;
      // this._notifcation.success(error);
      return new Observable<HttpEvent<any>>(err);
    }))
  }
}
