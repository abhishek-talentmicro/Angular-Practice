import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, Input, OnDestroy, Sanitizer, PipeTransform, Pipe, ViewChild, ContentChild } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { ResumeNotesComponent } from './resume-notes/resume-notes.component';
import { prepareSections, prepareSectionData, setActiveSection, enableSave, checkActiveSection, cancel } from 'src/app/controls/components/dynamic-form/dynamic-form.component';
import { NotificationService } from 'src/app/services/shared/notification/notification.service';
import { NotesService } from 'src/app/services/vendor-management/workbench/requirement/notes.service';
import { WorkbenchTabsService } from 'src/app/services/vendor-management/workbench-tabs/workbench-tabs.service';
import { ResumeCreateService } from 'src/app/services/vendor-management/workbench/resume/resume-create/resume-create.service';
import { ResumeSearchService } from 'src/app/services/vendor-management/workbench/resume/resume-search/resume-search.service';
import { jsonParse, cloneArray } from 'src/app/functions/functions';
import { ConfirmationComponent } from 'src/app/modules/shared/confirmation/confirmation.component';
import { WorkbenchService } from 'src/app/services/vendor-management/workbench/workbench.service';
import { Subscription } from 'rxjs';
import { ProfileSettingsService } from 'src/app/services/shared/profile-settings/profile-settings.service';
import { Router } from '@angular/router';
import { resume_manager_form_code } from '../workbench.component';
@Component({
  selector: 'app-resume-create',
  templateUrl: './resume-create.component.html',
  styleUrls: ['./resume-create.component.scss'],
  providers: [NotesService, ResumeSearchService]

})
export class ResumeCreateComponent implements OnInit, OnDestroy {


  @Input() current_tab;
  @Input() CellClicked;
  @Input() newTab;
  @Input() selected_requirement;
  @Input() openSideNavRef;
  @Input() navigateToBusiness;

  public refreshResumeRef: Function
  form_code = resume_manager_form_code || 2000;
  section_data;
  display_type;
  res_id;
  t_id;
  masters;
  files = [];
  resume_form: FormGroup;
  resume_form_new: FormGroup;
  parent_method;
  other_data: any = new Object();
  resume_file_path;
  requisition_list = [];
  duplicate_resume_grid;
  duplicate_resume_manager = {
    grid_details: null,
    data: []
  };
  requirement_details;

  resume_details;

  transaction_history = [];

  url: any;
  row_data: any = {};

  active = 0;
  req_id;

  notes_data;
  notes_count;
  access_rights: any
  subscription: Subscription
  is_new_tab;

  time_zone;

  requirement_form = new FormGroup({
    'req_id': new FormControl(null)
  });
  resume_file_form = new FormGroup({
    resume_file_document: new FormControl()
  })

  parsed_resume;

  @ViewChild('duplicate_manager', { static: true }) duplicate_manager: HTMLElement;
  negative_index: boolean = false;
  index_outofbound: boolean = false;

  callbackFuncRef;
  dataSavedRef;

  constructor(
    private workbench_tabsservice: WorkbenchTabsService,
    private change_detector: ChangeDetectorRef,
    private workbench_service: WorkbenchService,
    private resume_create_srv: ResumeCreateService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private resume_search_srv: ResumeSearchService,
    private notes_svc: NotesService,
    private notification_svc: NotificationService,
    private profile_svc: ProfileSettingsService,
    private router: Router,
    private workbench_tabs_srv: WorkbenchTabsService

  ) {
    this.resume_form = new FormGroup({});
    this.resume_form_new = new FormGroup({});
  }

