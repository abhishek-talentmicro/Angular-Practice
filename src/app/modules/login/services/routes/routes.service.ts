import { Injectable } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {

  current_route;
  route_listener;
  route_obs;
  constructor(private router: Router, private activated_route: ActivatedRoute) {

  }

  routeListener() {
    return new Observable((obs) => {
      this.router.events.subscribe((val) => {
        if (val instanceof NavigationEnd) {
          obs.next(
            this.activated_route.snapshot.params
          );
        }
      });
    })
  }
}
