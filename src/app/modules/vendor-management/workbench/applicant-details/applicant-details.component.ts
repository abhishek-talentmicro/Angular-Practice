import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ChangeDetectorRef, Input, ViewChild, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { WorkbenchComponent } from '../workbench.component';
import { ViewAssessmentsComponent } from 'src/app/controls/components/assessment/view-assessments/view-assessments.component';
import { ApplicantDetailsService } from 'src/app/services/vendor-management/workbench/applicant-details/applicant-details.service';
import { MatDrawer } from '@angular/material/sidenav';
import { jsonParse } from 'src/app/functions/functions';
import { WorkbenchService } from 'src/app/services/vendor-management/workbench/workbench.service';
import { WorkbenchTabsService } from 'src/app/services/vendor-management/workbench-tabs/workbench-tabs.service';
import { NotificationService } from 'src/app/services/shared/notification/notification.service';
import { prepareSections } from 'src/app/controls/components/dynamic-form/dynamic-form.component';

export class StageStatus {
  stage_code: Number;
  status_code: Number;
  reason_ids: Number;
  notes: String;
  interview_scheduler: Object;
  questionaries: Object;
  req_res_ids;

  setStageStatus(obj) {
    this.stage_code = obj.stage_code,
      this.status_code = obj.status_code,
      this.reason_ids = obj.reason_ids,
      this.notes = obj.notes
    // this.req_res_ids=obj.req_res_ids
  }
  getStageStatus() {
    return {
      stage_code: this.stage_code,
      status_code: this.status_code,
      req_res_ids: this.req_res_ids || [],
      reason_ids: this.reason_ids || [],
      notes: this.notes,
      questionaries: this.questionaries || {}
    }
  }
  getStageStatusInterview() {
    return {
      stage_code: this.stage_code,
      status_code: this.status_code,
      reason_ids: this.reason_ids,
      notes: this.notes,
      interview_scheduler: this.interview_scheduler || {}
    }
  }
}
@Component({
  selector: 'app-applicant-details',
  templateUrl: './applicant-details.component.html',
  styleUrls: ['./applicant-details.component.scss'],
  providers: [ApplicantDetailsService]
})
export class ApplicantDetailsComponent implements OnInit, OnChanges {
  stage_status: FormGroup;
  applicant_detail_form: FormGroup;
  questionnaire_form: FormGroup;
  @Input() current_tab;
  @ViewChild("sideNav1", { static: false }) sideNav1: MatDrawer;
  @Input() activityHistory;
  @Input() new_tab_callback
  other_data: Object = new Object()
  stage_obj: StageStatus = new StageStatus()
  display_type
  section_data
  // display_type_stage
  // section_data_stage
  t_id
  data: any;
  is_notes_mandatory = false
  activity_history
  masters = []
  flag
  display_type_questions: any;
  section_data_questions: any;
  status: any;
  stage: any;
  notes;
  is_reason_mandatory: boolean = false;
  applicant_name: any;
  is_questionnarie: boolean = false;
  reason_list: any;
  row_data;
  requirement_id: any;
  enable_reason;
  enable_notes;
  constructor(
    private workbench_service: WorkbenchService,
    private change_detector: ChangeDetectorRef,
    private workbench_tabsservice: WorkbenchTabsService,
    private applicant_svc: ApplicantDetailsService,
    private notification_svc: NotificationService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.applicant_detail_form = new FormGroup({});
    // this.form_group1 = new FormGroup({});
    this.questionnaire_form = new FormGroup({});
  }

  ngOnInit() {


    this.data = this.workbench_tabsservice.getTabDetails(this.current_tab)

    this.loadStageStatusForm()
    if (this.data && this.data.data.selected_entries && this.data.data.selected_entries.length > 0) {
      this.row_data = this.data.data.selected_entries[0];

      this.applicant_name = this.data.data.selected_entries[0].candidate_name
    }
    if (this.data && this.data.data.tab_flag) {

      this.getReqResIDs().then(res => {
        this.getDetails().then(res => {
          this.getStageStatusMatser()
          this.getStageDetails()
          // this.stage_status.get('status_code').disable()
        });
      })
    } else {
      if (this.data) {
        this.section_data = this.data.data.section_data
        this.display_type = this.data.data.display_type
        this.activity_history = this.data.data.activity_history
        // this.section_data_stage = this.data.data.section_data_stage,
        this.section_data_questions = this.data.data.section_data_questions
        // this.display_type_stage = this.data.data.display_type_stage,
        this.display_type_questions = this.data.data.display_type_questions
        this.is_reason_mandatory = this.data.data.is_reason_mandatory
        this.is_notes_mandatory = this.data.data.is_notes_mandatory
        this.stage = this.data.data.stage
        this.masters = this.data.data.masters
        this.t_id = this.data.data.t_id
        this.status = this.data.data.status
        this.reason_list = this.data.data.reason_list
        this.is_questionnarie = this.data.data.is_questionnarie
        this.questionnaire_form = this.data.data.questionnaire_form
        if (this.data.data.stage_status) {
          this.stage_status.patchValue(this.data.data.stage_status.value);
          this.change_detector.detectChanges()
        }
        // this.setStatgeStatusForm()
      }
    }
    this.change_detector.detectChanges();
  }
  ngOnChanges() {


  }
  ngOnDestroy() {
    this.updateTabDetails(0)
  }

