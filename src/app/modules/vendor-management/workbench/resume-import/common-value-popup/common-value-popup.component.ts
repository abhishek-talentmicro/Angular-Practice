// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { FormGroup, FormControl, Validators } from '@angular/forms';
// import { Component, OnInit, Inject } from '@angular/core';
// import { ResumeImportPopup } from '../../../configuration/classes/resume-search/resume-search';
// import { ResumeSearchService } from '../../../../../services/ATS/workbench/resume/resume-search/resume-search.service';
// import { ResumeImportService } from 'src/app/services/ATS/workbench/resume/resume-import/resume-import.service';
// import { NotificationService } from 'src/app/services/shared/notification/notification.service';
// import { Validator } from 'src/app/classes/dynamic-forms/controls/field-config';
// import { markFormGroupTouched } from 'src/app/controls/components/dynamic-form/dynamic-form.component';

// @Component({
//   selector: 'app-common-value-popup',
//   templateUrl: './common-value-popup.component.html',
//   styleUrls: ['./common-value-popup.component.scss'],
//   providers: [ResumeSearchService,
//     ResumeImportService]
// })
// export class CommonValuePopupComponent implements OnInit {
//   filter_form: FormGroup;
//   loading: boolean = false;
//   master_data_list;
//   comman_values = new CommanValues();
//   popup_details = new ResumeImportPopup();
//   constructor(
//     private resume_search_srv: ResumeSearchService,
//     private dialog_ref: MatDialogRef<CommonValuePopupComponent>,
//     private resume_import_srv: ResumeImportService,
//     private notification: NotificationService,
//     @Inject(MAT_DIALOG_DATA) public data
//   ) {

//   }

//   ngOnInit() {
//     console.log(this.data)
//     this.initForm();


//   }

//   initForm() {
//     this.filter_form = new FormGroup({
//       title: new FormControl(null),
//       resume_flag: new FormControl(0),
//       source: new FormControl(null, Validators.required),
//       requirement_ids: new FormControl(null),
//       skills: new FormControl(null),
//       education: new FormControl(null),
//       designation: new FormControl(null),
//       location: new FormControl(null),
//       experience: new FormControl(null),
//       notice_period: new FormControl(null),
//       currency: new FormControl(null),
//       duration: new FormControl(null),
//       scale: new FormControl(null),
//       ctc_present: new FormControl(null),
//       ctc_expected: new FormControl(null),
//       keywords: new FormControl(null),
//       req_id: new FormControl(0)
//     });
//     this.filterResume();
//   }

//   filterResume() {
//     // this.loading =true;
//     this.resume_import_srv.getMaster(this.popup_details.getResumeSearch()).subscribe(res => {
//       this.loading = false;
//       if (res && res['data'] && res['data']['masters']) {

//         this.master_data_list = res['data']['masters'];
//       }
//     }, err => {
//       this.loading = false;
//       this.master_data_list = [];
//     })

//   }
//   // FOR SEARCH FEATURE FOR FILTERING RESUMES
//   searchFilter() {
//     this.popup_details.keywords = this.filter_form.get('keywords').value;
//     this.popup_details.keywords_and = 1;
//     this.resume_search_srv.getResumeList(this.popup_details.getResumeSearch()).subscribe(res => {

//       if (res && res['data']) {


//       }
//     })
//   }
//   saveImportDetails() {
//     // if (this.data) {
//     //   this.filter_form.get('source').clearValidators();
//     // }
//     console.log(this.filter_form.valid, this.filter_form.value)
//     if (this.data) {
//       if (this.filter_form.valid) {
//         this.comman_values.setCommanValues(this.filter_form.value);
//         this.dialog_ref.close(this.comman_values.getCommanValues());
//       }
//       else {
//         this.notification.snackbar('Please fill mandatory field', 'Close', 3000);
//       }
//     }
//     else {
//       if (this.filter_form.valid) {
//         this.comman_values.setCommanValues(this.filter_form.value);
//         this.dialog_ref.close(this.comman_values.getCommanValues());
//       }
//       else {
//         markFormGroupTouched(this.filter_form);
//       }
//     }



//   }
//   cancelImportDetails() {
//     this.dialog_ref.close();
//   }
//   close() {
//     this.dialog_ref.close();
//   }