  ngOnInit() {
    this.subscription = this.profile_svc.getAccessRightObj().subscribe(res => {

      if (res) {
        this.access_rights = this.profile_svc.access_rights;
      }
    })
    if (!this.access_rights) {
      let access = sessionStorage.getItem('access_rights');
      if (access != "undefined") {
        this.access_rights = JSON.parse(access);
        this.profile_svc.setaccess_right(sessionStorage.getItem('access_rights'));
      }
      if (access == "undefined" || access == "null") {
        // this.session_svc.logout();
      }
    }
    this.refreshResumeRef = this.getResumeDetails.bind(this);
    let data = this.workbench_tabsservice.getTabDetails(this.current_tab);
    if (data && data.data) {
      // this.tab_details = data.data.data;
      this.row_data = data.data;
      if (this.row_data && this.row_data.data) {
        console.log(this.row_data)

      }
      if (data.data.form) {
        this.resume_form = data.data.form;
      }
      if (data.data.data && data.data.data.requirement_id) {
        this.req_id = data.data.data.requirement_id;
      }
      if ((data.data.ResID || data.data.res_id)) {
        this.row_data = data.data
        this.t_id = data.data.ResID || data.data.res_id;
        this.other_data.id = (data.data.ResID || data.data.res_id);
      }

      if (data && data.data.data && data.data.data.form) {
        this.resume_form = data.data.data.form;
      }
      try {

        if (data && data.data && data.data.form_code) {
          this.form_code = data.data.form_code;
        }
        if (data && data.data && data.data.data) {
          this.form_code = data.data.form_code || 2000;

          this.section_data = data['data'].data.section_data;
          this.display_type = data.data.data.display_type;
          this.masters = data.data.data.masters;
          this.duplicate_resume_grid = data.data.data.duplicate_resume_grid;
          this.requirement_details = data.data.data.requirement_details
          this.resume_file_path = data.data.data.resume_file_path;
          this.resume_details = data.data.data.resume_details;
          this.requisition_list = data.data.data.requisition_list;
          this.is_new_tab = data.data.data.is_new_tab;
          this.transaction_history = data.data.data.transaction_history;
          this.negative_index = data.data.data.negative_index;
          this.index_outofbound = data.data.data.index_outofbound;
          if (data.data.data.row_data) {
            this.row_data = data.data.data.row_data
          }
          if ((data.data.data.ResID || data.data.data.res_id)) {
            this.t_id = data.data.data.ResID || data.data.data.res_id;
            this.other_data.id = (data.data.data.ResID || data.data.data.res_id);
          }
          if (data.data.data.requirement_id) {
            this.other_data.req_id = (data.data.data.requirement_id || data.data.data.requirement_id);
            this.requirement_form.setValue({ req_id: data.data.data.requirement_id || null });
          }
          this.notes_count = data.data.data.notes_count;
        }
        if (this.row_data && this.row_data.data && this.row_data.data['current_index'] == 0) {
          this.negative_index = true;
        }
        if (this.row_data && this.row_data.data && this.row_data.data['current_index'] >= (this.row_data.data['resume_list'] && this.row_data.data['resume_list'].length - 1)) {
          this.index_outofbound = true;
        }
      }
      catch (err) {
        console.log(err);
        this.t_id = 0;
        // this.other_data = 0;
        this.other_data.id = 0;
        // this.other_data.requirement_id = (data.data.requirement_id || data.data.requirement_id);
      }

      if (data && data.data.data && data.data.data.section_data) {
        // this.modules = this.all_data.masters.modules;
        this.section_data = data.data.data.section_data;
        this.display_type = data.data.data.display_type;
        this.masters = data.data.data.masters;
        checkActiveSection(this.section_data, this.display_type);
      }
      else {
        this.is_new_tab = this.t_id ? false : true;
        this.getResumeDetails();
        if (this.t_id)
          this.getNotes();
        this.change_detector.detectChanges();
      }
    }
    else {
      this.t_id = 0;
      this.other_data.id = 0;
      this.getResumeDetails();
      this.getNotes();
      // this.change_detector.detectChanges();
    }

    this.callbackFuncRef = this.callbackFunc.bind(this);
    this.dataSavedRef = this.dataSaved.bind(this);

    this.time_zone = new Date().getTimezoneOffset();
  }

  requirementChanged(ev) {
    this.other_data.req_id = this.requirement_form.get('req_id').value;
  }

  filesChanged(ev) {

  }

  parser(section) {
    for (let i = 0; i < section.length; i++) {
      if (section[i] && section[i].data && typeof section[i].data == 'string') {
        while (typeof section[i].data != 'object') {
          section[i].data = jsonParse(section[i].data);
          // section[i].data.forEach(){

          // }
          for (let j = 0; j < section[i].data.length; j++) {
            let section_data = jsonParse(section[i].data[j]);
            if (section[i].multiple && !(section_data.t_id || section_data.random_id)) {
              section_data.random_id = Math.floor(Date.now() + Math.random() * 1000);
            }
          }
        }
      }
      if (section[i] && section[i].sections && typeof section[i].sections == 'string') {
        while (typeof section[i].sections != 'object') {
          section[i].sections = jsonParse(section[i].sections);
          console.log(section);

          if (section[i] && section[i].sections) {
            this.parser(section[i].sections);
          }
        }
      }
    }
    return section;
    // else {
    //   return section;
    // }
  }