  loadStageStatusForm() {
    this.stage_status = new FormGroup({
      status_code: new FormControl(null, Validators.required),
      stage_code: new FormControl(null, Validators.required),
      reason_ids: new FormControl(null),
      notes: new FormControl(null),
      transaction_type: new FormControl(null),
      tn_id: new FormControl(null),
      multiple_flag: new FormControl(null),
      req_res_ids: new FormControl(null),
      req_res_id: new FormControl(null)
    })
  }

  updateStageStatus(no) {
    if (this.stage_status.value.reason_ids) {
      this.stage_status.patchValue({ reason_ids: [this.stage_status.value.reason_ids] })
    }

    if (no == 1) {
      this.stage_obj.setStageStatus(this.stage_status.value)
      this.stage_obj.questionaries = this.questionnaire_form.value
      this.applicant_svc.updateStageStatus(this.stage_obj.getStageStatus(), this.other_data['template_code'], this.section_data_questions[0].section_id, this.t_id).subscribe(res => {

        if (res['status']) {
          this.notification_svc.success(res['message'])
          this.getDetails();
        }
      }, err => {
        this.notification_svc.snackbar(err, "Close", 3000)
      })

    } else {
      if (this.stage_status.valid) {
        this.stage_obj.setStageStatus(this.stage_status.value)

        this.applicant_svc.setOnlyStageStatus(this.stage_obj.getStageStatus()).subscribe(res => {

          if (res['status']) {
            this.getDetails();
            this.notification_svc.success(res['message'])
          }
        }, err => {
          this.notification_svc.snackbar(err, "Close", 3000)
        })
      }
      else {
        // this.markerFormGroup(this.stage_status)
      }
    }

  }

  setStatgeStatusForm() {
    if (this.stage_status) {
      this.stage_status.patchValue(this.stage_status.value)
    }
  }

  actHistory(t_id) {
    this.activityHistory(t_id)
  }

  viewActivity() {
    this.sideNav1.toggle()
  }
  updateTabDetails(no) {
    this.flag = no
    this.workbench_tabsservice.updateTabDetails(this.current_tab, {
      'tab_flag': this.flag,
      section_data: this.section_data,
      display_type: this.display_type,
      activity_history: this.activity_history,
      masters: this.masters,
      row_data: this.row_data,
      // section_data_stage: this.section_data_stage,
      section_data_questions: this.section_data_questions,
      // display_type_stage: this.display_type_stage,
      display_type_questions: this.display_type_questions,
      is_reason_mandatory: this.is_reason_mandatory,
      is_notes_mandatory: this.is_notes_mandatory,
      stage: this.stage,
      t_id: this.t_id,
      status: this.status,
      reason_list: this.reason_list,
      is_questionnarie: this.is_questionnarie,
      questionnaire_form: this.questionnaire_form,
      stage_status: this.stage_status
    })

  }

  getStageStatusMatser() {
    // this.applicant_svc.getStageStatusMaster().subscribe(res=>{

    //   if(res['status']){
    //     // this.stage=
    //   }
    // })
  }

  setMandatory(e) {
    if (e) {
      try {
        e.notes_mandatory == 1 ? this.is_notes_mandatory = true : this.is_notes_mandatory = false;
      }
      catch (e) {
        this.is_notes_mandatory = false
      }
      try {
        e.reason_mandatory > 0 ? this.is_reason_mandatory = true : this.is_reason_mandatory = false;
      } catch (e) {
        this.is_reason_mandatory = false
      }
      try {
        e.enable_form == 1 ? this.is_questionnarie = true : this.is_questionnarie = false;
      }
      catch (e) {
        this.is_questionnarie = false
      }

      this.enable_reason = e.enable_reason;
      this.enable_notes = e.enable_notes;
      if (e.reason_mandatory) {

        this.stage_status.get('reason_ids').setValidators(Validators.required);
        this.stage_status.updateValueAndValidity();
      }
      if (e.notes_mandatory) {
        this.notes = true;
        this.stage_status.get('notes').setValidators(Validators.required);
        this.stage_status.updateValueAndValidity();
      }
      if (e.reasons) {
        this.reason_list = e.reasons || []
      }
    }
    if (this.is_questionnarie) {
      this.other_data['template_code'] = e.form_template_code
      this.getQuestionnarie(e.form_template_code)
    }

  }

