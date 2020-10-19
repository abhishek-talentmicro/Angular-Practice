import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


export const english = {
  lng_id: 1,
  lng_title: "English",
  rtl: 0
};


@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  languages_list;
  loading = 0;
  current_language;
  API_URL = environment.SERVER_URL;

  constructor(private http: HttpClient) {

  }
  getLanguagesList() {
    return new Observable(obs => {
      this.loading = 1;
      if (this.languages_list && this.languages_list.length) {
        obs.next(this.languages_list);
      }
      else {
        this.http.get(this.API_URL + 'config/language')
          .subscribe(res => {
            if (res && res['data'] && res['data'].language_list)
              this.languages_list = res['data'].language_list;
            else
              this.languages_list = [];
            obs.next(this.languages_list);
            this.loading = 0;
          })
      }
    })
  }


  setCurrentLanguage(language) {
    this.current_language = language;
    localStorage.setItem('language', JSON.stringify(language));
  }

  getCurrentLanguage() {
    try {
      return JSON.parse(localStorage.getItem('language'));
    }
    catch (err) {
      return english;
    }
  }
  getAllLabels() {
    return this.http.get(environment.SERVER_URL + 'Labels/GetConfigLabel?module_code=11');
  }
}
