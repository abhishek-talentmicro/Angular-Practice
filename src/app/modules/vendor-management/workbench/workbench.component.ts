import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, enableProdMode, ViewChild, ChangeDetectorRef, OnChanges, OnDestroy, AfterViewInit, ElementRef, PipeTransform, Pipe, Output } from '@angular/core';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/services/shared/notification/notification.service';// import { TableCheckedValues } from 'src/app/controls/tallint-table/tallint-table.component';

@Component({
  selector: 'app-workbench',
  templateUrl: './workbench.component.html',
  styleUrls: ['./workbench.component.scss'],
  providers: [
    WorkbenchService,
    DynamicSaveService
  ],
  styles: [
    `
      mwlResizable {
        box-sizing: border-box; // required for the enableGhostResize option to work
      }
    `
  ]
})

export class WorkbenchComponent implements OnInit, OnChanges, OnDestroy {
  public search1;
  requirement_list = [];
  keyword: string;
  status_id: any[];
  statuses = [];
  data_headers: any[];
  isCollapsed: boolean = true;
  isCollapsed1: boolean = true;
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
  questionaries_form: FormGroup;
  dashboard_applicant_flag;
  dashboard_requirement_flag;
  applicant_summary = {
    activity_history: [],
    applicant_name: null,
    assessments: [],
    communication_history: [],
    refreshResumeCreateRef: null,
    current_stage: null,
    current_status: null,
    allow_same_stage_status_update: null
  };

  applicant_summary_accordion = [
    0,
    0,
    0,
    1
  ];

  status_update_sidebar = {
    selected_applicants: [],
    workbench_flag: 0
  }


  // sort = new TallintTableColumnSort();
  // checkedTableEntries: TableCheckedValues = new TableCheckedValues();
  @ViewChild('filterIcon', { static: false }) filterIcon: ElementRef;
  @ViewChild('filterIcon1', { static: false }) filterIcon1: ElementRef;

  @ViewChild("tabset", { static: false }) tabset: NgbTabset;
  @ViewChild("search_applicant", { static: false }) search_applicant: ElementRef;
  @ViewChild("search_requirement", { static: false }) search_requirement: ElementRef;
  @ViewChild("tallint_table2", { static: false }) tallint_table2;
  @ViewChild("tallint_table1", { static: false }) tallint_table1;



  stage_status: FormGroup;
  stage;
  reasons;
  notes;
  status = [];
  reqreason;
  default_applicant_filter;
  default_requirement_filter;
  form_applicant: FormGroup
  form_requirement: FormGroup
  @Output() applicant_view_emit: EventEmitter<any> = new EventEmitter()
  // @Output() req_list=new EventEmitter;

