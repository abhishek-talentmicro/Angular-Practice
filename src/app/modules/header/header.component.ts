import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef, ViewChild, NgZone, OnChanges } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { LanguageService } from 'src/app/services/shared/language/language.service';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from 'src/app/modules/loader/services/loader/loader.service';
import { ProfileSettingsService } from 'src/app/services/shared/profile-settings/profile-settings.service';
import { Subscription, BehaviorSubject } from 'rxjs';
import { string } from '@amcharts/amcharts4/core';
// import { FirebaseMessagingService } from 'src/app/services/shared/firebase-messaging/firebase-messaging.service';
import { Session } from '../login/classes/session/session';
import { SessionService } from '../login/services/session/session.service';
import { WorkbenchTabsService } from 'src/app/services/vendor-management/workbench-tabs/workbench-tabs.service';
import { ChangePasswordComponent } from '../login/components/change-password/change-password.component';
import { ProfileSettingsComponent } from '../shared/profile-settings/profile-settings.component';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: []
})
export class HeaderComponent implements OnInit, OnChanges {
  master = [];
  current_route = "";
  session: Session;
  vendor_registration_flag: boolean = false;
  header_style = {
    background: '#114d75 !important'
  }

  languages_list: any = [];

  current_language;

  @Output() language_changed = new EventEmitter<any>();
  access_rights: Object;
  subscription: Subscription;
  notifications = [];
  workbench_tabs;
  constructor(
    private router: Router,
    private language: LanguageService,
    private dialog: MatDialog,
    public session_svc: SessionService,
    private change_detector: ChangeDetectorRef,
    private loader_svc: LoaderService,
    private profile_svc: ProfileSettingsService,
    private workbench_tabservice: WorkbenchTabsService,
    // public notification: FirebaseMessagingService,
    private ngZone: NgZone,

  ) {
    // if(this.profile_svc.access_rights&&(Object.keys(this.profile_svc.getAccessRightObj()).length)>0){


    //   let access_rights=this.profile_svc.getAccessRightObj();

    // }

    this.subscription = this.profile_svc.getAccessRightObj().subscribe(res => {

      this.access_rights = this.profile_svc.access_rights;
      sessionStorage.setItem('access_rights', JSON.stringify(this.access_rights));


    })

    this.profile_svc.notification.subscribe(notif => {
      this.notifications = notif;
    })
    // this.notification.notifications_subject.subscribe(res => {
    //   this.ngZone.run(() => {

    //     this.notifications.push(res);

    //   })
    // })

    if (!this.access_rights) {
      let access = sessionStorage.getItem('access_rights');
      if (access != "undefined") {
        this.access_rights = JSON.parse(access);
        this.profile_svc.setaccess_right(sessionStorage.getItem('access_rights'));
      }
      console.log(access)
      if (access == "undefined" || access == "null") {
        router.events.subscribe(event => {
          if (event instanceof NavigationEnd) {
            let s: string = event.url;
            if (!s.includes('registration')) {
              this.vendor_registration_flag = false;
              // this.logout();
            }
            else {
              this.vendor_registration_flag = true;
            }
          }
        });
      }
    }

    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.current_route = val.url.split('/')[1];

      }
    });
    language.getLanguagesList().subscribe(res => {
      if (res) {
        this.languages_list = res;
        this.current_language = this.language.getCurrentLanguage();
      }
    })
  }

  changeLanguage(language) {
    this.setLanguage(language);
    this.language_changed.emit(language);
  }

  setLanguage(language) {
    this.language.setCurrentLanguage(language);
    this.current_language = language;
  }

  ngOnInit() {
    this.session_svc.getSession().subscribe(res => {
      this.session = res;
      this.change_detector.detectChanges();
    })
    // this.notification.notifications_subject.subscribe(res => {
    //   this.ngZone.run(() => {

    //     this.notifications.push(res);

    //   })
    // })
  }

  ngOnChanges() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        let s: string = event.url;
        if (!s.includes('registration')) {
          this.vendor_registration_flag = false;
        }
        else {
          this.vendor_registration_flag = true;
        }
      }
    });
  }


  isEmpty(obj) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  english() {
    document.head.innerHTML += '<style>*{text-align: left;unicode-bidi: unset;direction: LTR;}</style>';
  }

  arabic() {
    document.head.innerHTML += '<style>*{text-align: right;unicode-bidi: bidi-override;direction: RTL;}</style>';
  }


  getChangePassword() {
    const dialog = this.dialog.open(ChangePasswordComponent, {
      width: '300px',
    });

  }

  getProfileSettings() {
    const dialog = this.dialog.open(ProfileSettingsComponent, {
      width: '500px',
      disableClose: false,
    });
  }

  logout() {
    console.log('logout btn')
    this.session_svc.logout();
  }

  gotoConfiguration(ev) {
    ev.preventDefault();
    if (window.location.href.indexOf('/configuration') == -1) {
      this.loader_svc.showLoader();
      this.router.navigate(['configuration']);
    }
  }

  openTabs(obj) {
    // this.notifications.splice(i, 1);
    let tab_id;
    if (obj.transaction_type == 1) {
      let data = { requirement_id: obj.transaction_id }
      tab_id = this.workbench_tabservice.addTab(obj ? (obj.job_code || obj.job_title) : 'Requirement Manager', 2, {
        form_code: 1070,
        data: data
      });
    }
    if (obj.transaction_type == 2) {
      let entries = {
        candidate_name: obj.candidate_name,
        res_id: obj.transaction_id,
      }
      tab_id = this.workbench_tabservice.addTab(obj.candidate_name || 'Resume Manager', 3, {
        form_code: 1515,
        data: entries
      });
    }
    if (obj.transaction_type == 3) {
      let entries = [{
        candidate_name: obj.candidate_name,
        req_res_id: obj.transaction_id,
      }]

      tab_id = this.workbench_tabservice.addTab(obj.candidate_name || 'Interview Manager', 7, {
        selected_entries: entries,
        tab_flag: 1
      });
    }

    // if (this.current_route != 'workbench') {
    this.router.navigate(['/workbench']);
    // }
    // else {
    //   if (tab_id) {
    //     this.workbench_tabservice.setActiveTabFromOtherComponent(String(tab_id));
    //   }
    // }
  }
}

