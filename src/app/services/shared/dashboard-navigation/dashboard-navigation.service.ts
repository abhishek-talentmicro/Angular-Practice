import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardNavigationService {
  private code_source = new BehaviorSubject({});
  current_code = this.code_source.asObservable();
  static_code;
  team_flag;
  dashboard_applicant_flag;
  dashboard_requirement_flag;
  dashboard_flag;
  constructor(
    private router: Router
  ) { }

  setCode(obj) {
    this.router.navigate(['workbench']);
    this.code_source.next(obj);
  }

  setStaticCode(obj) {
    if (obj) {
      this.dashboard_flag = obj.dashboard_flag;
      this.static_code = obj.code;
      this.dashboard_applicant_flag = obj.dashboard_applicant_flag;
      this.team_flag = obj.team_flag;
      this.dashboard_requirement_flag = obj.dashboard_requirement_flag;
      this.router.navigate(['/workbench']);
    }
  }
  getStaticCode(param?) {
    let obj = {
      dashboard_flag: this.dashboard_flag,
      code: this.static_code,
      team_flag: this.team_flag,
      dashboard_applicant_flag: this.dashboard_applicant_flag,
      dashboard_requirement_flag: this.dashboard_requirement_flag
    };
    if (!param)
      this.resetValues();
    return obj;
  }

  resetValues() {
    this.dashboard_flag = null;
    this.static_code = null;
    this.dashboard_applicant_flag = null;
    this.team_flag = null;
    this.dashboard_requirement_flag = null;
  }
}


// export class DashboardNavigationService {
//   code = new Object();
//   code_changes: Subject<Object> = new Subject<Object>();
//   constructor(
//     private router: Router
//   ) { }

//   setCode(obj) {
//     this.code_changes.next(obj);
    // this.router.navigate(['workbench']);
//   }
//   getCode(): Observable<any> {
//     return this.code_changes.asObservable();
//   }
// }