  getStageDetails() { //stage status api call
    if (this.t_id) {
      this.applicant_svc.getStageStatus(this.requirement_id, this.t_id).subscribe(res => {

        if (res['data']) {
          this.stage = res['data'].stagestatus
          this.reason_list = res['data']['reason']

          let stage
          for (let i of this.stage) {
            if (i.stage_code == res['data']['stage_code']) {
              this.stage_status.patchValue({
                'stage_code': res['data']['stage_code'],
                'status_code': res['data']['status_code']
              });
              // this.status = this.jsonCheck(i.status)
              // if (this.status) {
              //   for (let status of this.status) {
              //     if (status.status_code == res['data']['status_code']) {
              //       this.stage_status.patchValue({ 'status_code': res['data']['status_code'] });
              //     }
              //   }
              // }
            }
          }
          // if (this.stage) {
          //   this.status = this.jsonCheck(this.stage.status)
          // }

        }
      })
    }
  }

  stageclk(ev) {


    if (ev) {
      this.status = jsonParse(ev.status);
      if (ev.status) {
        let found = 0;
        for (let status of this.status) {
          if (status['status_code'] == this.stage_status.value.status_code) {
            this.setMandatory(status);
            found = 1;
            break;
          }
        }
        if (!found) {
          this.stage_status.controls['status_code'].reset()
        }
      }
    }
  }

  getDetails() {
    return new Promise((resolve, reject) => {
      this.workbench_service.reqResumeList(2034, this.t_id).subscribe(res => {

        if (res && res['data'] && res['data']['details']) {
          this.section_data = res['data']['details']
          if (res['data']['details'][0]) {
            this.display_type = res['data']['details'][0].display_type_id
          }
        }
      })
      /* this.workbench_service.getFormDetails(8008, 0).subscribe(res => {

        if (res && res['data'] && res['data']['details']) {
          this.section_data_stage = res['data']['details']

          if (res['data']['details'][0]) {
            this.display_type_stage = res['data']['details'][0].display_type_id
          }
        }
      }) */
      //

      this.change_detector.detectChanges();
      if (this.t_id) {
        this.workbench_service.getApplicantStatus(this.t_id).subscribe(res => {

          if (res && res['data']) {
            this.activity_history = res['data']
          }
        })
      }
      resolve()
    })
  }

  getQuestionnarie(template_code) {
    this.workbench_service.getFormDetails({ template_code: template_code, form_code: 0, t_id: 0 }).subscribe(res => {

      if (res && res['data'] && res['data']['details']) {
        this.section_data_questions = res['data']['details']
        if (res['data']['details'][0]) {
          this.display_type_questions = res['data']['details'][0].display_type_id
        }
      }
    })
    let virtual_scroll_fields = {};
    prepareSections(this.section_data_questions, this.questionnaire_form, this.section_data_questions, null, this.fb, this.display_type_questions, virtual_scroll_fields);
    console.log(virtual_scroll_fields);
    let master_obj = [];
    for (let i = 0; i < Object.keys(virtual_scroll_fields).length; i++) {
      let obj = {}
      let master_id = Object.keys(virtual_scroll_fields)[i];
      obj['master_id'] = master_id;
      obj['values'] = virtual_scroll_fields[master_id];
      master_obj.push(obj);
    }

    this.workbench_service.getFormMaster(master_obj, { template_code: template_code, form_code: 0, t_id: 0 }).subscribe(masters => {
      this.masters = masters['data'].masters;
      this.change_detector.detectChanges();
    })
  }
  getReqResIDs() {
    return new Promise((resolve, reject) => {
      if (this.data) {

        if (this.data['data']['selected_entries'] && this.data['data']['selected_entries'].length) {
          this.t_id = this.data['data']['selected_entries'][0].req_res_id;
          this.requirement_id = this.data['data']['selected_entries'][0].requirement_id;
          this.stage_obj.req_res_ids = [this.t_id]

        }
      }
      resolve()
    })
  }


  // this.applicant_svc.getAssessmentDetails(this.t_id).subscribe(res => {
  //   if (res) {


  //   }
  // })


  log() {

  }
  jsonCheck(obj) {
    try {
      obj = JSON.parse(obj)
    }
    catch (e) {
      return obj
    }
    return obj
  }
}
