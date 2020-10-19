import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot, ActivatedRoute, NavigationEnd } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Session } from '../../classes/session/session';
import { ProfileSettingsService } from 'src/app/services/shared/profile-settings/profile-settings.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  user: Session = new Session();
  notification_regid;

  session: BehaviorSubject<Session> = new BehaviorSubject(null);
  access_rights: Object;
  path;
  constructor(
    private router: Router,
    private http: HttpClient,
    private profile_svc: ProfileSettingsService,
    private active_route: ActivatedRoute

  ) {
    this.profile_svc.getAccessRightObj().subscribe(res => {

      this.access_rights = this.profile_svc.access_rights;
    })
    if (!this.access_rights) {
      let access = sessionStorage.getItem('access_rights');
      if (access != "undefined") {
        this.access_rights = JSON.parse(access);
        this.profile_svc.setaccess_right(sessionStorage.getItem('access_rights'));
      }
      if (access == "undefined" || access == "null") {
        router.events.subscribe(event => {
          if (event instanceof NavigationEnd) {
            console.log(event,);
            let s: string = event.url;
            // if (!s.includes('registration')) {
            //   this.logout();
            // }
          }
        });
      }
    }
    this.updateSession();
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {

    if (route.routeConfig.path == 'login') {

      if (this.checkSession()) {
        this.path = route.url[0].path;
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
          return false;
        })
      }
      else {
        return true;
      }
    }
    else {
      if (this.checkSession()) {
        this.path = route.url[0].path;
        this.checkingAccessRights();
        return true;
      }
      else {
        this.router.navigate(['/login'], { queryParams: { from: state.url || 'dashboard' } });
        return false;
      }
    }

  }
  setSession(obj) {
    let session = new Session();
    session.setData(obj);
    if (session) {
      let item = btoa(JSON.stringify(session));
      sessionStorage.setItem('u', item);
      this.updateSession();
    }
  }

  updateSession() {
    let session = sessionStorage.getItem('u');
    if (session) {
      let user = JSON.parse(atob(session));
      if (user && user.access_token) {
        this.user.setData(user);
        this.session.next(user);
        return this.user;
      }
    }
    return null;
  }

  getSession(): Observable<Session> {
    return this.session.asObservable();
  }

  logout() {
    console.log('logout')
    sessionStorage.removeItem('u');
    this.session.next(null);
    sessionStorage.setItem('access_rights', undefined);
    this.router.navigate(['/login']);
    // private tab_svc: EntityTabsService
    // this.tab_svc.clearTabs();
  }

  updateNotificationRegId(reg_id) {
    this.notification_regid = reg_id;
    if (this.user.access_token) {
      this.saveNotificationRegId();
    }
  }

  saveNotificationRegId() {
    this.http.post(environment.SERVER_URL + 'Requisition/regId', { notification_reg_id: this.notification_regid, access_token: this.user.access_token }).subscribe(res => {

    })
  }

  getUserId() {
    if (this.user) {
      return this.user.user_id;
    }
    else {
      return null;
    }
  }

  checkSession() {
    // this.updateSession();
    if (this.user) {
      return this.user.access_token;
    }
    else {
      return null;
    }
  }
  checkingAccessRights() {
    if (!this.access_rights) {
      this.logout();
    }

    if (this.path == "dashboard") {
      if (this.access_rights && this.access_rights[1] && this.access_rights[1]['sub_modules'] && this.access_rights[1]['sub_modules'][3001] && !this.access_rights[1]['sub_modules'][3001]['enable']) {
        if (this.access_rights && this.access_rights[1] && this.access_rights[1]['sub_modules'] && this.access_rights[1]['sub_modules'][200] && this.access_rights[1]['sub_modules'][200]['enable']) {
          this.router.navigate(['/workbench']);
        }
        else if (this.access_rights && this.access_rights[1] && this.access_rights[1]['sub_modules'] && this.access_rights[1]['sub_modules'][300] && this.access_rights[1]['sub_modules'][300]['enable']) {
          this.router.navigate(['/configuration']);
        }
        else {
          this.logout();
        }
      }
    }
    if (this.path == "workbench") {
      if (this.access_rights && this.access_rights[1] && this.access_rights[1]['sub_modules'] && this.access_rights[1]['sub_modules'][200] && !this.access_rights[1]['sub_modules'][200]['enable']) {

        if (this.access_rights && this.access_rights[1] && this.access_rights[1]['sub_modules'] && this.access_rights[1]['sub_modules'][3001] && this.access_rights[1]['sub_modules'][3001]['enable']) {
          this.router.navigate(['/dashboard']);
        }
        else if (this.access_rights && this.access_rights[1] && this.access_rights[1]['sub_modules'] && this.access_rights[1]['sub_modules'][300] && this.access_rights[1]['sub_modules'][300]['enable']) {
          this.router.navigate(['/configuration']);
        }
        else {
          this.logout();
        }
      }
    }
    if (this.path == "configuration") {
      if (this.access_rights && this.access_rights[1] && this.access_rights[1]['sub_modules'] && this.access_rights[1]['sub_modules'][300] && !this.access_rights[1]['sub_modules'][300]['enable']) {
        if (this.access_rights && this.access_rights[1] && this.access_rights[1]['sub_modules'] && this.access_rights[1]['sub_modules'][3001] && this.access_rights[1]['sub_modules'][3001]['enable']) {
          this.router.navigate(['/dashboard']);
        }
        else if (this.access_rights && this.access_rights[1] && this.access_rights[1]['sub_modules'] && this.access_rights[1]['sub_modules'][200] && this.access_rights[1]['sub_modules'][200]['enable']) {
          this.router.navigate(['/workbench']);
        }
        else {
          this.logout();
        }
      }
    }
    if (this.path == "calendar") {
      if (this.access_rights && this.access_rights[1] && this.access_rights[1]['sub_modules'] && this.access_rights[1]['sub_modules'][150] && !this.access_rights[1]['sub_modules'][150]['enable']) {
        if (this.access_rights && this.access_rights[1] && this.access_rights[1]['sub_modules'] && this.access_rights[1]['sub_modules'][3001] && this.access_rights[1]['sub_modules'][3001]['enable']) {
          this.router.navigate(['/dashboard']);
        }
        else if (this.access_rights && this.access_rights[1] && this.access_rights[1]['sub_modules'] && this.access_rights[1]['sub_modules'][200] && this.access_rights[1]['sub_modules'][200]['enable']) {
          this.router.navigate(['/workbench']);
        }
        else if (this.access_rights && this.access_rights[1] && this.access_rights[1]['sub_modules'] && this.access_rights[1]['sub_modules'][300] && this.access_rights[1]['sub_modules'][300]['enable']) {
          this.router.navigate(['/configuration']);
        }
        else {
          this.logout();
        }
      }
    }
    if (this.path == "business") {
      if (this.access_rights && this.access_rights[1] && this.access_rights[1]['sub_modules'] && this.access_rights[1]['sub_modules'][250] && !this.access_rights[1]['sub_modules'][250]['enable']) {
        if (this.access_rights && this.access_rights[1] && this.access_rights[1]['sub_modules'] && this.access_rights[1]['sub_modules'][3001] && this.access_rights[1]['sub_modules'][3001]['enable']) {
          this.router.navigate(['/dashboard']);
        }
        else if (this.access_rights && this.access_rights[1] && this.access_rights[1]['sub_modules'] && this.access_rights[1]['sub_modules'][200] && this.access_rights[1]['sub_modules'][200]['enable']) {
          this.router.navigate(['/workbench']);
        }
        else if (this.access_rights && this.access_rights[1] && this.access_rights[1]['sub_modules'] && this.access_rights[1]['sub_modules'][300] && this.access_rights[1]['sub_modules'][300]['enable']) {
          this.router.navigate(['/configuration']);
        }
        else {
          this.logout();
        }
      }
    }
  }
}
