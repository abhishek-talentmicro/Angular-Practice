import { Component, OnInit, Input, Output, ViewChild, ChangeDetectorRef, EventEmitter, Pipe, PipeTransform, enableProdMode, Directive, ElementRef, SimpleChanges, ViewChildren, QueryList } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { FormBuilder, Validators } from '@angular/forms';
import { DynamicSaveService } from 'src/app/controls/services/Dynamic-Save/dynamic-save.service';
import { environment } from 'src/environments/environment';
import { GetMastersService } from '../../services/get-master/get-masters.service';
import { FilesComponent } from '../files/files.component';
import { ProfileSettingsService } from 'src/app/services/shared/profile-settings/profile-settings.service';
import { MatDialog } from '@angular/material/dialog';
import { viewDocument } from '../attachment-view/attachment-view.component';
import { downloadFile } from '../../functions/file-function';
import { DOMHandlerDirective } from '../../directives/DOMhandler.directive';
import { setValidators, markAllAsValidFields } from '../dynamic-form/dynamic-form.component';
import { ConfirmationComponent } from 'src/app/modules/shared/confirmation/confirmation.component';
import { NotificationService } from 'src/app/services/shared/notification/notification.service';
import { sendWhatMateNotification } from './functions/dynamic-section-functions';
import { getSplits } from '../phone-number/phone-number.component';
import { ExportExcelService } from 'src/app/services/vendor-management/workbench/export-excel/export-excel.service';
import { jsonParse, cloneArray } from 'src/app/functions/functions';

@Component({
  selector: 'tm-dynamic-section',
  templateUrl: './dynamic-section.component.html',
  styleUrls: ['./dynamic-section.component.scss'],
  providers: [
    DynamicSaveService,
    GetMastersService,
    ExportExcelService
  ]
})
export class DynamicSectionComponent implements OnInit {
  @Input() form;
  @Input() parent_form;
  @Input() fields;
  @Input() masters;
  @Input() modules;
  @Input() section_details;
  @Input() t_id;
  @Input() other_data;
  @Output() createForm = new EventEmitter();
  @Input() getMethod?;
  @Input() sharing_data;
  @Input() openMailer;
  @Input() row_data;
  @Input() callback_func;
  @Input() enable_virtual_scroll_section;
  @Input() verification_required;
  @Input() sectionActivation;

  verified = 1;

  @ViewChild(CdkVirtualScrollViewport)
  cdkVirtualScrollViewPort: CdkVirtualScrollViewport;
  @ViewChild(DOMHandlerDirective) directive;
  @ViewChildren('fields') field_elements: QueryList<any>;

  field_elements_query_list;
  field;
  edit_btn;
  loading;
  disable;
  prev_value = [];
  table_records = [];
  table_keys = [];
  data;

  sample_style = '{ "background-color": "black" }'

  master_obj = [];

  constructor(
    private fb: FormBuilder,
    private change_detector: ChangeDetectorRef,
    private getMasters: GetMastersService,
    private dynamic_svc: DynamicSaveService,
    private invalid_field_subject: ProfileSettingsService,
    private dialog: MatDialog,
    private file_save_svc: ExportExcelService,
    private notification_svc: NotificationService,
    private verify_svc: DynamicSaveService
  ) {
  }

  ngAfterContentChecked() {
    this.change_detector.detectChanges();
  }

  ngAfterViewInit() {
    try {
      this.field_elements_query_list = this.field_elements;
      this.field_elements.changes.subscribe((r) => {
        this.field_elements_query_list = r;
      });

    }
    catch (err) {

    }
  }