  ngOnDestroy() {

    this.workbench_tabsservice.updateTabDetails(this.current_tab, {
      data: {
        section_data: this.section_data,
        display_type: this.display_type,
        url: this.url,
        form_code: this.form_code,
        masters: this.masters,
        res_id: this.t_id,
        form: this.resume_form,
        t_id: this.t_id,
        other_data: this.other_data,
        resume_form: this.resume_form,
        duplicate_resume_grid: this.duplicate_resume_grid,
        resume_file_path: this.resume_file_path,
        requisition_list: this.requisition_list,
        resume_details: this.resume_details,
        requirement_id: this.other_data.req_id,
        requirement_details: this.requirement_details,
        is_new_tab: this.is_new_tab,
        transaction_history: this.transaction_history,
        row_data: this.row_data,
        notes_data: this.notes_data,
        notes_count: this.notes_count,
        negative_index: this.negative_index,
        index_outofbound: this.index_outofbound
      },
      form_code: this.form_code
    });
  }

  saveFileResult(event) {


  }


  getRequisitionList() {
    this.resume_search_srv.getRequirements(1).subscribe(res => {
      if (res && res['data'] && res['data']['list']) {
        this.requisition_list = res['data']['list'];

      }
    })
  }

  resumeChanged(current_index, flag) { //resume next and prev handler method
    if (this.row_data && this.row_data.data) {
      let index = this.row_data.data['current_index'];
      let resume_list = this.row_data.data.resume_list
      if (flag == 0) {
        this.index_outofbound = false;
        if (index > 0) {
          this.negative_index = false;
          this.row_data.data['current_index']--;
        }
        else {
          this.negative_index = true;
        }
        this.t_id = resume_list[this.row_data.data['current_index']];
        this.req_id = resume_list[this.row_data.data['requirements_id']];
        if (!this.negative_index) {
          this.getResumeDetails();
          if (this.row_data.data['current_index'] == 0)
            this.negative_index = true;
        }
      }
      else {
        this.negative_index = false;
        if (index < this.row_data.data['resume_list'].length - 1)
          this.row_data.data['current_index']++;
        else {
          this.index_outofbound = true;
        }
        this.t_id = resume_list[this.row_data.data['current_index']];
        this.req_id = resume_list[this.row_data.data['requirements_id']];
        if (!this.index_outofbound) {
          this.getResumeDetails();
          if (this.row_data.data['current_index'] > resume_list.length - 1) {
            this.index_outofbound = true;
          }
        }
      }
    }

  }

  tagResume() {
    try { // tagResume() callbackFunc from resume search pull
      this.row_data.data.tagResume(this.row_data.data.requirement_id, this.row_data.data.resume_list[this.row_data.data.current_index]);
      console.log(this.row_data.data.resume_list[this.row_data.data.current_index])
    }
    catch (err) {
      console.log(err)
    }

  }

  openRequirementTab(req) {
    console.log(req);
    if (req.is_team_member) {
      this.newTab(2, 1070, req);
    }
    else {
      this.notification_svc.snackbar("Sorry! This requirement is not assigned to you", "Close", 3000);
    }
  }

