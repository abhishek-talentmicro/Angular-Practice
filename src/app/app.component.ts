import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { User } from './modules/login/classes/user/user';
import { SessionService } from './modules/login/services/session/session.service';
import { LanguageService } from './services/shared/language/language.service';
import { LoaderService } from './modules/loader/services/loader/loader.service';
import { ProfileSettingsService } from './services/shared/profile-settings/profile-settings.service';
import { TranslateService, TranslationChangeEvent } from '@ngx-translate/core';
export const english = {
  lng_id: 1,
  lng_title: "English",
  rtl: 0
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Vendor-Management';
  current_language;
  currentUser: User = new User();
  current_route;
  public static tab_key: boolean = false;
  loader = false;
  constructor(
    private translate: TranslateService,
    private language: LanguageService,
    public _session: SessionService,
    private loader_svc: LoaderService,
    private change_detector: ChangeDetectorRef,
    private profile_svc: ProfileSettingsService
  ) {
    this.loader_svc.showLoader();
    // this.loader_svc.loader_sub.asObservable().subscribe(res => {
    //   this.loader = res;
    //   this.change_detector.detectChanges();

    // })
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('1');
    let lng: any;   

    if (localStorage.getItem('language')) {
      try {
        lng = JSON.parse(localStorage.getItem('language'));
        translate.use(lng.lng_id);
      }
      catch (err) {

        lng = 'english';
      }
    }
    else {
      lng = 'english';
      translate.use('1');
    }

    this.language.setCurrentLanguage(lng);
    this.languageChanged(lng);

    this.translate.onTranslationChange.subscribe((event: TranslationChangeEvent) => {
      this.setTextDirection();
    });
    // this._session.getSession().subscribe(res => {

    this.language.getAllLabels().subscribe(res => {
      let labels;
      try {
        if (typeof res == 'string') {
          let str = res;
          str = str.replace(/[\\]+\\"/g, '\\"');
          // str = str.replace(/\\"/g, '"');
          // str = str.replace(/TALLINTHC/g, '\\"');

          labels = jsonParse(str.replace(/[\t]/g, "    "));
          // console.log(str);
        }
        else {
          labels = res;
        }

      } catch (error) {
        if (typeof res == 'object')
          labels = res;
        else
          labels = res;
      }

      // console.log(jsonParse(JSON.parse(String(res).replace(/[\t]/g,"    "))));

      this.translate.setTranslation(this.current_language.lng_id, labels);
    }, err => { })

    //   if (res&&res.access_token&&isEmpty(this.profile_svc.access_rights)) {
    //     this.getAccessRights();

    //   }
    // })

    this.language.getAllLabels().subscribe(res => {
      let labels;
      try {
        if (typeof res == 'string') {
          let str = res;
          str = str.replace(/[\\]+\\"/g, '\\"');
          // str = str.replace(/\\"/g, '"');
          // str = str.replace(/TALLINTHC/g, '\\"');

          labels = jsonParse(str.replace(/[\t]/g, "    "));
          // console.log(str);
        }
        else {
          labels = res;
        }

      } catch (error) {
        if (typeof res == 'object')
          labels = res;
        else
          labels = res;
      }

      // console.log(jsonParse(JSON.parse(String(res).replace(/[\t]/g,"    "))));

      this.translate.setTranslation(this.current_language.lng_id, labels);
    }, err => { })
  }

  ngOnInit() {
    this.loader_svc.loader_sub.asObservable().subscribe(res => {
      this.loader = res;
      this.change_detector.detectChanges();
    })

    this._session.getSession().subscribe(res => {
      console.log(res)
      if (res && res.access_token) {
        this.getAccessRights();
      }
    })
  }

  loadRights() {

    this.profile_svc.getAccessRights().subscribe(res => {

      try {

        if (res['data'] && res['data']['access_rights'] && res['data']['access_rights']['form_data']) {
          let data = (res['data']['access_rights']['form_data'])
          let val = String(res['data']['access_rights']['form_data']).replace(/\\/g, '');

        }

        if (res['data'] && res['data']['details']) {
          this.profile_svc.getNotification(res['data'] && res['data']['details'])
        }

      }
      catch (e) {

      }
    })
  }



  // @HostListener('keyup', ['$event'])
  // keyup(event) {
  //   if (event.keyCode == 9) {
  //     AppComponent.tab_key = true;
  //   }
  //   else {
  //     AppComponent.tab_key = false;
  //   }
  // }
  // static getTabEv() {
  //   return this.tab_key;
  // }



  setTextDirection() {
    if (this.current_language.rtl == 1) {
      document.head.innerHTML += '<style>*{text-align: right;unicode-bidi: bidi-override;direction: RTL;}</style>';
    }
    else {
      document.head.innerHTML += '<style>*{text-align: left;unicode-bidi: unset;direction: LTR;}</style>';
    }
  }

  languageChanged(param) {

    this.current_language = param;
    this.translate.use(param.lng_id);
    this.setTextDirection();
  }
  getAccessRights() {

    this.profile_svc.getAccessRights().subscribe(res => {

      try {
        let data = res['data']['access_rights']['form_data']

        var str = (data);
        str = str.replace(/\\/g, "");

        this.profile_svc.setaccess_right(str);
        if (res && res['data'] && (res['data']['def_app_filter_id'] || res['data']['def_req_filter_id'])) {
          this.profile_svc.setDefaultFilter({
            def_app_filter_id: res['data']['def_app_filter_id'],
            def_req_filter_id: res['data']['def_req_filter_id']
          })
        }

        if (res['data'] && res['data']['details']) {
          this.profile_svc.getNotification(res['data'] && res['data']['details'])
        }

      }
      catch (err) {

      }
    })
  }
}
export function jsonParse(str) {
  try {
    if (typeof str == 'string')
      return JSON.parse(str);
    else
      return str;
  } catch (e) {

    if (typeof str == 'object')
      return str;
    else
      return str;
  }
}