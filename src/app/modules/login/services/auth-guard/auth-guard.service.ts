import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { SessionService } from 'src/app/modules/login/services/session/session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private user: SessionService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.user.user;
    if (currentUser) {
      // this.router.navigate(['/workbench']);
      return true;
    }
    else {
      this.router.navigate(['/login']);
      return false;
    }

    // this.router.navigate(['/workbench']);
    // const currentUser = this.authenticationService.currentUserValue;
    //   // const currentCompany = this.authenticationService.getSelectedCompany;
    //   if (currentUser) {
    //     // authorised so return true
    //     // if (currentCompany)
    //     //   return true;
    //     // else {
    //     return true;
    //     // this.router.navigate(['/workbench']);
    //     //}
    //   }
    //   else {
    //     // not logged in so redirect to login page with the return url
    //     this.router.navigate(['/login']);
    //     return false;
    //   }
    // }

    // companyRoute(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //   const currentUser = this.authenticationService.currentUserValue;
    //   if (currentUser) {
    //     // authorised so return true
    //     return true;
    //   }

    //   // not logged in so redirect to login page with the return url
    //   this.router.navigate(['/login']);
    //   return false;
  }
}