  ngOnInit() {
    let obj = [];

    if (this.sectionActivation)
      this.sectionActivation(this.section_details);

    console.log(this.masters);
    if (this.section_details && this.section_details.data) {
      this.section_details.data = jsonParse(this.section_details.data);
      this.data = this.section_details.data[0]

      if (this.section_details.data.length == undefined) {
        this.section_details.data = [this.section_details.data];
      }
    }


    // if (this.form && this.section_details && this.section_details.data && this.section_details.data.length && this.section_details.data[0] && !this.section_details.multiple) { //&& !this.form.value

    //   this.form.patchValue(this.section_details.data[0]);

    // }
    this.fields = jsonParse(this.fields);


    if (this.section_details && !this.section_details.multiple && !this.section_details.edit_flag) {
      this.section_details.edit_flag = this.t_id ? 0 : 1;
    }

    // if (this.section_details && !this.section_details.edit_flag) {
    //   this.section_details.edit_flag = this.section_details.multiple ? 1 : 0;
    // }

    this.change_detector.detectChanges();

    this.fetchMasters();
    // console.log(this.parent_form);
    try {
      this.invalid_field_subject.getInvalidField().subscribe(field => {
        if (field && field.length && this.directive) {
          this.directive.invalidField(field);
        }
      })
    }
    catch (err) {

    }
  }

  ngOnChanges(changes): void {
    // console.log('section' + changes);
    if (this.sectionActivation)
      this.sectionActivation(this.section_details, this.section_details);

    if (changes.section_details && changes.section_details.currentValue) {
      // this.section_details = changes.section_details;
      if (this.section_details && this.section_details.data) {
        this.section_details.data = jsonParse(this.section_details.data);
        this.data = this.section_details.data[0]

        if (this.section_details.data.length == undefined) {
          this.section_details.data = [this.section_details.data];
        }
      }
      if (this.fields && this.fields.length && this.fields.length > 50) {
        this.enable_virtual_scroll_section = 1;
      }
      else {
        this.enable_virtual_scroll_section = 0;
      }
    }
  }

  decodeData(data) {
    try {
      return decodeURIComponent(data)
    }
    catch (err) {
      console.log(err)
      return data
    }
  }


  selected_obj(obj) {

    if (obj) {
      Object.keys(obj).forEach(key => {
        if (key.indexOf('child_') > -1) {
          this.masters[key] = cloneArray(jsonParse(obj[key])) || [];
        }
      })
    }

    this.change_detector.detectChanges();
  }

  filesChanged(ev) {

  }

  enableSave() {
    if (this.section_details) {
      this.section_details.edit_flag = this.section_details.edit_flag == 1 ? 0 : 1;
      this.form.patchValue(this.section_details.data[0]);
    }
  }

  fetchMasters() {

    if (!(this.masters)) {
      this.edit_btn = true;

      let master_objs = [];
      let master_ids = [];

      let hit_api = false;
      this.fields.forEach(ele => {
        if (ele.control_type_id == 7 || ele.control_type_id == 11) {
          if (ele.master_table_id) {
            hit_api = true;

            if (master_ids.indexOf(ele.master_table_id) > -1) {
              if (master_ids && master_ids[master_ids.indexOf(ele.master_table_id)] && master_ids[master_ids.indexOf(ele.master_table_id)].ids && master_ids[master_ids.indexOf(ele.master_table_id)].ids.length && this.section_details.data[0][ele.field_name]) {
                master_ids[master_ids.indexOf(ele.master_table_id)].ids.push(this.section_details.data[0][ele.field_name]);
              }
            }
            else {
              master_objs.push({ "master_id": ele.master_table_id, "skip": 0, "take": this.masters && this.masters[ele.master_prop_name] ? this.masters[ele.master_prop_name].take || 1000 : 1000, "search": '', "ids": this.section_details && this.section_details.data && this.section_details.data[0] && this.section_details.data[0][ele.field_name] ? (typeof this.section_details.data[0][ele.field_name] == 'object' && this.section_details.data[0][ele.field_name].length ? this.section_details.data[0][ele.field_name] : [this.section_details.data[0][ele.field_name]]) : [] });
              master_ids.push(ele.master_table_id);
            }
          }
        }
      })
      if (hit_api) {
        this.getMasters.getMasters({ master_details: master_objs }).subscribe(res => {

          this.masters = res['data'].masters;
        })
      }


      this.change_detector.detectChanges();
    }
  }

  // viewDocument(files) {
  //   let all_files = this.checkActiveFiles(cloneArray(files));
  //   viewDocument(all_files, null, this.dialog);
  //   console.log(this.files);
  // }

