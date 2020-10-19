import { Component, OnInit, ChangeDetectorRef, OnDestroy, Input, NgZone } from '@angular/core';
import { RequirementStatusComponent } from './requirement-status/requirement-status.component';
import { environment } from 'src/environments/environment';
import { NotificationService } from 'src/app/services/shared/notification/notification.service';
import { DynamicSaveService } from 'src/app/controls/services/Dynamic-Save/dynamic-save.service';
import { NotesComponent } from './notes/notes.component';
import { TranslateService } from '@ngx-translate/core';
import { setActiveSection, enableSave, removeMultipleForm, multiSectionDataSave, markFormGroupTouched, findInvalidControls, displayErrors, cancel, prepareSections, prepareSectionData, readOnlyMode } from 'src/app/controls/components/dynamic-form/dynamic-form.component';
import { SocialMediaShareComponent } from '../social-media-share/social-media-share.component';
import { Subscription } from 'rxjs';
import { ProfileSettingsService } from 'src/app/services/shared/profile-settings/profile-settings.service';
import { SessionService } from 'src/app/modules/login/services/session/session.service';
import { WorkbenchService } from 'src/app/services/vendor-management/workbench/workbench.service';
import { NotesService } from 'src/app/services/vendor-management/workbench/requirement/notes.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { WorkbenchTabsService } from 'src/app/services/vendor-management/workbench-tabs/workbench-tabs.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { jsonParse, cloneArray } from 'src/app/functions/functions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-requirement-manager',
  templateUrl: './requirement-manager.component.html',
  styleUrls: ['./requirement-manager.component.scss'],
  providers: [
    WorkbenchService,
    NotesService
  ]
})
export class RequirementManagerComponent implements OnInit, OnDestroy {
  @Input() current_tab;
  @Input() new_tab_callback
  // @Input() onStageStatusCount;
  @Input() openResume;
  @Input() resetTab;
  @Input() applicantFilter;
  @Input() navigateToBusiness;
  @Input()  func_callback
  applicant_status_grid = [
    { "editable_flag": 0, "label_type": 1005, "save_url": "", "control_type_id": 2, "form_code": 2001, "grid_title": "", "property": "status", "visible": true, "width": 40, "description": "", "data_type": "nvarchar", "ascending": 0, "grouping": 0, "cell_class": "", "cell_template": "", "filter": "", "label_code": "1023", "title": "Status", "sub_module_code": 3005, "module_code": 1001, "status": 1, "view_type": 0, "field_name": "", "sequence": 1 },
    { "editable_flag": 0, "label_type": 1005, "save_url": "", "control_type_id": 3, "form_code": 2001, "grid_title": "onStageStatusCount", "property": "count", "visible": true, "width": 50, "description": "", "data_type": "int", "ascending": 0, "grouping": 0, "cell_class": "", "cell_template": "", "filter": "", "label_code": "171", "title": "Count", "sub_module_code": 3005, "module_code": 1001, "status": 1, "view_type": 0, "field_name": "onStageStatusCount", "sequence": 2 }];

  active = 0;
  section_data;
  url;
  form_code = 2001;
  display_type;
  masters;
  requirement_form: FormGroup;
  loading;
  disable;
  t_id;
  dynamic_form_new: FormGroup;

  count_height: number;

  requirement_details;
  applicant_details;

  tab_details;
  status_id: number = 2;
  stage_id: number = 3;


  cellClickedCB;
  dataSavedCB;

  notes_data;
  notes_count;
  chart_obj: any;

  hide_form = 0;

  dataSavedRef;

  access_rights: any
  subscription: Subscription;
  constructor(
    private workbench_tabsservice: WorkbenchTabsService,
    private workbench_service: WorkbenchService,
    private fb: FormBuilder,
    private zone: NgZone,
    private dialog: MatDialog,
    private dynamic_svc: DynamicSaveService,
    private notification_svc: NotificationService,
    private notes_svc: NotesService,
    private translate: TranslateService,
    private change_detector: ChangeDetectorRef,
    private profile_svc: ProfileSettingsService,
    private session_svc: SessionService,
    private router: Router,
    private workbench_tabs_srv: WorkbenchTabsService
  ) {
    this.requirement_form = new FormGroup({});
    this.dynamic_form_new = new FormGroup({});
  }