  requirement_view: RequirementView = new RequirementView();
  applicant_view: ApplicantView = new ApplicantView();
  applicant_request: ApplicantRequest = new ApplicantRequest();
  requirement_request: RequirementRequest = new RequirementRequest();
  workbench_tabs: any = {};
  Object = Object;
  requirement_tabs = ['Requirements'];
  applicant_tabs = ['Applicants'];
  selected = new FormControl(0);
  selected_requirements = [];
  selected_applicants = [];
  current_tab;
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
  communication_history = [];
  template_style = {  //for filter input
    'border': 'none',
    'background': 'transparent',
    'height': '20px',
    'color': 'white',
    'width': '80%',
  }
  search_style = {  //for filter input
    'border': 'none',
    'background': 'transparent',
    'height': '20px',
    'color': 'white',
    'width': '80%',

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
  requirement_view_list_master: any;
  applicant_view_list_master: any;
  on_table_click: any;
  masters_questions: any;
  display_type_questions: any;
  section_data_questions: any;
  action_form_enable: any;
  quesn_other_data = {
    "template_code": 8007
  };

  newTabRef = this.newTab.bind(this);
  resetTabRef = this.resetTab.bind(this);
  cellClickedRef = this.CellClicked.bind(this);
  applicantsAPICallRef = this.applicantsAPICall.bind(this);
  applicantFilterOnspotRef = this.applicantFilterOnspot.bind(this)
  getRequirementsRef = this.getRequirements.bind(this);
  openResumeRef = this.openResume.bind(this);
  funcCallBackRef = this.funcCallBack.bind(this);

  applicantFilterRef = this.applicantFilter.bind(this);


  enable_reason;
  enable_notes;
  a;
  selected_status_obj = null;

  dashboard_obj;

  constructor(
    private WBService: WorkbenchService,
    private change_detector: ChangeDetectorRef,
    private notification: NotificationService,
    private workbench_tabservice: WorkbenchTabsService,
    private dialog: MatDialog,
    private dynamic_svc: DynamicSaveService,
    private dashboard_routing_srv: DashboardNavigationService,
    private profile_settings_srv: ProfileSettingsService,
    private translate: TranslateService
  ) {



    this.workbench_details = new FormGroup({

    });
    this.applicant_search_form = new FormGroup({ search: new FormControl() })
    this.requirement_search_form = new FormGroup({ search: new FormControl() })
    this.form_requirement = new FormGroup({
      search: new FormControl('')
    })
    this.form_applicant = new FormGroup({
      search: new FormControl('')
    })

    this.questionaries_form = new FormGroup({})
    this.loadApplicantSearchForm()
  }

  ngOnInit() {
    if (this.applicant_view)
      this.applicant_view.wb_root_flag = true;
    if (this.requirement_view)
      this.requirement_view.wb_root_flag = true;


    this.change_detector.detectChanges();
    this.init();
    this.filter_details.setData(this.filter_form.value);
    // this.getStageStatus();
    let data = this.workbench_tabservice.getTabDetails(this.current_tab)

    this.dashboard_obj = this.dashboard_routing_srv.getStaticCode(1);
    if (this.dashboard_obj['dashboard_flag']) {
      this.workbench_tabservice.setActiveTab();
      // this.applicant_view = new ApplicantView();
      // this.requirement_view = new RequirementView();
    }


    if (data && data.data) {
      this.section_data = data.data.section_data;
      this.on_table_click = data.data.on_table_click;
      this.display_type = data.data.display_type;
      this.master = data.data.master;
      this.requirement_view = data.data.requirement_view || new RequirementView();
      this.applicant_view = data.data.applicant_view || new ApplicantView();
      this.applicant_form_code = data.data.applicant_form_code;
      this.requirement_view_list_master = data.data.requirement_view_list_master;
      this.requirement_search_form = data.data.requirement_search_form;
      this.applicant_view_list_master = data.data.applicant_view_list_master;
      this.change_detector.detectChanges();
    }
    else {

    }
    this.workbench_tabservice.getWorkbenchTabs().subscribe(res => {
      setTimeout(() => {

        this.workbench_tabs = res;
        let found = 0;
        for (let tab of Object.keys(this.workbench_tabs)) {
          if (this.workbench_tabs[tab].active_tab) {
            this.current_tab = tab;
            found = 1;
          }
        }
        if (!found) {
          let i = (Object.keys(this.workbench_tabs).length) - 1;
          let key = Object.keys(this.workbench_tabs)[0]
          this.current_tab = key;
          this.workbench_tabs[key].active_tab = true;
        }
      });
    })

    this.filter_details.setData(this.filter_form.value);
  }

  ngOnDestroy() {
    this.dialog.closeAll();
    this.dashboard_routing_srv.setStaticCode(null);
  }

  resetTab() {
    this.workbench_tabservice.resetTab(Object.keys(this.workbench_tabs)[0]);
  }

  get filter() { return this.workbench_details.get('sections') as FormArray }
  filterSave() {
    this.loading = true;
    this.disable = true;

    let obj = { filter_template: this.multiSectionDataSave(this.section_data, this.workbench_details) }

    // this.dynamic_svc.apiCall('post', environment.SERVER_URL + 'Client/ClientData?template_code=1016&lng_id=1', obj).subscribe(resData => {
    this.loading = false;
    this.disable = false;
    // })
  }

  loadApplicantSearchForm() {

  }
  multiSectionDataSave(section_data, form_group) {
    for (let i = 0; i < section_data.length; i++) {
      section_data[i].data = form_group.get('sections').value;
      if (section_data[i].sections && section_data[i].sections.length) {
        for (let j = 0; j < (form_group.get('sections').controls).length; j++) {
          this.multiSectionDataSave(section_data[i].sections, form_group.get('sections').controls[j])
        }
      }
    }
    return section_data;
  }

  applicantCellClicked(ev) {

    try {
      if (ev.func)
        this[ev.func](ev);
    }
    catch (err) {
    }
  }

  init() {
    this.requirement_view = new RequirementView();
    this.applicant_view = new ApplicantView();

    this.stage_status = new FormGroup({
      status_code: new FormControl([], Validators.required),
      stage_code: new FormControl([], Validators.required),
      reason_ids: new FormControl(null),
      notes: new FormControl(null),
      // transaction_type: new FormControl(null),
      // tn_id: new FormControl(null),
      // multiple_flag: new FormControl(null),
      req_res_ids: new FormControl(null),
      req_res_id: new FormControl(null)
    })
    this.filter_form = new FormGroup(
      {
        skills: new FormControl([]),
        education: new FormControl([]),
        designation: new FormControl([]),
        location: new FormControl([]),
        experience_from: new FormControl(null),
        experience_to: new FormControl(null),
        notice_period_from: new FormControl(null),
        notice_period_to: new FormControl(null),
        currency: new FormControl(0),
        duration: new FormControl(0),
        scale: new FormControl(0),
        ctc_from: new FormControl(null),
        ctc_to: new FormControl(null),
        keywords: new FormControl(''),
        skill_and: new FormControl(0),
        location_and: new FormControl(0),
        designation_and: new FormControl(0),
        education_and: new FormControl(0),
        notice_period_and: new FormControl(0),
        experience_and: new FormControl(0),
        ctc_and: new FormControl(0),
        keywords_and: new FormControl(0),
      });
  }

  updateWorkbenchValues(ev) {

    this.applicant_request = ev.applicant_request;
    this.requirement_request = ev.requirement_request;
    this.applicant_view = ev.applicant_view;
    this.requirement_view = ev.requirement_view;
  }


  ngOnChanges(ev) {

  }


  removeRequirementTab(ev, index: number) {
    ev.ventDefault();
    this.workbench_tabs.splice(index, 1);
  }


  public beforeChange($event: NgbPanelChangeEvent) {

    if ($event.panelId === 'preventchange-2') {
      $event.preventDefault();
    }

    if ($event.panelId === 'preventchange-3' && $event.nextState === false) {
      $event.preventDefault();
    }
  }

  getRequirements(request, subscription?) {  //for requirements
    this.requirement_view.fetching_entries = 1;



    this.WBService.getRequirements(request).subscribe(res => {
      this.requirement_view.fetching_entries = 0;
      try {
        if (res && res['data']) {
          if (request && request.flag) {
            this.requirement_view.requirement_list = [...this.requirement_view.requirement_list, ...res['data'].list];
          }
          else {
            this.requirement_view.requirement_list = res['data'].list || [];
            this.requirement_view.summary = res['data'].summary || [];
            this.requirement_view.total_count = res['data'].total_count || 0;
            try {
              let already_present_requirement = [];
              this.requirement_view.requirement_list.forEach(requirement => {
                this.requirement_view.selected_entries.forEach(selected_req => {
                  if (requirement.requirement_id == selected_req.requirement_id) {
                    requirement['row_selected'] = true;
                    already_present_requirement.push(requirement)

                  }
                })
              })
              this.requirement_view.selected_entries = already_present_requirement;
            }
            catch (err) {

            }
          }
          if (!(res['data'].list && res['data'].list.length)) {
            this.requirement_view.requirement_list = [];
            this.requirement_view.total_count = 0;
          }
          if (res['data'].masters) {
            if (res['data'].masters.table_layout && res['data'].masters.table_layout.grid_definition) {
              this.requirement_view.grid_layout = jsonParse(res['data'].masters.table_layout.grid_definition);
              // this.requirement_view_list = cloneArray(this.requirement_view.grid_layout)
              this.requirement_view_list_master = cloneArray(this.requirement_view.grid_layout)

              this.requirement_view_list_master.unshift({ 'property': "any", 'title': 'Any', is_search_filter: 1 })

              // this.req_list.emit(this.requirement_view_list)
              // this.requirement_search_form.patchValue({ 'search': "any" })

              this.change_detector.detectChanges()
              this.requirement_view.export_flag = res['data'].masters.table_layout['export_flag'];
              this.requirement_view.file_name = res['data'].masters.table_layout['file_name'];
              this.requirement_view.table_code = res['data'].masters.table_layout['table_layout_code'];
            }
            if (res['data'].masters.filter_template) {
              this.requirement_view.filter_templates = res['data'].masters.filter_template;

            }
          }
        }

      }
      catch (err) {

      }
      if (subscription) {
        subscription.unsubscribe();
      }

      this.change_detector.detectChanges();
    })
  }


  loadRequirements(request) {
    let sub = this.profile_settings_srv.default_filter_change.subscribe(res => {


      if (Object.keys(res).length > 0) {
        if (!this.dashboard_obj['dashboard_flag']) {
          if (request)
            request['filter_template_ids'] = [res['def_req_filter_id']];
          else {
            request = {}
            request['filter_template_ids'] = [res['def_req_filter_id']];
          }
        }
        this.getRequirements(request);
      }
      sub.unsubscribe();
    })
  }

  applicantSummary(e) {
    if (e == 1) {
      if (this.applicant_summary.communication_history.length > 0) {
        this.applicant_summary_accordion[0] = this.applicant_summary_accordion[0] ? 0 : 1;
      }
    }
    if (e == 2) {
      if (this.applicant_summary.assessments.length > 0) {
        this.applicant_summary_accordion[1] = this.applicant_summary_accordion[1] ? 0 : 1;
      }
    }
    if (e == 3) {
      if (this.applicant_summary.activity_history.length > 0) {
        this.applicant_summary_accordion[2] = this.applicant_summary_accordion[2] ? 0 : 1;
      }
    }
  }


  funcCallBack(ev, data) {


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

  filterRequirements(id) {
    try { id = Number(id.filter_template_id) } catch (e) { id = undefined }
    this.requirement_request.filter_template_ids = [id]
    this.requirement_request.filter_requirement_data = {}
    this.getRequirements(this.requirement_request.getRequirementRequestObject())
  }

  applicantsAPICall(request, flag?, subscription?) {   // for applicants

    if (flag) {
      this.dashboard_routing_srv.setCode(null);
    }
    try {
      if (!flag && this.tabset)
        this.tabset.select('workbench-tabs-' + Object.keys(this.workbench_tabs)[0]);
    }
    catch (err) {

    }
    // this.dashboard_routing_srv.setStaticCode(null)
    this.applicant_view.fetching_entries = 1;
    let a = this.WBService.getApplicantList(request).subscribe(res => {

      // this.dashboard_routing_srv.setStaticCode(null);
      this.applicant_view.fetching_entries = 0;
      if (res && res['data'] && res['data'].Applicants && typeof res['data'].Applicants == 'object' && res['data'].Applicants.length >= 0) {
        // this.applicant_list = res['data'].Applicants || [];
        if (request && request.flag) {
          this.applicant_view.applicant_list = [...this.applicant_view.applicant_list, ...res['data'].Applicants]

        }
        else {
          this.applicant_view.applicant_list = cloneArray(res['data'].Applicants) || [];
          this.applicant_view.total_count = res['data'].total_count || 0;
          try {
            let already_present_candit = [];
            this.applicant_view.applicant_list.forEach(applicant => {
              this.applicant_view.selected_entries.forEach(seleceted_applicant => {
                if (applicant.req_res_id == seleceted_applicant.req_res_id) {
                  applicant['row_selected'] = true;
                  already_present_candit.push(applicant)

                }
              })
            })
            this.applicant_view.selected_entries = already_present_candit;
          }
          catch (err) {

          }
          if (res['data']['master'] && res['data']['master'].filter_template) {
            this.applicant_view.filter_template = res['data']['master'].filter_template
          }
        }
        if (!(res['data'].Applicants && res['data'].Applicants.length)) {
          this.applicant_view.applicant_list = [];
          this.applicant_view.total_count = 0;
        }
      }
      if (res && res['data'] && res['data'].master && res['data'].master.table_layout && res['data'].master.table_layout.grid_definition) {
        if (res['data']['master']['table_layout']) {

          this.applicant_view.export_flag = res['data']['master']['table_layout']['export_flag'];
          this.applicant_view.file_name = res['data']['master']['table_layout']['file_name'];
          this.applicant_view.table_code = res['data']['master']['table_layout']['table_layout_code'];
        }
        if (typeof res['data'].master.table_layout.grid_definition == 'string') {
          this.applicant_view.grid_layout = jsonParse(res['data'].master.table_layout.grid_definition) || [];

          this.applicant_view_list_master = cloneArray(this.applicant_view.grid_layout);

          // let app_titles = cloneArray(this.applicant_view.grid_layout)
          // for (let i = 0; i < app_titles.length; i++) {
          //   if (app_titles[i].is_search_filter == 0) {
          //     (app_titles.splice(i, 1))
          //   }
          // }
          // this.applicant_view_list = app_titles
          this.applicant_view_list_master.unshift({ 'property': 'any', 'title': 'Any', is_search_filter: 1 })
          // this.applicant_search_form.patchValue({ 'search': "any" })
        }
        else {
          if (typeof res['data'].master.table_layout.grid_definition == 'object' && res['data'].master.table_layout.grid_definition.length >= 0) {
            this.applicant_view.grid_layout = res['data'].master.table_layout.grid_definition || [];
          }
          else {
            this.applicant_view.grid_layout = [];
          }
        }

      }
      this.change_detector.detectChanges();

      this.applicant_view_emit.emit(this.applicant_view)

      if (subscription) {
        subscription.unsubscribe();
      }
    }, (err) => {

      this.applicant_view.fetching_entries = 0;
      this.applicant_list = [];
      this.applicant_view.total_count = 0;
      this.applicant_view.grid_layout = [];
      this.applicant_view.file_name = null;
      this.applicant_view.export_flag = 0;
      if (!this.change_detector['destroyed']) {
        this.change_detector.detectChanges();
      }
    });
    if (!this.change_detector['destroyed']) {
      this.change_detector.detectChanges();
    }
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
  }
  event(ev) {
    if (ev) {

      this.action_form_enable = false;

      this.status = jsonParse(ev.status);

    } else {


    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      control.markAsDirty()
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
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

  openResume(ev) { //for opening resume details tab
    try {
      this.newTab(3, 2000, ev.data);
    }
    catch (err) {
    }
  }

  openRequisition(ev) { //  for opening requirement manager tab with requirement details
    this.newTab(2, 1070, ev.data);
  }



  requirement_title(ev) { //  for opening requirement manager tab with requirement details

    this.newTab(2, 1070, ev.data) //1005
  }

  openSummary(ev) {
    let data = [];
    data.push(ev.data);
    this.newTab(6, null, data)
  }

  newTab(param, form_code?, data?) {

    let tab_id;

    if (param == 1) { //Workbench Home tab opening
      tab_id = (Object.keys(this.workbench_tabs))[0];
      let id = [];
      try {
        if (!data.flag) {
          id.push(data.t_id)
          this.applicant_request.req_ids = id;
          this.applicant_request.stage_id = data.stage_id;
          this.applicant_request.status_id = data.status_id;
          this.applicantsAPICall(this.applicant_request.getApplicantRequestObject());
        }
        else if (data.flag == 1) { //listner for requirement-applicant-status cellclick from resume search pool
          this.applicant_request.setFilterApplicantData({
            requirement_id: data.requirement_id,
            status_id: data.status_id,
            stage_id: data.stage_id
          });

          this.applicantsAPICall(this.applicant_request.getApplicantRequestObject());
        }
      }
      catch (err) {
      }

    }
    //Requirement Manager
    else if (param == 2) {
      tab_id = this.workbench_tabservice.addTab(data ? (data.job_code || data.job_title) : 'Requirement Manager', 2, {
        form_code: form_code,
        data: data
      });
    }
    // Resume Create ( Resume Details)
    else if (param == 3) {
      this.current_candidate = null;
      let name;

      if (data && (data['candidate_name'] || data['name'])) { // when open from workbench
        name = data['candidate_name'] || data['name'];
      }
      if ((data && data['first_name']) || (data && data['last_name'])) { //when open form resume search pool which is having name as first_name and last_name
        name = data['first_name'] + " " + data['last_name']
      }
      tab_id = this.workbench_tabservice.addTab(name || 'Create Resume', 3, {
        form_code: form_code,
        data: data
      });
    }
    else if (param == 4) {
      this.current_candidate = null;
      let name;
      tab_id = this.workbench_tabservice.addTab(name || 'Import Resume', 4, {
        form_code: form_code,
        data: data
      });
    }
    // Resume Search
    setTimeout(() => {
      this.tabset.select("workbench-tabs-" + tab_id)
    })
  }

  tabChanged(tab) {
    // this.current_tab = tab.nextId;
    if (tab && tab.nextId && tab.nextId.indexOf('workbench-tabs-') > -1) {
      let current_tab = tab.nextId.replace('workbench-tabs-', '');
      this.workbench_tabservice.setActiveTab(current_tab);
    }
  }

  applicantFilter(obj) {

    if (obj) {
      if (obj.filter_applicant_data) {
        this.applicant_request.setFilterApplicantData(JSON.parse(JSON.stringify(obj.filter_applicant_data)));
        this.tabset.select('workbench-tabs-' + Object.keys(this.workbench_tabs)[0]);
      }
    }
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
    const dialog = this.dialog.open(ApplicantFilterOnspotComponent, dialogConfig);
    (dialog.componentInstance).form_code = Number(8003);
    (dialog.componentInstance).filterData = filterData;
    dialog.afterClosed().subscribe(res => {
      if (res) {
        this.applicant_request.filter_applicant_data = res.filter_applicant_data || {};
        this.applicant_request.filter_template_ids = []
        this.applicantsAPICall(this.applicant_request.getApplicantRequestObject());
      }
    })
  }

  requirementFilterOnspot() {
    let form_code = 8004
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
    (dialog.componentInstance).filterData = filterData;
    dialog.afterClosed().subscribe(res => {
      if (res) {
        this.requirement_request.filter_requirement_data = res.filter_requirement_data;
        // this.requirement_request.section = res.section;
        this.requirement_request.filter_template_ids = []
        this.getRequirements(this.requirement_request.getRequirementRequestObject())
      }
    })
  }

  removeTab(ev, tab) {
    ev.preventDefault();
    this.workbench_tabservice.removeTab(tab);
  }
}

import { DynamicSaveService } from 'src/app/controls/services/Dynamic-Save/dynamic-save.service';
import { ApplicantFilterOnspotComponent } from './applicant-filter-onspot/applicant-filter-onspot.component';
import { RequirementFilterOnspotComponent } from './requirement-filter-onspot/requirement-filter-onspot.component';
import { EventEmitter } from '@angular/core';
import { DashboardNavigationService } from 'src/app/services/shared/dashboard-navigation/dashboard-navigation.service';
import { ProfileSettingsService } from 'src/app/services/shared/profile-settings/profile-settings.service';
import { findInvalidControls, markFormGroupTouched } from '../../../controls/components/dynamic-form/dynamic-form.component';
import { ViewAssessmentsComponent } from 'src/app/controls/components/assessment/view-assessments/view-assessments.component';
import { WorkbenchService } from 'src/app/services/vendor-management/workbench/workbench.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { cloneArray, jsonParse } from 'src/app/functions/functions';
import { FilterDetails } from 'src/app/classes/shared/resume-filter/filter';
import { WorkbenchTabsService } from 'src/app/services/vendor-management/workbench-tabs/workbench-tabs.service';

export class RequirementView {
  requirement_list: Array<any>;
  total_count: number;
  selected_entries: Array<any> = [];
  grid_layout: Array<any>;
  summary: Array<any>;
  fetching_entries: number;
  filter_templates: Array<any> = [];
  export_flag: number;
  file_name: string;
  table_code: number;
  isCollapsed: boolean = true;
  selected_filter;
  wb_root_flag;
}

export class ApplicantView {
  applicant_list: Array<any>;
  total_count: number;
  selected_entries: Array<any> = [];
  grid_layout: Array<any>;
  summary: Array<any>;
  fetching_entries: number;
  filter_template: Array<any>;
  export_flag: number;
  file_name: string;
  table_code: number;
  isCollapsed: boolean = true;
  selected_filter;
  wb_root_flag;
}


export class ApplicantRequest {  //this is for applicant filter and to get req obj while scrolling
  flag: number;
  requireTotalCount: boolean
  skip: number;
  take: number;
  sort: any | Array<any>;
  totalSummary: any | Array<any>;
  filter_template_ids: any | Array<any>;
  filter_applicant_data: any | Object;
  pre_data
  req_ids;
  code;
  team_flag;
  stage_id: number;
  status_id: number;
  search_filter: any | Array<any>;
  stage_data;
  filter_template;
  requirement_id;
  lock_search_filter;
  lock_filter_template;
  export_flag;


  resetAll() {
    this.skip = 0;
    this.filter_template_ids = [];
    this.filter_applicant_data = null;
    this.code = null;
    this.stage_id = null;
    this.status_id = null;
    this.search_filter = [];
    this.req_ids = [];
    this.stage_data = null;
    this.filter_template = null;
    this.pre_data = null;
    this.team_flag = null;
    this.flag = 0;
    this.take = 0;
  }

  setStageData(obj) {
    this.req_ids = [];
    this.stage_data = obj;
    this.code = null;
    this.team_flag = null;
  }

  setReqIds(arr) {
    // this.resetAll();
    this.stage_data = null;
    this.code = null;
    this.team_flag = null;
    this.filter_applicant_data = null;
    this.req_ids = arr;
  }

  setDashboardData(obj) {
    this.code = obj['code'];
    this.team_flag = obj['team_flag'];
    this.skip = 0;
    this.flag = 0;
    this.req_ids = [];
    this.stage_data = null;
    this.filter_template_ids = [];
    this.filter_applicant_data = null;
  }

  resetDashboardData() {
    this.code = null;
    this.team_flag = null;
  }

  setFilterApplicantData(obj) {
    this.filter_applicant_data = obj;
    this.req_ids = [];
    this.stage_data = null;
    this.resetDashboardData();

  }

  setScrollKeys(obj) {
    this.flag = obj.flag
    this.requireTotalCount = obj.requireTotalCount
    this.skip = obj.skip
    this.take = obj.take
    this.totalSummary = obj.totalSummary
    this.sort = obj.sort
  }

  setExportKeys(obj) {
    if (obj) {
      this.skip = obj.skip;
      this.export_flag = obj.export_flag;
    }
    else {
      this.skip = 0;
      this.export_flag = null;
    }
  }
  setReqId(obj) {
    this.req_ids = obj;
  }

  setLockFilter(flag) {
    if (flag == 1) {
      this.lock_search_filter = this.lock_search_filter ? 0 : 1;
    }
    else if (flag == 2) {
      this.lock_filter_template = this.lock_filter_template ? 0 : 1;
    }
    this.skip = 0;
  }

  getApplicantRequestObject() {
    let obj = {
      flag: this.flag,
      requireTotalCount: this.requireTotalCount,
      skip: this.skip,
      take: this.take,
      sort: this.sort || null,
      totalSummary: this.totalSummary,
      req_ids: this.req_ids || [],
      stage_id: this.stage_id,
      status_id: this.stage_id,
      code: this.code,
      team_flag: this.team_flag,
      stage_data: this.stage_data,
      search_filter: null,
      filter_template_ids: [],
      filter_applicant_data: null
    };

    if (!this.lock_search_filter) {
      obj['search_filter'] = this.search_filter
    }

    if (!this.lock_filter_template) {
      obj['filter_template_ids'] = this.filter_template_ids
      obj['filter_applicant_data'] = this.filter_applicant_data
    }

    return obj;
  }
}

export class RequirementRequest {   //for requirement filter and to get req obj while scrolling
  flag: number;
  requireTotalCount: boolean
  skip: number;
  take: number;
  sort: any | Array<any>;
  totalSummary: any | Array<any>;
  filter_template_ids: any | Array<any>;
  filter_requirement_data: any | Object;
  search_filter: any | Object;
  pre_data;
  export_flag;
  code;
  lock_search_filter;
  lock_filter_template;
  team_flag;

  resetAll() {
    this.flag = null;
    this.requireTotalCount = null;
    this.skip = 0;
    this.take = 100;
    this.sort = [];
    this.totalSummary = [];
    this.filter_template_ids = [];
    this.filter_requirement_data = null;
    this.search_filter = null;
    this.code = null;
    this.team_flag = null;


  }

  setExportKeys(obj) {
    if (obj) {
      this.skip = obj.skip;
      this.export_flag = obj.export_flag
    }
    else {
      this.skip = 0;
      this.export_flag = 0;
    }
  }
  // section:Array<any>|any
  setScrollKeys(obj) {
    this.flag = obj.flag
    this.requireTotalCount = obj.requireTotalCount
    this.skip = obj.skip
    this.sort = obj.sort
    this.take = obj.take
    this.totalSummary = obj.totalSummary
  }


  setLockFilter(flag) {
    if (flag == 1) {
      this.lock_search_filter = this.lock_search_filter ? 0 : 1;
    }
    else if (flag == 2) {
      this.lock_filter_template = this.lock_filter_template ? 0 : 1;
    }
    this.skip = 0;
  }


  getRequirementRequestObject() {
    let obj = {
      flag: this.flag,
      requireTotalCount: this.requireTotalCount,
      skip: this.skip,
      take: this.take,
      sort: this.sort,
      totalSummary: this.totalSummary,
      filter_template_ids: [],
      filter_requirement_data: null,
      search_filter: null,
      export_flag: this.export_flag,
      code: this.code,
      team_flag: this.team_flag
      // section:this.section
    }

    if (!this.lock_search_filter) {
      obj['search_filter'] = this.search_filter
    }

    if (!this.lock_filter_template) {
      obj['filter_template_ids'] = this.filter_template_ids
      obj['filter_requirement_data'] = this.filter_requirement_data
    }

    return obj;

  }
}
export const resume_manager_form_code = 2000;