  checkActiveFiles(obj) {
    let active_files
    active_files = [];
    if (obj && obj.length) {
      obj.forEach(element => {
        if (element.status == 1) {
          active_files.push(element);
        }
      });
    }
    return obj;
  }

  // cloneMasters(masters, master_prop_name) {
  //   if (masters[master_prop_name] && masters[master_prop_name].data) {
  //     return cloneArray(masters[master_prop_name].data)
  //   }
  //   else {
  //     return cloneArray(masters[master_prop_name])
  //   }
  // }

  onEmailClick() {
    if (this.openMailer) {
      if (this.row_data && this.row_data.data && this.row_data.res_id) {
        this.openMailer(5, 2, [this.row_data]);
      }
      else {
        if (this.t_id) {
          let obj = {
            res_id: this.t_id
          }
          this.openMailer(5, 2, [obj]);
        }
      }
    }


    console.log(this.row_data)

  }
  LabelClicked(ev) {
    if (this.openMailer) //5001 is form_code for dynamic create resume form
      this.openMailer(3, 9881, this.row_data); //for opening candidate resume information(5001 is resume create form code)
  }
  // onSaveDynamicForm(url) {

  //   this.dynamic_svc.apiCall("post", url, this.form.value).subscribe(resData => {

  //   })
  // }

  // dynamicFormSave() {
  //   this.loading = true;
  //   this.disable = true;



  //   // let multiple = this.section_details[0].multiple
  //   let obj = this.multiSectionDataSave(this.section_details, this.form)

  //   this.dynamic_svc.apiCall('post', environment.SERVER_URL + this.section_details.save_api_url, obj).subscribe(resData => {

  //     this.loading = false;
  //     this.disable = false;
  //     this.ngOnInit();
  //   })
  // }

  // multiSectionDataSave(section_details, form_group) {
  //   if (form_group.get('sections') && section_details.length) {
  //     for (let i = 0; i < section_details.length; i++) {
  //       if (section_details[i].multiple == 1) {
  //         let obj = form_group.get('sections').value[i];
  //         if (obj['sections'] && obj['sections'].length) {
  //           delete obj['sections'];
  //         }
  //         section_details[i].data = [obj];
  //       }

  //       if (section_details[i].multiple == 0) {
  //         let obj = form_group.get('sections').value[i];
  //         if (obj['sections'] && obj['sections'].length) {
  //           delete obj['sections'];
  //         }
  //         section_details[i].data = obj;
  //       }
  //       if (section_details[i].sections) {

  //         if ((form_group.get('sections').controls).length > 0) {
  //           for (let j = 0; j < (form_group.get('sections').controls).length; j++) {
  //             this.multiSectionDataSave(section_details[i].sections, (form_group.get('sections').controls[j]))
  //           }
  //         }
  //       }
  //     }
  //   }
  //   else {
  //     section_details.data = [form_group.value];
  //     // section_details.data = form_group.value;
  //   }
  //   return section_details;
  // }

  dynamicFormSave() {
    let obj = this.multiSectionDataSave(this.section_details, this.form)

    this.dynamic_svc.apiCall('post', environment.SERVER_URL + this.section_details.save_api_url, { sections: [obj], data: this.form.value, section_data: this.form.value, section_id: this.section_details.section_id, t_id: this.t_id }, this.other_data).subscribe(resData => { //{ id: this.t_id || 0 }
      this.t_id = resData['data'].t_id;
      this.sharing_data['t_id'] = this.t_id;
      this.ngOnInit();
    })
  }

  multiSectionDataSave(sections, form_group) {
    sections = jsonParse(sections);
    if (sections) {
      sections.data = [form_group.value];
    }
    if (sections && sections.length) {
      sections.forEach(section => {
        if (form_group && section.section_id && form_group.get([section.section_id])) {
          section.data = [form_group.get([section.section_id]).value];
        }
        if (section.sections) {
          return this.multiSectionDataSave(section.sections, form_group);
        }
      });
      return sections;
    }
    else {
      return sections;
    }
  }