  ngOnInit() {

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
    this.dataSavedRef = this.dataSaved.bind(this);
    this.cellClickedCB = this.cellClicked.bind(this);
    let data = this.workbench_tabsservice.getTabDetails(this.current_tab);
    console.log(data)
    try {
      if (data && data.data) {
        // this.form_code = data.data.form_code;
        this.tab_details = data.data.data;

        this.requirement_details = data.data.requirement_details;
        if (data.data.requirement_form) {
          this.requirement_form = data.data.requirement_form;
        }
        try {
          if (data && data.data && data.data.data && data.data.data.requirement_id) {
            this.t_id = data.data.data.requirement_id;
          }
          if (data && data.data && data.data && data.data.requirement_id) {
            this.t_id = data.data.requirement_id;
            this.tab_details = data.data;
          }
          if (data && data.data && data.data.t_id) {
            if (!this.t_id) {
              this.t_id = data.data.t_id;
            }
          }
          if (data && data.data && data.data.applicant_details) {
            this.applicant_details = data.data.applicant_details;
            if (this.applicant_details.length) {
              this.chartData();
              this.count_height = (27 * this.applicant_details.length + 27)
              this.change_detector.detectChanges();
            }
          }
          if (data && data.data && data.data.notes_data) {
            this.notes_data = data.data.notes_data;
            this.notes_count = this.notes_data.length ? this.notes_data.length : 0;
          }
          if (this.tab_details && this.tab_details.req_id) { // requiement tab opened from resume create (Resume details)
            this.t_id = this.tab_details.req_id;
          }
        }
        catch (err) {
          this.t_id = null;
        }

        if (data.data.section_data) {
          // this.modules = this.all_data.masters.modules;
          this.section_data = data['data'].section_data;
          this.display_type = data.data.display_type;
          this.masters = data.data.masters;
        }
        else {
          this.getDetails();
        }
      }
      else {
        this.getDetails();
      }
    }
    catch (err) {
      this.form_code = null;
      this.t_id = null;
      this.section_data = [];
      this.display_type = 0;
      this.masters = [];
    }

    if (this.t_id && !this.notes_data) {
      this.getNotes();
    }
  }

  chartData(): void {
    this.zone.runOutsideAngular(() => {
      Promise.all([
        import("@amcharts/amcharts4/core"),
        import("@amcharts/amcharts4/charts"),
        import("@amcharts/amcharts4/themes/animated")
      ])
        .then(modules => {

          if (document.getElementById("chartdiv")) {
            const am4core = modules[0];
            am4core.addLicense("CH200313264459131");
            const am4charts = modules[1];
            const am4themes_animated = modules[2].default;
            am4core.useTheme(am4themes_animated);
            let filter_req_obj;
            const chart = am4core.create("chartdiv", am4charts.PieChart);
            this.chart_obj = chart;
            chart.dy = -6
            chart.data = this.applicant_details;
            console.log(this.applicant_details)
            let pieSeries = chart.series.push(new am4charts.PieSeries());
            pieSeries.dataFields.value = "count";
            pieSeries.dataFields.category = "status";
            pieSeries.innerRadius = am4core.percent(60);
            pieSeries.ticks.template.disabled = true;
            pieSeries.labels.template.disabled = true;
            // pieSeries.name = name;
            // pieSeries.tooltipText = "{name}: [bold]{valueY}[/]";
            let rgm = new am4core.RadialGradientModifier();
            rgm.brightnesses.push(-0.4, -0.5, -0.3, 0, 0.6);
            pieSeries.slices.template.fillModifier = rgm;
            pieSeries.slices.template.strokeModifier = rgm;
            pieSeries.slices.template.strokeOpacity = 0.4;
            pieSeries.slices.template.strokeWidth = 0;
            pieSeries.slices.template.events.on("hit", (ev) => {
              var series = ev.target.dataItem.component;

              filter_req_obj = {
                filter_applicant_data: {
                  stage_id: [ev.target.dataItem.dataContext['stage_code']],
                  status_id: [ev.target.dataItem.dataContext['status_code']],
                  requirement_id: this.t_id
                },
                filter_template_ids: [],
                sort: null
              }


              this.applicantFilter(filter_req_obj);

            });
          }
        })

    })

  }