// }


// export class CommanValues {
//   title
//   source
//   requirement_ids
//   skills
//   education
//   designation
//   location
//   experience
//   notice_period
//   currency
//   duration
//   scale
//   ctc_present
//   ctc_expected
//   keywords
//   req_id
//   resume_flag;

//   setCommanValues(obj) {
//     this.title = obj.title || '';
//     this.source = obj.source;
//     this.requirement_ids = obj.requirement_ids;
//     this.skills = obj.skills || [];
//     this.education = obj.education || [];
//     this.designation = obj.designation;
//     this.location = obj.location;
//     this.experience = obj.experience;
//     this.notice_period = obj.notice_period;
//     this.resume_flag = obj.resume_flag || 0
//   }
//   getCommanValues() {
//     return {
//       // title: this.title || '',
//       source: this.source,
//       requirement_ids: this.requirement_ids ? [this.requirement_ids] : [],
//       resume_flag: this.resume_flag == true ? 1 : 0
//       // skills: this.skills || [],
//       // education: this.education || [],
//       // designation: this.designation,
//       // location: this.location,
//       // experience: this.experience,
//       // notice_period: this.notice_period,
//     }
//   }
// }





















import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { NotificationService } from 'src/app/services/shared/notification/notification.service';
import { prepareSections, markFormGroupTouched, findInvalidControls } from 'src/app/controls/components/dynamic-form/dynamic-form.component';
import { TranslateService } from '@ngx-translate/core';
import { ResumeSearchService } from 'src/app/services/vendor-management/workbench/resume/resume-search/resume-search.service';
import { ResumeImportService } from 'src/app/services/vendor-management/workbench/resume/resume-import/resume-import.service';
import { WorkbenchService } from 'src/app/services/vendor-management/workbench/workbench.service';

@Component({
  selector: 'app-common-value-popup',
  templateUrl: './common-value-popup.component.html',
  styleUrls: ['./common-value-popup.component.scss'],
  providers: [ResumeSearchService,
    WorkbenchService,
    ResumeImportService]
})
export class CommonValuePopupComponent implements OnInit {
  public dataSavedRef: Function
  filter_form: FormGroup;
  loading: boolean = false;
  master_data_list;
  comman_values = new CommanValues();
  popup_details = new ResumeImportPopup();
  t_id
  import_details_form: FormGroup = new FormGroup({})
  import_details = {
    masters: [],
    section_list: [],
    display_type: 0,
    section_title: 'Import Details'
  }
  constructor(
    private resume_search_srv: ResumeSearchService,
    private dialog_ref: MatDialogRef<CommonValuePopupComponent>,
    private resume_import_srv: ResumeImportService,
    private notification: NotificationService,
    private workbench_srv: WorkbenchService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data,
    private translate: TranslateService
  ) {

  }

  ngOnInit() {
    this.dataSavedRef = this.dataSaved.bind(this);
    this.initForm();
    this.loadFormPlot();
  }

  loadFormPlot() {
    this.workbench_srv.getFormDetails({ form_code: 2002, template_code: 0, t_id: this.t_id || 0 }).subscribe(res => {
      console.log(res)
      if (res && res['data']) {
        if (res['data']['details']) {
          this.import_details.section_list = res['data']['details'];
          this.import_details.display_type = res['data']['details'][0].display_type_id;
          this.import_details.section_title = res['data']['details'][0].section_title;

          let virtual_scroll_fields = {};
          prepareSections(this.import_details.section_list, this.import_details_form, this.import_details.section_list, this.t_id, this.fb, this.import_details.display_type, virtual_scroll_fields);
          console.log(virtual_scroll_fields);
          let master_obj = [];
          for (let i = 0; i < Object.keys(virtual_scroll_fields).length; i++) {
            let obj = {}
            let master_id = Object.keys(virtual_scroll_fields)[i];
            obj['master_id'] = master_id;
            obj['values'] = virtual_scroll_fields[master_id];
            master_obj.push(obj);
          }
          this.workbench_srv.getFormMaster(master_obj, { form_code: 2002, template_code: 0, t_id: this.t_id || 0, req_res_id: 0 }).subscribe(res => {
            console.log(res)
            if (res && res['data'] && res['data']['masters']) {
              this.import_details.masters = res['data']['masters'];
            }
          })

        }
      }
    })

  }