  onCancel() {
    this.section_details.edit_flag = 0;
  }

  fetchMasterEntries(ev, obj) {
    try {
      console.log(obj, this.form.get([obj.field_name]).value);
      this.master_obj = [];
      let master_ids = []
      if (obj.control_type_id == 7) {
        master_ids = [this.form.get([obj.field_name]).value]
      }
      else {
        master_ids = this.form.get([obj.field_name]).value
      }

      this.master_obj.push({ "master_id": obj.master_table_id, "skip": ev.skip, "take": ev.take, "search": ev.search, "ids": master_ids || [], "parameter": obj.master_prop_name });

      this.getMasters.getMasters({ master_details: this.master_obj }).subscribe(res => {
        try {
          this.master_obj = [];
          if (!ev.search) {
            this.masters[obj.master_prop_name].data = this.masters[obj.master_prop_name].data.concat(res['data'].Master[obj.master_prop_name]);
            this.change_detector.detectChanges();
          }
          else {
            this.masters[obj.master_prop_name] = (jsonParse(res['data'].Master)[obj.master_prop_name]) || [];
          }
        }
        catch (err) {
          console.log(err);
        }
      }), err => {
        console.log(err);
      }
      // this.change_detector.detectChanges();
    }
    catch (err) {
      console.log(err);
    }
  }