  getResumeDetails(set_data_flag?) {
    // this.resume_form = new FormGroup({});

    console.log(this.form_code)
    // if (this.current_candidate) {
    // if (!this.t_id) { this.t_id = this.current_candidate.res_id || this.current_candidate.ResID; }
    this.resume_create_srv.getResumeDetails({ form_code: this.form_code || 2000, resume_id: this.t_id || 0, req_id: this.req_id || 0 }).subscribe(res => {
      if (!res['status']) {
        this.notification_svc.snackbar(res['message'], "Close", 3000);
        this.workbench_tabsservice.removeTab(this.current_tab);
      }
      if (res && res['data'] && Object.keys(res['data']) && Object.keys(res['data']).length) {
        // this.resume_form = new FormGroup({});
        this.resume_file_path = this.parser(res['data']).file_path;
        this.resume_details = res['data'].candidate_details;
        console.log(this.resume_details.name)
        if (this.resume_details.name != ('' || ' ' || null)) {
          this.workbench_tabsservice.updateTabTitle(this.current_tab, this.resume_details['name'] || 'Create Resume');
        }
        else {
          this.workbench_tabsservice.updateTabTitle(this.current_tab, "Create Resume");
        }
        this.requirement_details = res['data'].req_details[0];
        if (this.requirement_details) {
          this.req_id = this.requirement_details.req_id;
          this.other_data.req_id = this.req_id;
        }

        this.transaction_history = res['data'].transaction_history;
        console.log(this.transaction_history);

        // this.duplicate_resume_grid = res['data'];

        if (!set_data_flag) {
          if (res && res['data'] && res['data'].details && res['data'].details.length) {
            this.section_data = this.parser(res['data'].details)[0].sections || [];
            this.display_type = this.parser(res['data'].details)[0].display_type_id;
            // this.is_new_tab = this.t_id;
            let virtual_scroll_fields = {}
            prepareSections(this.section_data, this.resume_form, this.section_data, this.t_id, this.fb, this.display_type, virtual_scroll_fields);
            // console.log(virtual_scroll_fields);
            let master_obj = [];
            for (let i = 0; i < Object.keys(virtual_scroll_fields).length; i++) {
              let obj = {}
              let master_id = Object.keys(virtual_scroll_fields)[i];
              obj['master_id'] = master_id;
              obj['values'] = virtual_scroll_fields[master_id];
              master_obj.push(obj)
            }
            checkActiveSection(this.section_data, this.display_type);
            this.workbench_service.getFormMaster(master_obj, { form_code: this.form_code || 2000, t_id: 0, template_code: 0 }).subscribe(masters => {
              if (masters && masters['data'])
                this.masters = masters['data'].masters;
              // if (!this.t_id)
              //   this.getRequisitionList();
              // this.change_detector.detectChanges();
            });
            console.log(this.section_data);
          }


        }

        else if (this.parsed_resume) {
          this.prepareSectionParsedData(this.parser(res['data'].details)[0].sections, this.resume_form, this.section_data, this.parsed_resume, this.resume_form);
          checkActiveSection(this.section_data, this.display_type);
          console.log(this.section_data);

          this.change_detector.detectChanges();
        }

        else {
          prepareSectionData(this.parser(res['data'].details)[0].sections, this.resume_form, this.section_data);
          checkActiveSection(this.section_data, this.display_type);
          console.log(this.section_data);
        }
        // if (!this.t_id) {
        //   if (this.section_data)
        //     this.enableSave(this.section_data[0]);
        // }
      }
      console.log(set_data_flag)


      // if (!set_data_flag) {

      // }

      this.change_detector.detectChanges();
    })
  }

  saveData() {


    this.resume_create_srv.saveResumeDetails(this.resume_form.value, this.t_id).subscribe(res => {
      if (res) {


      }
    })

  }

  dataSaved(id, response?, last_step_flag?) {
    console.log(id, response, last_step_flag)
    this.other_data.id = id;
    this.t_id = id;
    if (id) {
      this.getResumeDetails(!last_step_flag);
      if (last_step_flag) {
        this.is_new_tab = false;
      }
    }
    if (response && response['data'] && jsonParse(response['data'])) {
      this.duplicate_resume_grid = jsonParse(response['data']);
    }
  }

  parseResume(ev) {
    console.log(this.resume_form);
    if (this.resume_form.dirty || this.t_id) {
      const dialogConfig = new MatDialogConfig()
      dialogConfig.width = "25%";
      dialogConfig.data = {
        title: "Confirmation",
        message: "Existing data will be replaced by the data parsed from resume document. Are you sure ?",
        positive_button: "Proceed",
        negative_button: "Cancel"
      };
      let ref = this.dialog.open(ConfirmationComponent, dialogConfig);


      ref.afterClosed().subscribe(res => {
        if (res) {
          if (ev) {
            this.parseResumeDocument(ev);
          }
        }
      })
    }
    else {
      this.parseResumeDocument(ev);
    }
  }

  parseResumeDocument(ev) {
    this.resume_create_srv.parseResumeDetails({ resume_document: ev }, this.form_code, this.req_id || 0).subscribe(res => {

      if (res && res['data'] && res['data'].details && res['data'].details[0] && res['data'].details[0].sections) {
        this.parsed_resume = this.parser(res['data'].details)[0].sections;
        this.prepareSectionParsedData(this.parser(res['data'].details)[0].sections, this.resume_form, this.section_data, this.parsed_resume, this.resume_form);
        checkActiveSection(this.section_data, this.display_type);
        console.log(this.section_data);
        this.change_detector.detectChanges();

        try {
          if (res['data'].duplicate_details && Object.keys(res['data'].duplicate_details) && Object.keys(res['data'].duplicate_details).length) {
            this.duplicate_resume_grid = jsonParse(res['data'].duplicate_details);
            this.notification_svc.snackbar("Resume already exists", "Close", 3000);
          }
        }
        catch (err) {

        }
      }
    })
  }