  initForm() {
    this.filter_form = new FormGroup({
      title: new FormControl(null),
      resume_flag: new FormControl(0),
      source: new FormControl(null, Validators.required),
      requirement_ids: new FormControl(null),
      skills: new FormControl(null),
      education: new FormControl(null),
      designation: new FormControl(null),
      location: new FormControl(null),
      experience: new FormControl(null),
      notice_period: new FormControl(null),
      currency: new FormControl(null),
      duration: new FormControl(null),
      scale: new FormControl(null),
      ctc_present: new FormControl(null),
      ctc_expected: new FormControl(null),
      keywords: new FormControl(null),
      req_id: new FormControl(0)
    });
    this.filterResume();
  }

  filterResume() {
    // this.loading =true;
    this.resume_import_srv.getMaster(this.popup_details.getResumeSearch()).subscribe(res => {
      this.loading = false;
      if (res && res['data'] && res['data']['masters']) {

        this.master_data_list = res['data']['masters'];
      }
    }, err => {
      this.loading = false;
      this.master_data_list = [];
    })

  }
  // FOR SEARCH FEATURE FOR FILTERING RESUMES
  searchFilter() {
    this.popup_details.keywords = this.filter_form.get('keywords').value;
    this.popup_details.keywords_and = 1;
    this.resume_search_srv.getResumeList(this.popup_details.getResumeSearch()).subscribe(res => {

      if (res && res['data']) {


      }
    })
  }

  saveDynamicImport() {
    if (this.import_details_form && this.import_details_form.valid) {
      this.comman_values.setCommanValues(this.filter_form.value);
      let keys = Object.keys(this.import_details_form.value);
      let obj = this.import_details_form.value[keys[0]]
      this.dialog_ref.close(obj);
    }
    else {
      markFormGroupTouched(this.import_details_form);
      let invalid_controls = findInvalidControls(this.import_details_form, this.import_details.section_list, this.translate, this.notification);
      console.log(invalid_controls);
    }
  }


  saveImportDetails() {
    if (this.data) {
      this.filter_form.get('source').clearValidators();
    }
    console.log(this.filter_form.valid, this.filter_form.value)
    if (this.data) {
      if (this.filter_form.valid) {
        this.comman_values.setCommanValues(this.filter_form.value);
        this.dialog_ref.close(this.comman_values.getCommanValues());
      }
      else {
        this.notification.snackbar('Please fill mandatory fields', 'Close', 3000);
      }
    }
    else {
      this.comman_values.setCommanValues(this.filter_form.value);
      this.dialog_ref.close(this.comman_values.getCommanValues());
    }



  }
  cancelImportDetails() {
    this.dialog_ref.close();
  }
  close() {
    this.dialog_ref.close();
  }

  dataSaved(ev) {
    console.log(ev)
  }

}


export class CommanValues {
  title
  source
  requirement_ids
  skills
  education
  designation
  location
  experience
  notice_period
  currency
  duration
  scale
  ctc_present
  ctc_expected
  keywords
  req_id
  resume_flag;

  setCommanValues(obj) {
    this.title = obj.title || '';
    this.source = obj.source;
    this.requirement_ids = obj.requirement_ids;
    this.skills = obj.skills || [];
    this.education = obj.education || [];
    this.designation = obj.designation;
    this.location = obj.location;
    this.experience = obj.experience;
    this.notice_period = obj.notice_period;
    this.resume_flag = obj.resume_flag || 0
  }
  getCommanValues() {
    return {
      // title: this.title || '',
      source: this.source,
      requirement_ids: this.requirement_ids ? [this.requirement_ids] : [],
      resume_flag: this.resume_flag == true ? 1 : 0
      // skills: this.skills || [],
      // education: this.education || [],
      // designation: this.designation,
      // location: this.location,
      // experience: this.experience,
      // notice_period: this.notice_period,
    }
  }
}

