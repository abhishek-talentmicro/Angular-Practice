import { Component, OnInit, enableProdMode, ViewChild, ChangeDetectorRef, OnChanges, OnDestroy, AfterViewInit, ElementRef, PipeTransform, Pipe, Input, Output, EventEmitter } from '@angular/core';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/services/shared/notification/notification.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { FilterDetails } from '../../../../classes/shared/resume-filter/filter';
import { DynamicSaveService } from 'src/app/controls/services/Dynamic-Save/dynamic-save.service';
import { DynamicModalComponent } from '.././dynamic-modal/dynamic-modal.component';
import { RequirementFilterComponent } from '.././requirement-filter/requirement-filter.component';
import { ApplicantFilterOnspotComponent } from '.././applicant-filter-onspot/applicant-filter-onspot.component';
import { RequirementFilterOnspotComponent } from '.././requirement-filter-onspot/requirement-filter-onspot.component';
import { ApplicantAttachmentsComponent } from '.././applicant-attachments/applicant-attachments.component';
import { Subscription } from 'rxjs';
import { ProfileSettingsService } from 'src/app/services/shared/profile-settings/profile-settings.service';
import { SessionService } from 'src/app/modules/login/services/session/session.service';
import { take } from 'rxjs/operators';
import { RequirementRequest, ApplicantRequest, resume_manager_form_code } from '../workbench.component';
import { ViewAssessmentsComponent } from 'src/app/controls/components/assessment/view-assessments/view-assessments.component';
import { WorkbenchService } from 'src/app/services/vendor-management/workbench/workbench.service';
import { ExportExcelService } from 'src/app/services/shared/export-excel/export-excel.service';
import { WorkbenchTabsService } from 'src/app/services/vendor-management/workbench-tabs/workbench-tabs.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DashboardNavigationService } from 'src/app/services/shared/dashboard-navigation/dashboard-navigation.service';
import { setExportKeys } from 'src/app/classes/workbench/applicant-attachments/applicant-attachments';
import { jsonParse, cloneArray } from 'src/app/functions/functions';
import { ExportConfirmationComponent } from 'src/app/modules/shared/export-confirmation/export-confirmation.component';