  prepareSectionParsedData(sections, form, section_data, parsed_resume?, parent_form?) {
    sections = jsonParse(sections);
    if (sections && typeof sections == 'object') {
      for (let ind = 0; ind < sections.length; ind++) {
        console.log(parsed_resume, ind);
        if (parsed_resume && parsed_resume[ind] && parsed_resume[ind].data && section_data[ind].active_section) {
          sections[ind].data = cloneArray(jsonParse(parsed_resume[ind].data));
          // parsed_resume[ind].data = null;
        }
        else {
          sections[ind].data = jsonParse(sections[ind].data);
        }

        section_data[ind].data = jsonParse(sections[ind].data);

        if (sections[ind].data && !sections[ind].multiple) {
          if (sections[ind].data[0]) {
            if (sections[ind].field_details && typeof sections[ind].field_details == 'object' && sections[ind].field_details.length) {
              let fields = sections[ind].field_details;
              if (fields) {
                fields.forEach(field => {
                  if (field.control_type_id == 8) {
                    console.log(sections[ind].data[0][field.field_name]);
                    sections[ind].data[0][field.field_name] = jsonParse(sections[ind].data[0][field.field_name]);
                  }
                });
              }
            }
            if (form) {
              let section_form = form.get([sections[ind].section_id]);
              section_form.patchValue(sections[ind].data[0]);
            }
          }
        }
        else if (sections[ind].multiple) {
          console.log(parent_form.get([sections[ind].section_id]).value);
          parent_form.get([sections[ind].section_id]).patchValue(sections[ind].data);
        }

        if (parsed_resume && parsed_resume[ind] && parsed_resume[ind].data && section_data[ind].active_section) {
          parsed_resume[ind].data = null;
        }
        // form.addControl(sections[ind].section_id, section_form);

        if (section_data[ind].grid_layout) {
          section_data[ind].grid_layout = jsonParse(sections[ind].grid_layout);
        }

        sections[ind].sections = jsonParse(sections[ind].sections);
        if (sections[ind].sections && sections[ind].sections.length) {
          try {
            if (sections[ind].multiple) {
              this.prepareSectionParsedData(sections[ind].sections, sections[ind].multiple_form, section_data[ind].sections, parsed_resume[ind].sections, form.get([sections[ind].section_id]));
            }
            else {
              this.prepareSectionParsedData(sections[ind].sections, form.get([sections[ind].section_id]), section_data[ind].sections, parsed_resume[ind].sections, form.get([sections[ind].section_id]));

            }
          }
          catch (err) {
            console.log(err);
          }
        }
      }
    }
  }

  cellClicked(ev) {
    if (ev && ev.func) {
      this[ev.func](ev);
    }
  }

  openResume(ev?) {
    console.log(ev);

    try {
      if (ev) {
        this.newTab(3, 2000, ev.data);
      }
      else {
        this.newTab(3, 3, this.row_data.data);
      }
    }
    catch (err) {

    }
  }
  openMailer(data?) {
    console.log(this.row_data.data);

    // if (this.row_data && this.row_data.data && this.row_data.data.from == 'search') {
    //   this.newTab(5, 2, [this.row_data.data])
    // }

    if (this.row_data && this.row_data.data && this.row_data.data.res_id) {
      if (this.requirement_details && this.requirement_details.req_res_id) {
        this.newTab(5, 1, [this.row_data.data])
      }
      else {
        this.newTab(5, 2, [this.row_data.data])
      }
    }
    else {
      if (this.t_id) {
        let obj = {
          res_id: this.t_id
        }
        this.newTab(5, 2, [obj])
      }
    }
  }
  openTaskManager() {
    const dialogConfig = new MatDialogConfig
    dialogConfig.maxWidth = '30%';
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      event: null,
      start_date: null,
      res_id: this.row_data && (this.row_data.res_id || this.row_data.data && this.row_data.data.res_id) || 0

    }
    // dialogConfig.panelClass="custom-dialog-container"
    // this.dialog.open(EventPopupComponent, dialogConfig).afterClosed().subscribe(res => {
    //   if (res && res['res_id']) {
    //     let id = this.workbench_tabs_srv.addTab(res.candidate_name, 3, res, 1);
    //     this.router.navigate(['/workbench'])
    //     this.change_detector.detectChanges()
    //   }
    //   else if (res && res['requirement_id']) {
    //     let id = this.workbench_tabs_srv.addTab(res.requirement_name, 2, res, 1);
    //     this.router.navigate(['/workbench'])
    //     this.change_detector.detectChanges()
    //   }
    //   // this.getTaskList()
    //   // this.onMonthChangeOnFullCall()