export class ResumeImportPopup {
  designation: [];
  title;
  skills: [];
  education: [];
  location: [];
  experience_from: number;
  experience_to: number;
  notice_period_from: number;
  notice_period_to: number;
  currency: number;
  duration: number;
  scale: number;
  ctc_from: number;
  ctc_to: number;
  keywords: string;
  skill_and = 0;
  location_and = 0;
  designation_and = 0;
  education_and = 0;
  notice_period_and = 0;
  experience_and = 0;
  ctc_and = 0;
  tn_id = 0;
  keywords_and = 0;
  req_id = 0;

  setResumeSearch(obj) {
    this.title = obj.title;
    this.skills = obj.skills;
    this.designation = obj.designation;
    this.designation = obj.education;
    this.location = obj.location;
    this.experience_from = obj.experience_from;
    this.experience_to = obj.experience_to;
    this.notice_period_from = obj.notice_period_from;
    this.notice_period_to = obj.notice_period_to;
    this.currency = obj.currency;
    this.duration = obj.duration;
    this.scale = obj.scale;
    this.ctc_from = obj.ctc_from;
    this.ctc_to = obj.ctc_to;
    this.keywords = obj.keywords;
    this.skill_and = obj.skill_and;
    this.location_and = obj.location_and;
    this.designation_and = obj.designation_and;
    this.education_and = obj.education_and;
    this.notice_period_and = obj.notice_period_and;
    this.experience_and = obj.experience_and;
    this.ctc_and = obj.ctc_and;
    this.tn_id = obj.tn_id;
    this.keywords_and = obj.keywords_and;
    this.req_id = obj.req_id;


  }

  setFormResumeSearch(obj) {
    this.title = obj.title
    this.skills = obj.skills ? obj.skills : [];
    this.skill_and = obj.skills.length > 0 ? 1 : 0;
    this.education = obj.education ? obj.education : [];
    this.education_and = obj.education.length > 0 ? 1 : 0;
    this.designation = obj.designation ? obj.designation : [];
    this.designation_and = obj.designation.length > 0 ? 1 : 0;
    this.location = obj.location ? obj.location : [];
    this.location_and = obj.location.length > 0 ? 1 : 0;
    this.experience_from = obj.experience_from;
    this.experience_and = obj.experience_from != "" ? 1 : 0;
    this.experience_to = obj.experience_to;
    this.notice_period_from = obj.notice_period_from;
    this.notice_period_and = obj.notice_period_from ? 1 : 0;
    this.notice_period_to = obj.notice_period_to;
    this.currency = obj.currency ? obj.currency : 0
    this.duration = obj.duration ? obj.duration : 0;
    this.scale = obj.scale ? obj.scale : 0;
    this.ctc_from = obj.ctc_from;
    this.ctc_to = obj.ctc_to;
    this.ctc_and = obj.ctc_to ? 1 : 0;
    this.keywords = obj.keywords;
    this.keywords_and = obj.keywords != '' ? 1 : 0;
    this.req_id = obj.req_id || 0;
  }

  getResumeSearch() {
    return {
      designation: this.designation ? this.designation : [],
      skills: this.skills ? this.skills : [],
      education: this.education ? this.education : [],
      location: this.location ? this.location : [],
      experience_from: this.experience_from ? this.experience_from : 0,
      experience_to: this.experience_to ? this.experience_to : 0,
      notice_period_from: this.notice_period_from ? this.notice_period_from : 0,
      notice_period_to: this.notice_period_to ? this.notice_period_to : 0,
      currency: this.currency ? this.currency : 0,
      duration: this.duration ? this.duration : 0,
      scale: this.scale ? this.scale : 0,
      ctc_from: this.ctc_from ? this.ctc_from : 0,
      ctc_to: this.ctc_to ? this.ctc_to : 0,
      keywords: this.keywords ? this.keywords : '',
      skill_and: this.skill_and ? this.skill_and : 0,
      location_and: this.location_and ? this.location_and : 0,
      designation_and: this.designation_and ? this.designation_and : 0,
      education_and: this.education_and ? this.education_and : 0,
      notice_period_and: this.notice_period_and ? this.notice_period_and : 0,
      experience_and: this.education_and ? this.education_and : 0,
      ctc_and: this.ctc_and ? this.ctc_and : 0,
      tn_id: this.tn_id ? this.tn_id : 0,
      keywords_and: this.keywords_and ? this.keywords_and : 0,
      req_id: this.req_id ? this.req_id : 0,
      title: this.title
    }
  }
}