  onChange(ev, field) {
    try {
      console.log(ev, this.parent_form, this.form, field);
      if (field && field.dynamic_validation) {
        field.dynamic_validation = jsonParse(field.dynamic_validation);
        if (field.dynamic_validation && field.dynamic_validation.length) {
          field.dynamic_validation.forEach(element => {
            if (element) {
              if (element.section) { }
              else {
                if (this.form) {
                  this.fields.forEach(f => {
                    if (f.field_name == element.field) {
                      f.min_value = new Date(ev.value);
                    }
                  });
                  // this.change_detector.detectChanges();
                }
              }
            }
          });
        }
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  viewDocument(all_files, file) {
    viewDocument(all_files, file, this.dialog)
  }

  downLoad(file) {
    downloadFile(file[0], this.file_save_svc)
  }

  verifyAllDocuments(field) {
    let message;
    message = 'Add Notes/Reason'
    const dialog = this.dialog.open(ConfirmationComponent, {
      width: '300px',
      data: {
        title: "Notes/Reason",
        message: message,
        form_enable: 1,
        decline_flag: field.verification_status == 2 ? 1 : 0,
        positive_button: "Add",
        negative_button: "Cancel"
      }
    });
    dialog.afterClosed().subscribe(res => {
      if (res) {
        field.notes = res.notes;
        field.reason = res.reason;
        // let obj = {
        //   field_id: field.field_id,
        //   section_id: this.section_details.section_id || 0,
        //   is_verified: 0,
        //   verified_all: accept_param,
        //   attachment_ids: [],
        //   reason: res.reason,
        //   notes: res.notes
        // };
        // data.forEach(ele => {
        //   if (!ele.is_verified) {
        //     obj.attachment_ids.push(ele.attachment_id);
        //   }
        // })
        // this.verify_svc.verifyDocument(obj).subscribe(res => {
        //   if (res['status']) {
        //     data.forEach(ele => {
        //       ele.is_verified = true;
        //     })
        //     this.verified = 0;
        //     setTimeout(() => {
        //       this.verified = 1
        //     });
        //   }
        //   this.notification_svc.snackbar(res['message'], 'Close', 5000);
        // })
      }

    })
  }
  evalFunction(fn, data, form, parent_form) {
    try {
      console.log(form);
      console.log(parent_form);
      if (fn) {
        if (fn.indexOf('(') > -1)
          eval('this.' + fn)
        else
          this[fn](data);
      }
    }

    catch (ex) {
      console.log(ex)
    }
  }
  sendNotification(name, number) {
    console.log(name)
    console.log(number)
    sendWhatMateNotification(name, number, this.dynamic_svc, this.notification_svc, this.dialog)
  }


  markAllAsValid(section, status) {
    markAllAsValidFields(section, status);
  }

}
//field_obj?: any, form_group?

@Pipe({
  name: 'DynamicFieldConditionCheckPipe'
})
export class DynamicFieldConditionCheckPipe implements PipeTransform {
  transform(form_value: any, conditions, parent_form?: any, field?: any, field_obj?, form_group?): boolean {
    let status = true;
    try {
      if (conditions) {
        try {
          conditions = jsonParse(conditions)
          if (typeof conditions == 'string') {
            if (eval(conditions)) {
              setValidators(field_obj, form_group);
              status = true;
            }
            else {
              if (field) {
                field.clearValidators();
                field.updateValueAndValidity()
              }
              status = false;
            }
          }
          else {
            try {
              if (conditions)
                if (conditions && typeof conditions == 'string') {
                  try {
                    conditions = JSON.parse(conditions);
                  }
                  catch (err) {
                    conditions = [];
                  }
                }


              try {
                if (conditions && typeof (conditions) == 'string') {
                  conditions = JSON.parse(conditions)
                }
              }
              catch (err) {
                conditions = [];
                // conditions = conditions;

              }

              if (!(conditions && conditions.length)) return true;
              // if (!searchText) return items;


              let status = true;
              if (conditions && conditions.length) {
                for (let i = 0; i < conditions.length; i++) {
                  let condition = conditions[i];
                  let str;
                  if ((condition.section && condition.section != '') || (condition.section_id && condition.section_id != '')) {
                    condition.section = condition.section || condition.section_id;
                    condition.section = condition.section.replace(/\./g, '"]["')
                    str = 'parent_form["value"]["' + (condition.section || '') + '"]["' + condition.field + '"]'
                    if (eval((str || null) + condition.operator + condition.value)) {
                      status = true;
                    }
                    else {
                      try {
                        if (field) {
                          // field.disable();
                          field.clearValidators();
                          field.updateValueAndValidity();
                        }
                      }
                      catch (err) {

                      }
                      return false;
                    }
                  }
                  else {
                    if (eval(((form_value[condition.field] && form_value[condition.field] != '' ? form_value[condition.field] : null) + condition.operator + condition.value))) {
                      status = true;
                      if (status && field) {
                        setValidators(field_obj, form_group);

                      }
                      return status;
                    }
                    else {
                      if (form_value && form_value.length) {
                        for (let j = 0; j < form_value.length; j++) {
                          let form = form_value[j];
                          if (eval(((form[condition.field] && form[condition.field] != '' ? form[condition.field] : null) + condition.operator + condition.value))) {
                            status = true;
                            if (field) {
                              setValidators(field_obj, form_group);
                            }
                            return status;
                          }
                          else {
                            try {
                              if (field) {
                                field.clearValidators();
                                field.updateValueAndValidity()
                              }
                            }
                            catch (err) {

                            }
                            status = false;
                          }

                        }
                      }
                      else {
                        try {
                          if (field) {
                            field.clearValidators();
                            field.updateValueAndValidity()
                          }
                        }
                        catch (err) {

                        }
                        status = false;
                      }
                    }
                  }
                }
              }
              if (status && field) {
                setValidators(field_obj, form_group);
              }
              return status;
            }
            catch (err) {
              console.log(err);
              return true;
            }
          }

        }
        catch (err) {
          status = true;
        }

      }
    }
    catch (err) {
      status = true;
    }
    return status;
  }
}

@Pipe({
  name: 'DynamicFieldProcessingPipe'
})
export class DynamicFieldProcessingPipe implements PipeTransform {
  transform(form_val: any, form_value: any, conditions: any[], parent_form?: any, field?: any, actual_field?: any, section_data?: any, form?: any): boolean {
    try {
      if (form_val) {
        if (conditions)
          if (conditions && typeof conditions == 'string') {
            try {
              conditions = JSON.parse(conditions);
            }
            catch (err) {
              conditions = [];
            }
          }
        try {
          if (conditions && typeof (conditions) == 'string') {
            conditions = JSON.parse(conditions)
          }
        }
        catch (err) {
          conditions = [];
        }

        if (!(conditions && conditions.length)) return true;

        let status = true;
        let condition;
        let str = "''", str2 = "''";
        let i;
        if (conditions && conditions.length) {
          for (i = 0; i < conditions.length; i++) {
            condition = conditions[i];
            if (condition && condition.validation_type && actual_field) {
              if (condition.condition) {
                condition.condition = jsonParse(condition.condition)
                if (eval(condition.condition)) {
                  let flag = false;
                  //disable a field
                  if (condition.validation_type == 1) {
                    try {
                      if (eval(condition.value)) {
                        actual_field.is_disable = 1;
                      }
                      else {
                        actual_field.is_disable = 0;
                      }
                    }
                    catch (err) {
                      if (condition.value) {
                        actual_field.is_disable = 1;
                      }
                      else {
                        actual_field.is_disable = 0;
                      }
                    }
                    if (field && actual_field.is_disable) {
                      field.disable();
                    }
                    else {
                      field.enable();
                    }
                  }

                  //set min value of a field
                  if (condition.validation_type == 2) {
                    try {
                      actual_field.min_value = eval(condition.value);
                      flag = true;
                    }
                    catch (err) {
                      actual_field.min_value = condition.value;
                    }
                  }

                  //set max value of a field
                  if (condition.validation_type == 3) {
                    try {
                      actual_field.max_value = eval(condition.value);
                      flag = true;
                    }
                    catch (err) {
                      actual_field.max_value = condition.value;
                    }
                  }

                  //set value of a field
                  if (condition.validation_type == 4) {
                    try {
                      field.setValue(eval(condition.value));
                      if (section_data) {
                        section_data[actual_field.field_name] = eval(condition.value)
                      }
                    }
                    catch (err) {
                      try {
                        field.setValue(condition.value);
                        if (section_data) {
                          section_data[actual_field.field_name] = condition.value
                        }
                      }
                      catch (err) {
                        console.log(err);
                      }
                    }
                  }

                  //set min length of a field
                  if (condition.validation_type == 5) {
                    try {
                      actual_field.min_length = eval(condition.value);
                      flag = true;
                    }
                    catch (err) {
                      actual_field.min_length = condition.value;
                      flag = true;
                    }
                  }

                  //set max length of a field
                  if (condition.validation_type == 6) {
                    try {
                      actual_field.max_length = eval(condition.value);
                      flag = true;
                    }
                    catch (err) {
                      actual_field.max_length = condition.value;
                      flag = true;
                    }
                  }

                  //set mandatory flag of a field
                  if (condition.validation_type == 7) {
                    try {
                      if (eval(condition.value)) {
                        actual_field.mandatory_flag = 1;
                      }
                      else {
                        actual_field.mandatory_flag = 0;
                      }
                      flag = true;
                    }
                    catch (err) {
                      if (condition.value) {
                        actual_field.mandatory_flag = 1;
                      }
                      else {
                        actual_field.mandatory_flag = 0;
                      }
                      flag = true;
                    }
                  }

                  //set pattern of a field
                  if (condition.validation_type == 8) {
                    try {
                      actual_field.final_pattern = condition.value;
                      flag = true;
                    }
                    catch (err) {

                    }
                  }
                  if (actual_field && form) {
                    setValidators(actual_field, form);
                  }
                }
                else {
                  if (field && field.disable) {
                    field.enable()
                  }
                }
              }
              else {
                if (condition.section && condition.section != '') {
                  condition.section = condition.section || condition.section_id;
                  condition.section = condition.section.replace(/\./g, '"]["')
                  str = 'parent_form["value"]["' + (condition.section || '') + '"]["' + condition.field + '"]'
                }
                else {
                  if (condition.field && condition.field != '') {
                    str = 'form_value["' + condition.field + '"]';
                  }
                }

                //if second field is a dynamic value
                if (condition.value_type) {
                  if (condition.section2 && condition.section2 != '') {
                    condition.section2 = condition.section2;
                    condition.section2 = condition.section2.replace(/\./g, '"]["')
                    str2 = 'parent_form["value"]["' + (condition.section2 || '') + '"]["' + condition.field2 + '"]'
                  }
                  else {
                    if (condition.field2 && condition.field2 != '') {
                      str2 = 'form_value["' + condition.field2 + '"]';
                    }
                  }
                }
                else {
                  if (condition.field2 && condition.field2 != '') {
                    str2 = condition.field2;
                  }
                }

                if (eval((str || null) + (condition.operator || '==') + (str2 || null))) {

                  let flag = false;

                  //disable a field
                  if (condition.validation_type == 1) {
                    try {
                      if (eval(condition.value)) {
                        actual_field.is_disable = 1;
                      }
                      else {
                        actual_field.is_disable = 0;
                      }
                    }
                    catch (err) {
                      if (condition.value) {
                        actual_field.is_disable = 1;
                      }
                      else {
                        actual_field.is_disable = 0;
                      }
                    }
                    if (field && actual_field.is_disable) {
                      field.disable();
                    }
                    else {
                      field.enable();
                    }
                  }

                  //set min value of a field
                  if (condition.validation_type == 2) {
                    try {
                      actual_field.min_value = eval(condition.value);
                      flag = true;
                    }
                    catch (err) {
                      actual_field.min_value = condition.value;
                    }
                  }

                  //set max value of a field
                  if (condition.validation_type == 3) {
                    try {
                      actual_field.max_value = eval(condition.value);
                      flag = true;
                    }
                    catch (err) {
                      actual_field.max_value = condition.value;
                    }
                  }

                  //set value of a field
                  if (condition.validation_type == 4) {
                    try {
                      field.setValue(eval(condition.value));
                      if (section_data) {
                        section_data[actual_field.field_name] = eval(condition.value)
                      }
                    }
                    catch (err) {
                      try {
                        field.setValue(condition.value);
                        if (section_data) {
                          section_data[actual_field.field_name] = condition.value
                        }
                      }
                      catch (err) {
                        console.log(err);
                      }
                    }
                  }

                  //set min length of a field
                  if (condition.validation_type == 5) {
                    try {
                      actual_field.min_length = eval(condition.value);
                      flag = true;
                    }
                    catch (err) {
                      actual_field.min_length = condition.value;
                      flag = true;
                    }
                  }

                  //set max length of a field
                  if (condition.validation_type == 6) {
                    try {
                      actual_field.max_length = eval(condition.value);
                      flag = true;
                    }
                    catch (err) {
                      actual_field.max_length = condition.value;
                      flag = true;
                    }
                  }

                  //set mandatory flag of a field
                  if (condition.validation_type == 7) {
                    try {
                      if (eval(condition.value)) {
                        actual_field.mandatory_flag = 1;
                      }
                      else {
                        actual_field.mandatory_flag = 0;
                      }
                      flag = true;
                    }
                    catch (err) {
                      if (condition.value) {
                        actual_field.mandatory_flag = 1;
                      }
                      else {
                        actual_field.mandatory_flag = 0;
                      }
                      flag = true;
                    }
                  }

                  //set pattern of a field
                  if (condition.validation_type == 8) {
                    try {
                      actual_field.final_pattern = condition.value;
                      flag = true;
                    }
                    catch (err) {

                    }
                  }
                  if (actual_field && form) {
                    setValidators(actual_field, form);
                  }
                }
              }
            }
          }
        }
      }
      else {
        return false;
      }
    }
    catch (err) {
      console.log(err);
    }

    return true;
  }
}


@Pipe({
  name: 'DecodeHTML'
})
export class DecodeHTML implements PipeTransform {
  transform(data: any) {
    try {
      return decodeURIComponent(data)
    }
    catch (err) {
      return data;
      console.log(err)
    }
  }
}

@Pipe({
  name: 'DynamicFieldMasterTitle'
})
export class DynamicFieldMasterTitle implements PipeTransform {
  transform(code: any, masters: any[], all_masters: any[]) {


    code = jsonParse(code);
    if (code && masters && (masters.length || masters['data'])) {
      let master_array = [];
      master_array = masters['data'] ? masters['data'] : masters;
      if (typeof code != 'object') {
        let out_str;
        master_array.forEach(master => {
          if (master.code && code == master.code) {
            out_str = master.title || '';
            Object.keys(master).forEach(key => {
              if (key.indexOf('child_') > -1) {
                all_masters[key] = jsonParse(master[key]);
              }
            })
            return;
          }
        })
        return out_str || '';  //out_str || ''
      }
      else if (typeof code == 'object' && code.length) {
        let out_str = [];
        code.forEach(c => {
          master_array.forEach(master => {
            if (master.code && c == master.code) {
              if (out_str) {
                out_str.push(master.title || '');
              }
              return;
            }
          })
        })
        let output = '';
        try {
          if (out_str) {
            output = out_str.toString().replace(/,/g, ', ');
          }
        }
        catch (err) {
          console.log(err);
        }
        return (output); //out_str || ''
      }
    }
    else {
      return [];
    }
  }
}

@Pipe({
  name: 'DynamicFilesTitlePipe'
})
export class DynamicFilesTitlePipe implements PipeTransform {
  transform(file_obj: any[]) {


    let out_str = [];
    file_obj = jsonParse(file_obj);

    if (typeof file_obj == 'object') {
      if (file_obj && (file_obj.length)) {

        file_obj.forEach(file => {
          out_str.push(file.file_title);
        })


        return out_str || []; //out_str || ''
      }
    }
    else {
      return ''
    }
  }
}

@Pipe({
  name: 'VerifyCheck'
})
export class VerifyCheck implements PipeTransform {
  transform(file_obj, field) {
    let files;
    if (file_obj) {
      files = jsonParse(file_obj);
      if (files && files.length && typeof files == 'object') {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          if (!(file.is_verified)) {
            return 0;
          }
          else if (file.is_verified == 1) {
            return 1
          }
          else if (file.is_verified == 1) {
            return 2
          }
        }
      }
    }
    return 0
  }

}

@Pipe({
  name: 'AddNgStylePipe'
})

export class AddNgStylePipe implements PipeTransform {
  transform(ngstyle, additional_css) {
    if (ngstyle && additional_css) {
      console.log(additional_css, ngstyle);
      additional_css = jsonParse(additional_css);
      ngstyle = jsonParse(ngstyle);
      if (!(ngstyle && typeof ngstyle == 'object')) {
        ngstyle = null;
      }
      if (!(additional_css && typeof additional_css == 'object')) {
        additional_css = null;
      }


      if (!(additional_css && ngstyle)) return null;

      return { ...ngstyle, ...additional_css };
    }
  }
}

@Pipe({
  name: 'PhoneNumberPipe'
})

export class PhoneNumberPipe implements PipeTransform {
  transform(str, split_index_arr?, max_length?) {
    try {
      if (str) {
        let final_split_arr = []
        let out_str = '';
        split_index_arr = jsonParse(split_index_arr);
        if (split_index_arr && split_index_arr.length && typeof split_index_arr == "object") {
          final_split_arr = getSplits(max_length, split_index_arr);

          let start_index = 0
          for (let i = 0; i < final_split_arr.length; i++) {
            if (i == 0) {
              out_str = str.slice(start_index, start_index + parseInt(final_split_arr[i]));
            }
            else {
              out_str += '-' + str.slice(start_index, start_index + parseInt(final_split_arr[i]));
            }
            start_index += parseInt(final_split_arr[i]);
          }
          return out_str;
        }
        else {
          if (str) {
            try {
              str = str.replace(/\)/g, '');
              str = str.replace(/\(/g, '');
              str = str.replace(/\+/g, '');
              str = str.replace(/\-/g, '');
              str = str.replace(/ /g, '');
            }
            catch (err) {

            }
            return str.slice(0, 3) + "-" + str.slice(3, 6) + "-" + str.slice(6, 10);
          }
        }
      }

      else {
        return;
      }
    }
    catch (err) {
      return str;
    }
  }
}