@Component({
  selector: 'app-workbench-home',
  templateUrl: './workbench-home.component.html',
  styleUrls: ['./workbench-home.component.scss'],
  providers: [
    WorkbenchService,
    DynamicSaveService,
    ExportExcelService
  ],
  styles: []
})
export class WorkbenchHomeComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  public search1;
  requirement_list = [];
  keyword: string;
  status_id: any[];
  statuses = [];
  data_headers: any[];
  is_collapsed: boolean = false;
  is_collapsed1: boolean = false;
  filter_details = new FilterDetails();
  filter_form: FormGroup;
  req_id: any[];
  masters = [];
  applicant_list = [];
  req_ids = [];
  applicant_name;
  requirement_ids;
  selected_applicant_search = []
  applicant_obj: any = {}
  selected_requirement_search = []
  req_obj: any = {}
  export_btn: boolean = false;
  export_btn_req: boolean = false;

  // sort = new TallintTableColumnSort();
  // checkedTableEntries: TableCheckedValues = new TableCheckedValues();
  // @ViewChild("sideNav", { static: false }) sideNav: MatDrawer;
  // @ViewChild("sideNav1", { static: false }) sideNav1: MatDrawer;
  @ViewChild('filterIcon', { static: false }) filterIcon: ElementRef;
  @ViewChild('filterIcon1', { static: false }) filterIcon1: ElementRef;
  // @ViewChild("tabset", {static: false}) tabset: NgbTabset;
  @ViewChild("search_applicant", { static: false }) search_applicant: ElementRef;
  @ViewChild("search_requirement", { static: false }) search_requirement: ElementRef;
  @ViewChild("applicant_view_table", { static: false }) applicant_view_table;
  @ViewChild("requirement_view_table", { static: false }) requirement_view_table;

  @Input() tabset;
  // stage_status: FormGroup;
  stage;
  reasons;
  notes;
  status = [];
  reqreason;
  form_applicant: FormGroup
  form_requirement: FormGroup

  requirement_view: RequirementView = new RequirementView();
  applicant_view: ApplicantView = new ApplicantView();
  @Input() requirement_request: RequirementRequest;
  @Input() applicant_request: ApplicantRequest;
  Object = Object;
  requirement_tabs = ['Requirements'];
  applicant_tabs = ['Applicants'];
  selected = new FormControl(0);
  selected_requirements = [];
  selected_applicants = [];

  @Input() workbench_tabs;
  @Input() current_tab;
  @Input() open_status;
  @Input() showActivity;
  @Input() callApplicantsAPICall;
  @Input() callGetRequirements;
  @Input() applicant_view_data;
  @Input() requirement_view_data;
  @Input() default_applicant_filter;
  @Input() default_requirement_filter;
  @Input() requirement_view_list;
  @Input() req_list
  @Input() app_list;
  @Input() newTabCall;
  @Input() func_callback;
  @Input() enable_summary;
  @Output() updateWorkbenchValues = new EventEmitter();

  section_data;
  form_code;
  display_type;
  master;
  workbench_details: FormGroup;
  applicant_search_form: FormGroup;
  requirement_search_form: FormGroup;
  url;
  applicant_form_code;
  current_candidate;
  loading = false;
  disable = false;
  activity_history: any;
  template_style = {  //for filter input
    'border': 'none',
    'background': 'transparent',
    'height': '20px',
    'color': 'white',
    'width': 'calc(100% - 28px)',
  }
  search_style = {  //for filter input
    'border': 'none',
    'background': 'transparent',
    'height': '20px',
    'color': 'white',
    'width': 'calc(100% - 28px)',
  }
  search: any
  req_search: any;
  export_data_list = [];
  export_data_count: any;
  export_ready: boolean = false;
  export_data_count_req: any;
  export_data_list_req: any = [];
  export_ready_req: boolean = false;
  can_update: boolean = false;

  applicant_view_list: any;
  access_rights: any
  subscription: Subscription
  on_table_click: any;

  dashboard_obj = new Object();
  startPage =1;
  backend_take = 20;
  skip =0;
  start;
  startPageApp =1;
  skip_app =0;
  start_app;
  constructor(
    private WBService: WorkbenchService,
    private change_detector: ChangeDetectorRef,
    private notification: NotificationService,
    private workbench_tabservice: WorkbenchTabsService,
    private dialog: MatDialog,
    private profile_svc: ProfileSettingsService,
    private dashboard_routing_srv: DashboardNavigationService,
    private profile_settings_srv: ProfileSettingsService,
    private session_svc: SessionService,
    private export_excel_srv: ExportExcelService
    // private dynamic_svc: DynamicSaveService,
  ) {

    this.subscription = this.profile_svc.getAccessRightObj().subscribe(res => {

      if (res) {
        this.access_rights = this.profile_svc.access_rights
      }
    })
    if (!this.access_rights) {
      let access = sessionStorage.getItem('access_rights');
      if (access != "undefined") {
        this.access_rights = JSON.parse(access);
        this.profile_svc.setaccess_right(sessionStorage.getItem('access_rights'));
      }
      if (access == "undefined" || access == "null") {
        this.session_svc.logout();
      }
    }
    this.workbench_details = new FormGroup({
    });
    this.applicant_search_form = new FormGroup({
      search: new FormControl()
    })
    this.requirement_search_form = new FormGroup({
      search: new FormControl()
    })
    this.form_requirement = new FormGroup({
      search: new FormControl('')
    })
    this.form_applicant = new FormGroup({
      search: new FormControl('')
    })
    // this.getRequirements(null);
    // this.getApplicantList(null);
    // this.data_headers = ['req_res_id', 'job_code', 'job_title', 'contact_id', 'name', 'applicant_id', 'total_exp', 'notes', 'notice_period', 'passport_no', 'status_title']
  }

  ngOnInit() {
    // this.workbench_tabservice.getWorkbenchTabs().subscribe(res => {
    //   this.workbench_tabs = res;
    //   let i = (Object.keys(this.workbench_tabs).length) - 1;
    //   let key = Object.keys(this.workbench_tabs)[i]
    //   this.current_tab = (key);
    // })
    this.profile_settings_srv.default_filter_change.subscribe(res => {

      if (res && Object.keys(res).length > 0) {
        this.form_requirement.get('search').patchValue(res['def_req_filter_id']);
        this.form_applicant.get('search').patchValue(res['def_app_filter_id']);
      }
    })


    this.init();
    // this.getStageStatus();
    let data = this.workbench_tabservice.getTabDetails((this.current_tab))

    this.dashboard_obj = this.dashboard_routing_srv.getStaticCode();

    if (data && data.data) {

      try {
        this.display_type = data.data.display_type;
        this.selected_applicant_search = data.data.selected_applicant_search || [];
        this.selected_requirement_search = data.data.selected_requirement_search || [];
        this.master = data.data.master;
        this.requirement_view_list = data.data.requirement_view_list;
        this.applicant_form_code = data.data.applicant_form_code;
        this.requirement_view_data = data.data.requirement_view_data;
        if (data.data.applicant_search_form && data.data.applicant_search_form['value']) {
          this.applicant_search_form.setValue((data.data.applicant_search_form)['value']);
        }
        if (data.data.requirement_search_form && data.data.requirement_search_form['value']) {
          this.requirement_search_form.setValue(data.data.requirement_search_form['value']);
        }
        this.applicant_view_list = data.data.applicant_view_list;
        if (data.data.form_applicant && data.data.form_applicant['value']) {
          this.form_applicant.patchValue(data.data.form_applicant['value']);
        }
        if (data.data.form_requirement && data.data.form_requirement['value']) {
          this.form_requirement.patchValue(data.data.form_requirement['value']);
        }
        this.requirement_request = data.data.requirement_request;
        this.applicant_request = data.data.applicant_request;
        this.skip = data.data.skip;
        this.backend_take = data.data.backend_take;
        this.startPage = data.data.startPage;
        this.start = data.data.start;
        this.skip_app = data.data.skip_app;
        this.startPageApp = data.data.startPageApp;
        this.start_app = data.data.start_app;
        if (data.data.access_rights) {
          this.access_rights = data.data.access_rights;
        }
        this.updateWorkbenchValues.emit({ requirement_request: this.requirement_request, applicant_request: this.applicant_request, applicant_view: this.applicant_view_data, requirement_view: this.requirement_view_data });
        this.checkDashboardFlag();
      } catch (err) {

      }
    }
    else {
      this.checkDashboardFlag();
    }

  }

  checkDashboardFlag() {
    let request = {};
    let req_request = {};
    if (this.dashboard_obj['dashboard_flag']) {
      this.workbench_tabservice.setActiveTab();
      this.applicant_view = new ApplicantView();
      this.requirement_view = new RequirementView();
    }
    let obj = this.dashboard_obj;

    if (obj && obj['dashboard_applicant_flag'] == true) {
      // this.profile_settings_srv.setDefaultFilter({
      //   def_app_filter_id: null,
      //   def_req_filter_id: 0
      // })
      // this.applicant_request.resetAll();
      this.startPageApp =1;
      this.resetSelectedRequirements();
      this.resetSelectedApplicants();

      if (obj['code']) {
        this.profile_settings_srv.setDefaultFilter({
          def_app_filter_id: null,
          def_req_filter_id: 0
        });
      }
      else {
        this.applicant_request.resetAll();
        this.applicant_request.filter_template_ids = [this.profile_settings_srv.def_app_filter_id];
        this.applicant_request.lock_filter_template = 0;
        this.form_applicant.get('search').patchValue(this.profile_settings_srv.def_app_filter_id);
      }
      this.applicant_request.setDashboardData(obj);


      this.getApplicantList(this.applicant_request.getApplicantRequestObject());
    }
    else {
      this.profile_settings_srv.default_filter_change.pipe(take(2)).subscribe(res => {

        if (res && Object.keys(res).length > 0) {
          this.applicant_request.flag = 0;
          this.applicant_request.flag = 0;
          // this.applicant_request.skip = 0;
          this.applicant_request.take =20;
          if (res['def_app_filter_id'])
            this.applicant_request.filter_template_ids = [res['def_app_filter_id']];
          else
            this.applicant_request.filter_template_ids = [];
          // this.form_requirement.get('search').patchValue(res['def_req_filter_id']);
          this.form_applicant.get('search').patchValue(res['def_app_filter_id']);
          this.getApplicantList(this.applicant_request.getApplicantRequestObject());
          // this.getRequirements(req_request);
        }
      })
    }
    if (obj && obj['dashboard_requirement_flag'] == true) {
      this.profile_settings_srv.setDefaultFilter({
        def_app_filter_id: 0,
        def_req_filter_id: null
      })
      // this.requirement_request = new RequirementRequest();


      if (obj['code']) {
        // this.profile_settings_srv.setDefaultFilter({
        //   def_app_filter_id: 0,
        //   def_req_filter_id: null
        // })
      }
      else {
        this.requirement_request.resetAll();
        this.requirement_request.filter_template_ids = [this.profile_settings_srv.def_req_filter_id];
        this.form_requirement.get('search').patchValue(this.profile_settings_srv.def_req_filter_id);
      }

      this.requirement_request.code = obj['code'];
      this.requirement_request['team_flag'] = obj['team_flag'];
      this.requirement_request.flag = 0;
      this.requirement_request.skip = 0;
       this.applicant_request.take =20;
      this.requirement_request.lock_filter_template = 0;
      this.requirement_request.filter_template_ids = [];

      // this.resetSelectedRequirements();
      this.getRequirements(this.requirement_request.getRequirementRequestObject());
    }
    else {
      let subscription = this.profile_settings_srv.default_filter_change.pipe(take(2)).subscribe(res => {
        this.requirement_request.flag = 0;
        // this.requirement_request.skip = 0;
        this.applicant_request.take =20;
        if (res && Object.keys(res).length > 0) {
          if (res['def_req_filter_id'])
            this.requirement_request.filter_template_ids = [res['def_req_filter_id']];
          else
            this.requirement_request.filter_template_ids = [];
          this.requirement_request.code = null;
          this.form_requirement.get('search').patchValue(res['def_req_filter_id']);
          this.getRequirements(this.requirement_request.getRequirementRequestObject());
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.applicant_view_data)
      this.applicant_view_data.wb_root_flag = false;
    if (this.requirement_view_data)
      this.requirement_view_data.wb_root_flag = false;

    this.workbench_tabservice.updateTabDetails(this.current_tab, {
      requirement_view: this.requirement_view,
      applicant_view: this.applicant_view,
      section_data: this.section_data,
      display_type: this.display_type,
      master: this.master,
      requirement_view_list: this.requirement_view_list,
      url: this.url,
      applicant_form_code: 1016,
      applicant_search_form: this.applicant_search_form,
      requirement_search_form: this.requirement_search_form,
      applicant_view_list: this.applicant_view_list,
      form_requirement: this.form_requirement,
      form_applicant: this.form_applicant,
      requirement_request: this.requirement_request,
      applicant_request: this.applicant_request,
      selected_applicant_search: this.selected_applicant_search || [],
      selected_requirement_search: this.selected_requirement_search || [],
      access_rights: this.access_rights,
      applicant_view_data: this.applicant_view_data,
      requirement_ids: this.requirement_ids,
      requirement_view_data: this.requirement_view_data,
      skip:this.skip,
      startPage:this.startPage,
      backend_take:this.backend_take,
      start:this.start,
      skip_app:this.skip_app,
      startPageApp:this.startPageApp,
      start_app:this.start_app
    });

  }

  get filter() { return this.workbench_details.get('sections') as FormArray }
  filterSave() {
    this.loading = true;
    this.disable = true;

    // let obj = { filter_template: this.multiSectionDataSave(this.section_data, this.workbench_details) }

    // this.dynamic_svc.apiCall('post', environment.SERVER_URL + 'Client/ClientData?template_code=1016&lng_id=1', obj).subscribe(resData => {
    this.loading = false;
    this.disable = false;
    // })
  }

  // loadApplicantSearchForm() {

  // }

  // multiSectionDataSave(section_data, form_group) {
  //   for (let i = 0; i < section_data.length; i++) {
  //     section_data[i].data = form_group.get('sections').value;
  //     if (section_data[i].sections && section_data[i].sections.length) {
  //       for (let j = 0; j < (form_group.get('sections').controls).length; j++) {
  //         this.multiSectionDataSave(section_data[i].sections, form_group.get('sections').controls[j])
  //       }
  //     }
  //   }
  //   return section_data;
  // }


  applicantSearchClk() {
    // this.applicant_request.resetAll();
    if (this.search) {
      this.applicant_obj['field_name'] = this.applicant_search_form.value.search
      this.applicant_obj['value'] = this.search
      this.selected_applicant_search.push(this.applicant_obj)
      this.search = ""
      this.applicant_obj = {}
    }
    if (this.selected_applicant_search.length == 0 && this.applicant_obj.field_name && this.search) {
      this.applicant_obj['value'] = this.search
      this.selected_applicant_search.push(this.applicant_obj)
      this.applicant_obj = {}
      this.search = ''
      this.applicant_obj['field_name'] = this.selected_applicant_search[this.selected_applicant_search.length - 1].field_name

    }
    this.applicant_request.search_filter = this.selected_applicant_search || [];
    this.applicantsAPICall(this.applicant_request.getApplicantRequestObject())
  }

  requirementSearchClk() {
    // this.requirement_request.resetAll();
    this.requirement_request.skip = 0;
    try {
      if (this.req_search) {
        this.req_obj['field_name'] = this.requirement_search_form.value.search
        this.req_obj['value'] = this.req_search
        this.selected_requirement_search.push(this.req_obj)
        this.req_search = ""
        this.req_obj = {}
      }

      if (this.selected_requirement_search.length == 0 && this.req_obj.field_name && this.req_search) {
        this.req_obj['value'] = this.req_search
        this.selected_requirement_search.push(this.req_obj)
        this.req_obj = {}
        this.req_search = ''
        this.req_obj['field_name'] = this.selected_requirement_search[this.selected_requirement_search.length - 1].field_name

      }
      this.requirement_request.search_filter = this.selected_requirement_search || [];
      this.getRequirements(this.requirement_request.getRequirementRequestObject())
    }
    catch (err) {

    }
  }

  searchFocus(ele, e) {



    if (ele == 2) {
      this.search_applicant.nativeElement.focus()
      if (!e) {
        this.applicant_search_form.patchValue({ 'search': 'any' })
      }
    } else {
      if (!e) {
        this.requirement_search_form.patchValue({ 'search': 'any' })
      }
      this.search_requirement.nativeElement.focus()
    }


  }

  applicantSearchEtr(obj?) {

    if (this.search) {
      this.applicant_obj['field_name'] = this.applicant_search_form.value.search
      this.applicant_obj['value'] = this.search
      this.selected_applicant_search.push(this.applicant_obj)
      this.search = ""
      this.applicant_obj = {}
      this.applicantSearchClk()
    }


  }
  requirementSearchEtr(obj?) {
    if (this.req_search) {
      this.req_obj['field_name'] = this.requirement_search_form.value.search
      this.req_obj['value'] = this.req_search
      this.selected_requirement_search.push(this.req_obj)
      this.req_search = ""
      this.req_obj = {}
      this.requirementSearchClk()
    }
  }

  dataPatcher(formGroup) {

  }

  applicantCellClicked(ev) {

    try {
      if (ev.func)
        // this[ev.func];
        if (ev.func.indexOf('(') > -1)
          eval('this.' + ev.func)
        else
          this[ev.func](ev);
    }
    catch (err) {

      try {

        this[ev.func](ev);
      }
      catch (err) {


      }
    }
  }

  init() {
    this.requirement_view = new RequirementView();
    this.applicant_view = new ApplicantView();

    // this.stage_status = new FormGroup({
    //   status_code: new FormControl([], Validators.required),
    //   stage_code: new FormControl([], Validators.required),
    //   reason_ids: new FormControl(null),
    //   notes: new FormControl(null),
    //   transaction_type: new FormControl(null),
    //   tn_id: new FormControl(null),
    //   multiple_flag: new FormControl(null),
    //   req_res_ids: new FormControl(null),
    //   req_res_id: new FormControl(null)
    // })
    // this.filter_form = new FormGroup(
    //   {
    //     skills: new FormControl([]),
    //     education: new FormControl([]),
    //     designation: new FormControl([]),
    //     location: new FormControl([]),
    //     experience_from: new FormControl(null),
    //     experience_to: new FormControl(null),
    //     notice_period_from: new FormControl(null),
    //     notice_period_to: new FormControl(null),
    //     currency: new FormControl(0),
    //     duration: new FormControl(0),
    //     scale: new FormControl(0),
    //     ctc_from: new FormControl(null),
    //     ctc_to: new FormControl(null),
    //     keywords: new FormControl(''),
    //     skill_and: new FormControl(0),
    //     location_and: new FormControl(0),
    //     designation_and: new FormControl(0),
    //     education_and: new FormControl(0),
    //     notice_period_and: new FormControl(0),
    //     experience_and: new FormControl(0),
    //     ctc_and: new FormControl(0),
    //     keywords_and: new FormControl(0),
    //   });
  }


  ngOnChanges(ev) {

    if (ev.req_list && ev.req_list.currentValue && ev.req_list.currentValue.length > 0) {
      let copyReqArray
      copyReqArray = ev.req_list.currentValue;

      this.requirement_view_list = []
      for (let i = 0; i < copyReqArray.length; i++) {
        if (copyReqArray[i].is_search_filter == 1) {
          this.requirement_view_list.push(copyReqArray[i])
        }
      }
      // if (!this.change_detector['destroyed'])
      //   this.change_detector.detectChanges()
      if (!this.requirement_search_form.value.search) {
        this.requirement_search_form.patchValue({ 'search': "any" })
      }
    }
    if (ev.app_list && ev.app_list.currentValue && ev.app_list.currentValue.length > 0) {
      let copyAppArray
      copyAppArray = ev.app_list.currentValue
      this.applicant_view_list = []
      for (let i = 0; i < copyAppArray.length; i++) {
        if (copyAppArray[i].is_search_filter == 1) {
          this.applicant_view_list.push(copyAppArray[i])
        }
      }
      if (!this.applicant_search_form.value.search) {
        this.applicant_search_form.patchValue({ 'search': "any" })
      }
    }
    // if (ev.requirement_view_data && ev.requirement_view_data.currentValue) {
    //   this.requirement_view_data = ev.requirement_view_data.currentValue
    //   // this.form_requirement.get('search').patchValue(this.requirement_view_data.selected_filter);

    //   this.change_detector.detectChanges()
    // }
    // this.form_requirement.get('search').patchValue(this.requirement_view_data.selected_filter);
    // this.form_applicant.get('search').patchValue(this.applicant_view_data.selected_filter);
    // if (!this.change_detector['destroyed'])
    this.change_detector.detectChanges();
  }

  ngAfterViewInit() {
    // if (this.export_btn) {
    //   if (this.applicant_view_table) {
    //     this.applicant_view_table.exportDataToExcel();
    //   }
    // }
    // if (!this.export_btn && this.export_ready) {
    //   if (this.applicant_view_table) {
    //     this.applicant_view_table.exportToExcelParent();
    //     // this.export_ready = false;
    //     // this.export_btn = false;
    //     this.export_data_list = [];


    //   }
    // }
    // if (this.export_btn_req) {
    //   if (this.requirement_view_table) {
    //     this.requirement_view_table.exportDataToExcel()
    //   }
    // }
    // if (!this.export_btn_req && this.export_ready_req) {
    //   if (this.requirement_view_table) {
    //     this.requirement_view_table.exportToExcelParent();
    //     // this.export_ready_req =false;
    //     // this.export_btn_req =false;
    //     this.export_data_list_req = [];
    //   }
    // }
    if (this.applicant_view_data && this.applicant_view_data.table_configuration_flag) {
      if (this.applicant_view_table) {
        this.applicant_view_data.table_configuration_flag = false;
        this.applicant_view_table.openColumnDetails();
      }
    }
    if (this.requirement_view_data && this.requirement_view_data.table_configuration_flag) {
      if (this.requirement_view_table) {
        this.requirement_view_data.table_configuration_flag = false;
        this.requirement_view_table.openColumnDetails();
      }
    }


    // this.change_detector.detectChanges();
  }

  removeRequirementTab(ev, index: number) {
    ev.preventDefault();
    this.workbench_tabs.splice(index, 1);
  }

  toggleCollapseReq() {
    this.requirement_view_data.is_collapsed = !this.requirement_view_data.is_collapsed;

  }

  toggleCollapseApplicant() {
    this.applicant_view_data.is_collapsed = !this.applicant_view_data.is_collapsed;

  }

  public beforeChange($event: NgbPanelChangeEvent) {

    if ($event.panelId === 'preventchange-2') {
      $event.preventDefault();
    }

    if ($event.panelId === 'preventchange-3' && $event.nextState === false) {
      $event.preventDefault();
    }
  }

  setRequirementRequest(obj) {
    this.requirement_request.setScrollKeys(obj)
    this.getRequirements(this.requirement_request.getRequirementRequestObject())
  }

  getRequirements(request, subscription?) {  //for requirements
    this.callGetRequirements(request, subscription)
  }

  getApplicantList(request, subscription?) {
    this.applicantsAPICall(request, subscription);
  }

  filterRequirements(id) {
    // this.requirement_request.resetAll();
    this.requirement_request.skip = 0;
    this.startPage =1;
    try { id = Number(id.filter_template_id) } catch (e) { id = undefined }
    if (id)
      this.requirement_request.filter_template_ids = [id]
    else
      this.requirement_request.filter_template_ids = []

    this.requirement_request.code = null;
    this.requirement_request.filter_requirement_data = null
    this.requirement_view_data.selected_filter = id;

    this.profile_settings_srv.setDefaultFilter({
      def_app_filter_id: 0,
      def_req_filter_id: this.requirement_view_data.selected_filter
    })
    this.getRequirements(this.requirement_request.getRequirementRequestObject())
  }
  editRequirementFilter(e) {
    this.openDynamicModal(8002, 1, 'requirement', e)
  }


  getRequirementList(e) {

  }

  setApplicantReq(obj) {
    this.applicant_request.setScrollKeys(obj)
    this.applicantsAPICall(this.applicant_request.getApplicantRequestObject())
  }

  requirementFilter(form_code, edit_flag?, obj?) {
    const dialogconfig = new MatDialogConfig
    dialogconfig.width = "50%"
    dialogconfig.minWidth = "50%"
    const dia = this.dialog.open(RequirementFilterComponent, dialogconfig);
    (dia.componentInstance).form_code = form_code;
    (dia.componentInstance).edit_flag = edit_flag;
    (dia.componentInstance).t_id = obj.filter_template_id;
    dia.afterClosed().subscribe(res => {
      this.getRequirements(null)
    })
  }


  applicantsAPICall(request, subscription?) {   // for applicants
    this.callApplicantsAPICall(request, null, subscription)
  }

  statusCountClick(req_id, status_id, value) {
    this.status_id = [];
    this.req_id = [];
    if (req_id && req_id.length) {
      for (let i = 0; i < req_id.length; i++) {
        this.req_id.push(req_id[i]);
      }
    } else {
      this.req_id.push(req_id);
    }
    if (status_id && status_id.length) {
      for (let i = 0; i < status_id.length; i++) {
        this.status_id.push(status_id[i]);
      }
    } else {
      this.status_id.push(status_id);
    }
    if (!value) {
      this.keyword = '';
    }
    // }
    // this.status_id = status_id;
  }

  applicantViewCheckboxSelected(ev) {

    if (ev) {
      this.applicant_view_data.selected_entries = ev;
      this.applicant_request.requirement_id = ev;
    }
  }

  requirementViewCheckboxSelected(ev) {


    // this.profile_settings_srv.setDefaultFilter({
    //   def_app_filter_id: null,
    //   def_req_filter_id: 0
    // })
    let req_id = [];
    this.requirement_ids = [];
    this.requirement_ids = this.requirement_view_data.selected_entries.map(requirement => {
      return requirement.requirement_id;
    })
    this.applicant_request.setReqIds(this.requirement_ids);
    // this.applicant_request.req_ids = this.requirement_ids;
    this.applicantsAPICall(this.applicant_request.getApplicantRequestObject());
  }

  resetSelectedRequirements() {
    this.requirement_view_data.selected_entries.forEach(entry => {
      entry.row_selected = false;
    })
    this.requirement_view_data.selected_entries = [];
  }

  resetSelectedApplicants() {
    this.applicant_view_data.selected_entries.forEach(entry => {
      entry.row_selected = false;
    })
    this.applicant_view_data.selected_entries = [];
  }

  filterApplicants(id) {
    // this.applicant_request.resetAll();
    this.applicant_request.skip = 0;
    this.startPageApp =1;
    try { id = Number(id.filter_template_id) } catch (e) { id = undefined }
    if (id)
      this.applicant_request.filter_template_ids = [id]
    else
      this.applicant_request.filter_template_ids = []

    this.applicant_view_data.selected_filter = id;
    this.applicant_request.filter_applicant_data = {}
    this.profile_settings_srv.setDefaultFilter({
      def_app_filter_id: this.applicant_view_data.selected_filter,
      def_req_filter_id: 0
    })
    this.applicantsAPICall(this.applicant_request.getApplicantRequestObject());
  }
  editApplicantFilter(e) { //to edit filter template of applicants

    this.openDynamicModal(1221, 1, 'applicant', e)
  }


  event(ev) {
    if (ev) {


      this.status = jsonParse(ev.status);

    } else {


    }
  }
  applicantCount(ev) {
    if (ev) {
      // this.profile_settings_srv.resetDefaultFilter({
      //   def_app_filter_id: null,
      //   def_req_filter_id: 0
      // })
      this.applicant_request.setReqIds([ev.data.requirement_id]);
      this.applicantsAPICall(this.applicant_request.getApplicantRequestObject())
    }
  }
  // saveKeyword() {
  //   this.statusCountClick(this.req_id, this.status_id, this.keyword);
  // }

  // filterResumeDetails() {
  //   this.filter_details.setData(this.filter_form.value);
  //   this.WBService.getResumeDetails(this.filter_details).subscribe(res => {
  //     this.ngOnInit();
  //     // this.filter_details.setData(this.filter_form.value);
  //   });
  // }



  exportToExcelConfirmation(flag?) { // flag 1 for applicant export and flag 2 for requirement export
    let dialog_ref = this.dialog.open(ExportConfirmationComponent, {
      width: '480px',
      height: 'fit-content',
    })
    dialog_ref.afterClosed().subscribe(res => {

      if (flag == 1) { //flag 1 for applicant export
        this.export_data_list = [];
        if (res == 1) { //for all
          this.getExportList();
        }
        else if (res == 2) { //for selected entries

          if (this.applicant_view_data.selected_entries.length > 0) {
            this.export_excel_srv.exportExcel(setExportKeys(this.applicant_view_data.selected_entries, this.applicant_view_data.grid_layout), 'Applicant Details');
          }
          else {
            this.notification.snackbar('Please select atleast one Applicant to proceed', 'Close', 3000);
          }

        }
      }
      else if (flag == 2) { //flag 2 for requirement export
        this.export_data_list_req = []
        if (res == 1) { //for all
          this.getExportListReq();
        }
        else if (res == 2) { //for selected entries

          if (this.requirement_view_data.selected_entries.length > 0) {
            this.export_excel_srv.exportExcel(setExportKeys(this.requirement_view_data.selected_entries, this.requirement_view_data.grid_layout), 'Requirement Details');
          }
          else {
            this.notification.snackbar('Please select atleast one Requirement to proceed', 'Close', 3000)
          }

        }
      }



    })

  }

  getExportList() {
    // this.applicant_request.setReqId(this.requirement_ids)
    this.WBService.getApplicantList(this.applicant_request.getApplicantRequestObject()).subscribe(res => {
      if (res && res['data'] && res['data'].Applicants && typeof res['data'].Applicants == 'object' && res['data'].Applicants.length > 0) {
        try {
          if (res && res['data'] && res['data']['total_count']) {
            if (this.export_data_list && this.export_data_list.length > 0) {
              this.export_data_list = [...this.export_data_list, ...res['data']['Applicants']];
            }
            else {
              this.export_data_list = res['data']['Applicants']
            }
            this.export_data_count = res['data']['total_count']
            this.applicant_request.setExportKeys(
              {
                skip: this.export_data_list.length,
                export_flag: 1
              }
            );
            if (this.export_data_list.length < Number(this.export_data_count)) {
              this.getExportList()
            }
            else {

              this.export_excel_srv.exportExcel(setExportKeys(this.export_data_list, this.applicant_view_data.grid_layout), 'Applicant Details');
              this.applicant_request.setExportKeys(0);
              // this.applicant_request.setReqId(null)
            }
          }
        }
        catch (err) {

        }
      }

    }, (err) => {
    });

  }

  getExportListReq() {

    this.WBService.getRequirements(this.requirement_request.getRequirementRequestObject()).subscribe(res => {
      if (res && res['data']) {
        try {

          if (res && res['data'] && res['data']['total_count']) {
            if (this.export_data_list_req && this.export_data_list_req.length > 0) {
              this.export_data_list_req = [...this.export_data_list_req, ...res['data']['list']]
            }
            else {
              this.export_data_list_req = res['data']['list'];
            }

            this.export_data_count_req = res['data']['total_count']
            this.requirement_request.setExportKeys(
              {
                skip: this.export_data_list_req.length,
                export_flag: 1
              });
            if (this.export_data_list_req.length < Number(this.export_data_count_req)) {
              this.getExportListReq()
            }
            else {
              // this.export_btn_req = false;
              // this.export_ready_req = true;
              // if (!this.change_detector['destroyed'])
              //   this.change_detector.detectChanges();
              // this.ngAfterViewInit();

              this.export_excel_srv.exportExcel(setExportKeys(this.export_data_list_req, this.requirement_view_data.grid_layout), 'Requirement Details');
              this.applicant_request.setExportKeys(0);
              this.applicant_request.setReqId(null);
            }
          }
        }
        catch (err) {
        }

      }
    })

  }


  removeSearchItem(e: Event, i, from) {
    if (from == 2) { //applicant
      this.selected_applicant_search.splice(i, 1);
      if (this.selected_applicant_search.length > 0) {
        e.stopPropagation()
      }
      this.applicantSearchClk();
    }
    if (from == 1) { //applicant
      this.selected_requirement_search.splice(i, 1)
      if (this.selected_requirement_search.length > 0) {
        e.stopPropagation()
      }
      this.requirementSearchClk();
    }
  }
  openActivity(req_res_id) {
    this.showActivity(req_res_id);

  }


  openSideNav(selected_applicants, action_flag, workbench_flag) {
    this.open_status(selected_applicants, action_flag, workbench_flag || 1)
  }


  display(data?) {

    this.requirement_view.selected_entries.push({})
    this.selected_applicants.push('asdf');


    // if (!this.change_detector['destroyed'])
    //   this.change_detector.detectChanges();

  }


  CellClicked(ev) {
    try {
      if (ev.func) {
        this[ev.func](ev);
      }
    }

    catch (ex) {

    }
  }

  openRequisition(ev) {  //open Requirement manager Tab
    this.newTab(2, 1070, ev.data);
  }

  openResume(ev) { // for opening create resume for candidate resume details
    try {
      this.newTab(3, resume_manager_form_code, ev.data);
    }
    catch (err) {
    }
  }

  newResume() {
    try {
      if (this.requirement_view_data.selected_entries && this.requirement_view_data.selected_entries.length && this.requirement_view_data.selected_entries.length == 1) {
        this.newTab(3, resume_manager_form_code, this.requirement_view_data.selected_entries[0]);
      }
      else if (this.requirement_view_data.selected_entries && this.requirement_view_data.selected_entries.length && this.requirement_view_data.selected_entries.length > 1) {
        this.notification.snackbar('Please select a Requirement to proceed', 'Close', 3000)
      }
      else {
        this.notification.snackbar('Please select atleast one Requirement to proceed', 'Close', 3000)
      }


    }
    catch (err) {
    }
  }


  requirement_title(ev) { //open requirement manager tab

    this.newTab(2, 1070, ev.data) //1005

  }

  openSummary(ev) { // open Applicant summary(details) tab
    let data = [];
    data.push(ev.data);
    this.newTab(6, null, data)
  }

  openInterviewFeedback(ev) {

    if (ev && ev['data']) {
      let data = ev['data'];
      data['show_applicant_feedback'] = true;
      this.newTab(7, null, [data])
    }
  }

  onStageStatusCount(ev) {
    let req = {};
    if (ev) {
      if (ev && ev.col_details) {
        req['title'] = ev.col_details['property'];
      }
      if (ev.data) {
        if (ev.data.requirement_id)
          req['requirement_id'] = ev.data.requirement_id;
        if (ev.data.stage_code)
          req['stage_code'] = ev.data.stage_code;
        if (ev.data.status_code)
          req['status_code'] = ev.data.status_code;
      }

    }
    // this.profile_settings_srv.resetDefaultFilter({
    //   def_app_filter_id: null,
    //   def_req_filter_id: 0
    // });
    // this.applicant_request.resetAll();
    // this.applicant_request.stage_data = req;
    this.applicant_request.setStageData(req);
    this.applicantsAPICall(this.applicant_request.getApplicantRequestObject());
  }

  lockApplicantFilter(flag) {
    this.applicant_request.setLockFilter(flag);
    this.applicantsAPICall(this.applicant_request.getApplicantRequestObject());
  }

  lockRequirementFilter(flag) {
    this.requirement_request.setLockFilter(flag);
    this.getRequirements(this.requirement_request.getRequirementRequestObject())
  }

  email_id(ev) { //cellclick ev for opening mailer
    if (ev && ev.data) {
      this.newTab(5, 1, [ev.data]);
    }
  }

  newTab(param, form_code?, data?) {
    this.newTabCall(param, form_code, data)
  }


  isEmpty(obj) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }



  appicantAttachments() {
    const matDialogConfig = new MatDialogConfig()
    matDialogConfig.minWidth = "50%"
    matDialogConfig.width = "50%"
    const dialog = this.dialog.open(ApplicantAttachmentsComponent, matDialogConfig);
    (dialog.componentInstance).selected_entries = this.applicant_view.selected_entries
  }
  addMailerTab(id, data) {
    let tab_id = this.workbench_tabservice.addTab('Mailer', 3, {
      selected_entries: cloneArray(data),

    });
    this.tabset.select("workbench-tabs-" + tab_id)
  }

  tabChanged(tab) {
    // this.current_tab = tab.nextId;
  }

  applicantFilterOnspot() {
    const filterData = {
      top: this.filterIcon.nativeElement.getBoundingClientRect().top + 20,
      left: this.filterIcon.nativeElement.getBoundingClientRect().left + 140
    };
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = this.applicant_view['filter_template']
    dialogConfig.width = "30%"
    dialogConfig.maxWidth = "30%"
    // dialogConfig.autoFocus = false
    // dialogConfig.hasBackdrop = false
    const dia = this.dialog.open(ApplicantFilterOnspotComponent, dialogConfig);
    (dia.componentInstance).form_code = Number(8003);
    // (dia.componentInstance).filterData = filterData;
    (dia.componentInstance).pre_data = (this.applicant_request.pre_data || 0)
    dia.afterClosed().subscribe(res => {
      if (res) {
        // this.applicant_request.resetAll();
        this.applicant_request.filter_applicant_data = res.filter_applicant_data || {};
        this.applicant_request.pre_data = res
        this.applicant_request.filter_template_ids = []
        this.applicantsAPICall(this.applicant_request.getApplicantRequestObject());
        this.profile_settings_srv.setDefaultFilter({
          def_app_filter_id: null,
          def_req_filter_id: 0
        })
      }
    })
  }

  requirementFilterOnspot() {
    let form_code = 8004;
    const filterData = {
      top: this.filterIcon1.nativeElement.getBoundingClientRect().top + 20,
      left: this.filterIcon1.nativeElement.getBoundingClientRect().left + 140
    };
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = this.applicant_view['filter_template']
    dialogConfig.width = "30%"
    dialogConfig.maxWidth = "30%"
    dialogConfig.autoFocus = false
    // dialogConfig.hasBackdrop = false
    const dialog = this.dialog.open(RequirementFilterOnspotComponent, dialogConfig);
    (dialog.componentInstance).form_code = Number(form_code);
    // (dialog.componentInstance).filterData = filterData;
    (dialog.componentInstance).pre_data = this.requirement_request.pre_data;
    dialog.afterClosed().subscribe(res => {
      if (res) {
        this.requirement_request.filter_requirement_data = res.filter_requirement_data;
        this.requirement_request.pre_data = res
        // this.requirement_request.section = res.section;
        this.requirement_request.code = null;
        this.requirement_request.filter_template_ids = []
        this.profile_settings_srv.setDefaultFilter({
          def_app_filter_id: 0,
          def_req_filter_id: null
        })
        this.getRequirements(this.requirement_request.getRequirementRequestObject())
      }
    })
  }

  applicantFilter(request) {
    this.requirement_request.filter_requirement_data = request;
    this.getRequirements(this.requirement_request.getRequirementRequestObject())
  }

  removeTab(ev, tab) {
    ev.preventDefault();
    this.workbench_tabservice.removeTab(tab);
  }

  openDynamicModal(form_code, edit_flag, str, obj) {

    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = this.applicant_view['filter_template']
    dialogConfig.width = "50%"
    const dialog = this.dialog.open(DynamicModalComponent, dialogConfig);
    (dialog.componentInstance).edit_flag = edit_flag || 0;
    (dialog.componentInstance).form_code = form_code;
    // (dialog.componentInstance).selected_template = obj
    (dialog.componentInstance).t_id = (obj && obj.filter_template_id ? obj.filter_template_id : 0)
    dialog.afterClosed().subscribe(res => {
      // this.ngOnInit()
      if (res) {
        let hit_api;

        if (str == 'applicant') {
          //   if (obj && obj.filter_template_id && obj.filter_template_id && this.applicant_request && this.applicant_request.filter_template_ids && this.applicant_request.filter_template_ids.length) {
          //     for (let i = 0; i < this.applicant_request.filter_template_ids.length; i++) {
          //       if (this.applicant_request.filter_template_ids[i] == obj.filter_template_id) {
          //         hit_api = true;
          //         break;
          //       }
          //       else {
          //         hit_api = false;
          //       }
          //     }
          //     if (hit_api) {
          this.applicantsAPICall(this.applicant_request.getApplicantRequestObject());
          // }
          // }

          // else {
          //   this.applicantsAPICall(this.applicant_request);
          // }

        }
        if (str == 'requirement') {

          // if (obj && obj.filter_template_id && obj.filter_template_id && this.requirement_request && this.requirement_request.filter_template_ids && this.requirement_request.filter_template_ids.length) {
          //   for (let i = 0; i < this.requirement_request.filter_template_ids.length; i++) {
          //     if (this.requirement_request.filter_template_ids[i] == obj.filter_template_id) {
          //       hit_api = true;
          //       break;
          //     }
          //     else {
          //       hit_api = false;
          //     }
          //   }
          //   if (hit_api) {
          this.getRequirements(this.requirement_request);
          //     }
          //   }
          //   else {
          //     this.getRequirements(this.requirement_request);
          //   }
          // }
        }
        // this.change_detector.detectChanges()
      }
    })
  }

  onResizeEnd(ev) {

  }
  ReqListScroll(event){
    this.start = this.startPage;
    let skip_start = this.start - 1;
    this.requirement_request.skip= skip_start * (this.backend_take || 100);
    this.startPage = event;
     this.requirement_request.take = this.backend_take;
    this.setRequirementRequest( this.requirement_request);
  }
  ApplListScroll(event){
    this.start_app = this.startPageApp;
    let skip_start = this.start_app - 1;
    this.skip_app = skip_start * (this.backend_take || 100);
    this.startPageApp = event;
    this.applicant_request['skip']= this.skip_app;
    this.applicant_request['take']== this.backend_take;
    this.setApplicantReq( this.applicant_request);
  }
}


export class RequirementView {
  requirement_list: Array<any>;
  total_count: number;
  selected_entries: Array<any> = [];
  grid_layout: Array<any>;
  fetching_entries: number;
  filter_templates: Array<any> = [];
  export_flag: number;
  file_name: string;
  table_code: number;
  is_collapsed: boolean = false;
  table_configuration_flag;
  export_list: Array<any> = []
}

export class ApplicantView {
  applicant_list: Array<any>;
  total_count: number;
  selected_entries: Array<any> = [];
  grid_layout: Array<any>;
  fetching_entries: number;
  filter_template: Array<any>;
  export_flag: number;
  file_name: string;
  table_code: number;
  is_collapsed: boolean = false;
  table_configuration_flag;
  export_list: Array<any> = []

}


@Pipe({
  name: 'GetTitlePipe'
})
export class GetTitlePipe implements PipeTransform {
  transform(code: any[], options: any[]): Array<any> {
    let out_str = [];

    if (code) {
      options.forEach(opt => {
        if (opt.property && code == opt.property) {


          out_str.push(opt.title || '');
          return;
        }
      })
    }
    return out_str || [];
  }
}