  ngOnDestroy() {
    this.workbench_tabsservice.updateTabDetails(this.current_tab, {
      section_data: this.section_data,
      display_type: this.display_type,
      url: this.url,
      form_code: this.form_code,
      masters: this.masters,
      data: this.tab_details,
      requirement_form: this.requirement_form,
      requirement_details: this.requirement_details,
      t_id: this.t_id,
      applicant_details: this.applicant_details,
      notes_data: this.notes_data
    });
    if (this.chart_obj) {
      this.chart_obj.dispose(); // clear charts data
    }
  }

  cellClicked(ev) {

    // this.onStageStatusCount(ev);
    // this.new_tab_callback(1, null, {
    //   t_id: this.t_id,
    //   status_id: ev.data.status_id || 0,
    //   stage_id: ev.data.stage_id || 0,
    //   ev: ev
    // });
    console.log(ev)
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

  onStageStatusCount(ev) {
    let filter_req_obj = {
      filter_applicant_data: {
        stage_id: [ev.data['stage_code']],
        status_id: [ev.data['status_code']],
        requirement_id: this.t_id
      }
    }
    this.applicantFilter(filter_req_obj);

  }

  getDetails(set_data_flag?) {
    // this.requirement_form = new FormGroup({});
    try {
      this.workbench_service.getFormDetails({ form_code: this.form_code || 2001, template_code: 0, t_id: this.t_id || 0 }).subscribe(res => {
        if (res && res['data'] && res['data'].details && res['data'].details.length) {

          if (!set_data_flag) {
            this.section_data = (res['data'].details);
            this.display_type = (res['data'].details)[0].display_type_id;
            let virtual_scroll_fields = {};
            prepareSections(this.section_data, this.requirement_form, this.section_data, this.t_id, this.fb, this.display_type, virtual_scroll_fields);
            console.log(virtual_scroll_fields);
            let master_obj = [];
            for (let i = 0; i < Object.keys(virtual_scroll_fields).length; i++) {
              let obj = {}
              let master_id = Object.keys(virtual_scroll_fields)[i];
              obj['master_id'] = master_id;
              obj['values'] = virtual_scroll_fields[master_id];
              master_obj.push(obj);
            }

            this.workbench_service.getFormMaster(master_obj, { form_code: this.form_code || 2001, template_code: 0, t_id: this.t_id || 0 }).subscribe(masters => {
              if (masters && masters['data'] && masters['data'].masters)
                this.masters = masters['data'].masters;
            })
          }

          else {
            this.hide_form = 1;
            prepareSectionData(res['data'].details, this.requirement_form, this.section_data);
            this.change_detector.detectChanges();
            setTimeout(() => {
              this.hide_form = 0;
            })
            console.log(this.section_data);
          }

          if (res['data'].req_details)
            this.requirement_details = res['data'].req_details[0];
        }
        if (this.t_id) {
          this.applicant_details = res['data'].app_details;
          this.chartData();
        }
      })
    }
    catch (err) {

    }


  }


  searchResume() {
    console.log(this.t_id)
    this.new_tab_callback(4, null, {
      t_id: this.t_id,
      // t_id: 5,
      result_valid: true
    });
  }
  createResume() {
    // this.new_tab_callback(6, null, null);
    this.openResume({ data: { requirement_id: this.t_id } })
  }
  getApplicants() {
    this.new_tab_callback(1, null, {
      t_id: this.t_id,
      status_id: this.status_id || 0,
      stage_id: this.stage_id || 0
    });
  }

  dataSaved(e) {
    console.log(e)
    this.t_id = e;
    if (this.t_id && e) {
      this.getDetails(1);
      this.resetTab();
    }
  }

  editReqStatus() {
    let ref = this.dialog.open(RequirementStatusComponent);
    (ref.componentInstance).req_status = this.masters.req_status || [];
    (ref.componentInstance).current_status = this.requirement_details.req_status_code || [];
    ref.afterClosed().subscribe(res => {
      if (res) {

      }

    })
  }


  checkActiveSection(sections) {
    let found_selected_index = 0;
    sections = jsonParse(sections);
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

  cancel(section, form?) {
    cancel(section, form, this.t_id);
  }

  dynamicFormSave(section_list, form_group) {
    //if section supports multiple and api url is present or if section is not multiple
    //data has to be sent to backend for saving


    if (form_group.valid) {
      //if section is not multiple
      if (section_list && ((section_list.multiple && section_list.save_api_url != '') || !section_list.multiple)) {
        let processed_section_list = new Object();
        for (let i of Object.keys(section_list)) {
          if (typeof section_list[i] == "object" && section_list[i].length >= 0) {
            processed_section_list[i] = cloneArray(section_list[i]);
          }
          else if (typeof section_list[i] == "object") {
            processed_section_list[i] = Object.assign({}, section_list[i]);
          }
          else {
            processed_section_list[i] = section_list[i];
          }
        }
        // processed_section_list = Object.assign({}, section_list);

        if (processed_section_list && processed_section_list['section_id'] && form_group) {
          if (!processed_section_list['multiple_form']) {
            processed_section_list['data'] = [Object.assign({}, this.requirement_form.get([section_list.section_id]).value)];
          }
          else {
            let section_form = processed_section_list['multiple_form'];
            let form_value_arr = cloneArray(this.requirement_form.get([processed_section_list['section_id']]).value) || [];
            form_value_arr.push(Object.assign({}, section_form.value));
            this.requirement_form.get([processed_section_list['section_id']]).setValue(cloneArray(form_value_arr));

            //setting value in sections array
            processed_section_list['data'] = [];
            // if (!(processed_section_list['data'] && typeof processed_section_list['data'] == 'object' && processed_section_list['data']['length'] >= 0)) {
            //   processed_section_list['data'] = [];
            // }
            processed_section_list['data'].push(Object.assign({}, section_form.value));
          }
        }
        processed_section_list['sections'] = multiSectionDataSave(processed_section_list['sections'], form_group);
        // delete (processed_section_list.multiple_form);
        processed_section_list = removeMultipleForm(processed_section_list);

        //Multiple conditition for section_data
        let processed_section_data;
        if (section_list.multiple) {
          processed_section_data = [form_group.value]
        }
        else {
          processed_section_data = form_group.value
        }
        //

        let section_data_value;
        if (section_list.multiple) {
          section_data_value = Object.assign({}, this.requirement_form.get([section_list.section_id]).value);
          this.requirement_form.get([section_list.section_id]).reset();
        }
        else {
          section_data_value = form_group.value;
        }


        this.dynamic_svc.apiCall('post', environment.SERVER_URL + processed_section_list['save_api_url'], { sections: [processed_section_list], data: this.requirement_form.value, section_data: section_data_value, section_id: processed_section_list['section_id'], t_id: this.t_id }, null).subscribe(resData => { //

          if (resData && resData && resData['id'] && (resData['status'] || resData['status'] == null)) {
            if (!this.t_id) {
              this.t_id = resData['id'];
              // this.sharing_data['t_id'] = this.t_id;
            }

            if (this.display_type == 3) {
              // this.stepper.next();
              // this.enableSave(section_list);
            }
            else {
              readOnlyMode(section_list);
              // this.cancel(section_list, this.requirement_form.get([section_list.section_id]));
            }

            if (section_list.multiple) {
              form_group.reset();
            }
            this.dataSaved(this.t_id);
          }
          this.notification_svc.success(resData['message']);
          // this.ngOnInit();
          // this.getMethod();
        },
          (err) => {

          })
      }

      //  If section is multiple, form_group value has to be pushed into data array and new form_group has to be added in the first index.
      //   If an edited entry is saved, 1. it has to be assigned back into the same index of data array 2. the form group which was used to create the entry has to be assigned to first index
      else {
        let section_form = section_list.multiple_form;

        //flow while editing existing record
        if (section_form.value.t_id) {

          //setting value in sections array
          for (let i = 0; i < section_list.data.length; i++) {
            if (section_list.data[i].t_id == section_form.value.t_id) {
              section_list.data[i] = section_form.value;
            }
          }

          //setting value for section_data obj.
          let found_in_form_group = 0;
          for (let i = 0; i < this.requirement_form.get([section_list.section_id]).value.length; i++) {
            if (this.requirement_form.get([section_list.section_id]).value[i].t_id == section_form.value.t_id) {
              let form_value_arr = cloneArray(this.requirement_form.get([section_list.section_id]).value);
              form_value_arr[i] = section_form.value;
              this.requirement_form.get([section_list.section_id]).patchValue(form_value_arr);
              found_in_form_group = 1;
            }
          }
          if (!found_in_form_group) {
            let form_value_arr = cloneArray(this.requirement_form.get([section_list.section_id]).value);
            form_value_arr.push(section_form.value);
            this.requirement_form.get([section_list.section_id]).patchValue(form_value_arr);
          }
        }

        //flow while adding a new record
        else {
          // if (!(this.edit_obj && this.edit_obj.index)) {
          //   //setting value for section_data obj.
          //   let form_value_arr = (this.requirement_form.get([section_list.section_id]).value) || [];
          //   form_value_arr.push(section_form.value)
          //   this.requirement_form.get([section_list.section_id]).patchValue(form_value_arr);

          //   //setting value in sections array
          //   section_list.data.push(section_form.value);
          // }
          // else {

          // }
        }

        section_form.reset();
        setTimeout(() => {
          // this.display_table = 1;
        })
      }
    }
    else {
      console.log(form_group);
      // this.notification_svc.snackbar("Please enter correct values!", "Cancel", 3000)
      markFormGroupTouched(form_group);
      let invalid_controls = findInvalidControls(form_group, section_list, this.translate, this.notification_svc);
    }
  }


  getNotes() {
    this.notes_svc.getReqNotes({ req_id: this.t_id }).subscribe(data => {
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
    console.log(this.t_id)
    let ref = this.dialog.open(NotesComponent, dialogConfig);
    (ref.componentInstance).notes = {
      req_id: this.t_id,
      notes_data: this.notes_data
    }
    ref.afterClosed().subscribe(res => {
      if (res) {
        this.notes_data = res;
        this.notes_count = res.length ? res.length : 0;
      }

    })
  }
  newTaskManager() {
    const dialogConfig = new MatDialogConfig
    dialogConfig.maxWidth = '30%';
    dialogConfig.disableClose = true;
    console.log(this.tab_details)
    dialogConfig.data = {
      event: null,
      start_date: null,
      requirement_id: this.tab_details['requirement_id']

    }
    // dialogConfig.panelClass="custom-dialog-container"
    // this.dialog.open(EventPopupComponent, dialogConfig).afterClosed().subscribe(res => {
    //   // this.getTaskList()
    //   // this.onMonthChangeOnFullCall()
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

    // })
  }
  openAttachmentsModal() {
    const dialogConfig = new MatDialogConfig()
    dialogConfig.width = "50%";
    // let ref = this.dialog.open(AttachmentsModalComponent, dialogConfig);
    // (ref.componentInstance).attachments = {
    //   req_id: this.t_id,
    //   attachments: this.notes_data
    // }
    // ref.afterClosed().subscribe(res => {
    //   if (res) {
    //     this.notes_data = res;
    //     this.notes_count = res.length ? res.length : 0;
    //   }

    // })
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
  openShare(req_id) {
    console.log(req_id);
    if (req_id && req_id.data && req_id.data.length) {
      const dialogRef = this.dialog.open(SocialMediaShareComponent, {
        width: '450px',
        data: {
          req_id: req_id.data[0].t_id || 0
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }
    else if (req_id && req_id.sections.length && req_id.sections[0] && req_id.sections[0].data && req_id.sections[0].data.length) {
      const dialogRef = this.dialog.open(SocialMediaShareComponent, {
        width: '450px',
        data: {
          req_id: req_id.sections[0].data[0].t_id || 0
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }
  }
}