    // })
  }

  openInterviewManager() {
    this.newTab(7, null, [this.row_data.data])
  }

  openOfferManager() {
    this.newTab(8, null, [this.row_data.data]);
  }

  overWrite(ev) {

  }

  checkActiveSection(sections) {
    let found_selected_index = 0;
    sections = jsonParse(sections);
    if (sections)
      for (let ind = 0; ind < sections.length; ind++) {
        if (sections[ind].active_section) {
          if (this.display_type == 3) {
            // this.setStepperIndex(ind);
          }
          else {
            this.setActiveSection(ind);
          }
          found_selected_index = 1;
        }
      }

    if (!found_selected_index) {
      if (this.display_type == 3) {
        // this.setStepperIndex(0);
      }
      this.section_data[0].active_section = 1;
    }
  }

  getNotes() {
    this.notes_svc.getResNotes({ id: this.t_id }).subscribe(data => {
      try {
        if (data && data['data']) {
          this.notes_data = jsonParse(data['data']);
          this.notes_count = this.notes_data.length ? this.notes_data.length : 0;
        }
      }
      catch (err) {

      }
    }, err => {

    })
  }

  openNotesModal() {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.width = "50%";
    let ref = this.dialog.open(ResumeNotesComponent, dialogConfig);
    (ref.componentInstance).notes = {
      res_id: this.t_id,
      notes_data: this.notes_data || []
    }
    ref.afterClosed().subscribe(res => {
      if (res) {
        this.notes_data = res;
        this.notes_count = res.length ? res.length : 0;
      }

    })
  }

  callbackFunc(func, ev) {
    console.log(func);
    eval('this.' + func);
  }


  // dynamic forms implementation

  setSectionVerticleNavbar(i, form) {
    this.setActiveSection(i);
  }

  setActiveSection(ind) {
    setActiveSection(ind, this.section_data)
  }

  enableSave(section) {
    enableSave(section);
  }

  cancel(section) {
    cancel(section, this.resume_form, this.t_id)
  }

  updateApplicantStatus() {
    this.openSideNavRef(
      {
        data: {
          requirement_id: this.requirement_details.req_id,
          req_res_id: this.requirement_details.req_res_id
        }
      }, 0, 0, this.refreshResumeRef, -1
    );
  }

  updateResumeManager(transaction) {
    console.log(transaction);
    this.req_id = transaction.requirement_id;
    this.other_data.req_id = this.req_id;
    this.getResumeDetails();
  }

  // moveApplicant() {
  //   if (this.row_data && this.row_data.data) {
  //     const matDialogConfig = new MatDialogConfig()
  //     matDialogConfig.minWidth = "50%";
  //     matDialogConfig.width = "50%";

  //     const dialog = this.dialog.open(ApplicantsMoveTagComponent, matDialogConfig);

  //     (dialog.componentInstance).selected_entries = [this.row_data.data];
  //   }
  // }

}
export function parser(section) {
  for (let i = 0; i < section.length; i++) {
    if (section[i] && section[i].data && typeof section[i].data == 'string') {
      while (typeof section[i].data != 'object') {
        section[i].data = jsonParse(section[i].data);
        // section[i].data.forEach(){

        // }
        for (let j = 0; j < section[i].data.length; j++) {
          let section_data = jsonParse(section[i].data[j]);
          if (section[i].multiple && !(section_data.t_id || section_data.random_id)) {
            section_data.random_id = Math.floor(Date.now() + Math.random() * 1000);
          }
        }
      }
    }
    if (section[i] && section[i].sections && typeof section[i].sections == 'string') {
      while (typeof section[i].sections != 'object') {
        section[i].sections = jsonParse(section[i].sections);
        console.log(section);

        if (section[i] && section[i].sections) {
          this.parser(section[i].sections);
        }
      }
    }
  }
  return section;
  // else {
  //   return section;
  // }
}