import { Component, OnInit, ChangeDetectorRef, Input, OnDestroy, OnChanges, EventEmitter, Output, Pipe, PipeTransform, ViewChild, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { DynamicSaveService } from '../../services/Dynamic-Save/dynamic-save.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/services/shared/notification/notification.service';
import { jsonParse, cloneArray } from 'src/app/functions/functions';

@Component({
  selector: 'tm-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
  providers: [
    DynamicSaveService
  ]
})
export class DynamicFormComponent implements OnInit, OnDestroy, OnChanges {

  section_form: FormGroup | any = {};

  sectionDetails = [];

  set_form;
  fields = new Array();
  content: boolean = false;
  active = 0;
  vert_field = [];
  label;

  onboarding_keys = [];
  onboarding_list = [];

  dynamic_class;
  client_list;

  template_code;
  saveDataUrl;
  getDataUrl;
  display_table = 1;
  display_form = 1;
  evalFunctionRef
  edit_obj = {
    section: null,
    index: null,
    id: null
  }


  @Input() dynamic_form;
  @Input() section_data;
  @Input() section_list;
  @Input() masters;
  @Input() display_type;
  @Input() dialog_ref;
  @Output() onClose = new EventEmitter();
  @Input() t_id;
  @Input() other_data;
  @Output() SendValue = new EventEmitter();
  @Input() getMethod?;
  @Input() sharing_data = {};
  @Input() dataSaved;
  @Input() parentCellClicked;
  @Input() parent_form;
  @Input() openMailer;
  @Input() row_data;
  @Input() is_new_tab;
  @Input() callback_func;
  @Input() enable_virtual_scroll_section;
  @Input() verification_required;
  @Input() parent_functions;
  @Input() summaries;
  @Input() search;
  @Input() dynamic_buttons;
  @Input() vertical_navbar_width;
  @Input() vertical_navbar_sec_width;
  @Input() duplicate_resume_grid;
  @Input() sectionActivation;
  @Input() parent_section;
  @Input() hide_cancel_btn;

  @Input() nested_level = 0;

  @Input() resume_file_path;

  @ViewChild('sec_reference', { static: false }) sec_reference;
  @ViewChild('stepper', { static: false }) stepper;

  negative_index;
  index_outofbound;
  // @ViewChild('accordion', { static: false }) accordion;

  step_enable = [];
  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private dynamic_svc: DynamicSaveService,
    private notification_svc: NotificationService,
    private change_detector: ChangeDetectorRef,
    private translate: TranslateService,
    private html_formatter: HTMLFormatter,

  ) {

  }

  ngOnInit() {
    this.evalFunctionRef = this.evalFunction.bind(this)
    console.log(this.is_new_tab);
    this.section_list = jsonParse(this.section_list);
    console.log(this.summaries);
    // this.section_list.forEach(sec => {
    //   console.log(sec)
    // })
    if (!this.is_new_tab) {
      if (this.section_list && this.section_list.length && (this.display_type == 3 || this.display_type == 6)) {
        for (let i = 0; i < this.section_list.length; i++) {
          this.step_enable[i] = true;
        }
      }
    }

    try {

      if (this.section_list && this.section_list.length && (this.display_type == 3 || this.display_type == 6)) {
        for (let i = 0; i < this.section_list.length; i++) {
          if (this.section_list[i].active_section && this.section_list[i].section_reference) {
            this.section_list[i].section_reference.selectedIndex = i;
          }
        }
      }
    }
    catch (err) {

    }

    this.step_enable[0] = true;
    if (this.section_list[0])
      this.section_list[0].enable = true;
    console.log(this.step_enable);

    this.prepareSections();


  }

  ngOnChanges(ev) {

    console.log('form', ev)
    if (ev.section_list) {
      this.prepareSections();
    }
  }

  ngOnDestroy() {

  }

  ngAfterViewInit() {
    addSectionReference(this.sec_reference, this.section_list)
    console.log();
    if (this.summaries && this.summaries.length) {
      Window["DynamicFormComponent"] = this;
    }
  }
  multipleSections() {

  }

  evalFunction(section, dynamic_form, fn_name, parent_form, command?, parent_functions?) {
    try {
      console.log(this.parent_functions);
      console.log(parent_functions);

      if (fn_name) {
        if (fn_name.indexOf('(') > -1)
          eval(fn_name)
        else {
          eval(fn_name + '(section)')
        }
      }
    }
    catch (ex) {
      console.log(ex)
    }
  }

  stepperChanged(ev) {
    let index = (ev && ev.selectedIndex != null && ev.selectedIndex != undefined) ? ev.selectedIndex : ev.index
    this.setActiveSection(index)
  }

  setActiveSection(ind) {
    try {
      for (let i of this.section_list) {
        i.active_section = 0;
      }
      this.active = ind;
      this.section_list[ind].active_section = 1;
    }
    catch (err) {

    }
  }

  setStepperIndex(ind) {
    setTimeout(() => {
      try {
        this.stepper.selectedIndex = ind;
      }
      catch (err) {

      }
    })
  }

  prepareSections() {
    let sections = jsonParse(this.section_list);
    if (sections && typeof sections == 'object') {
      for (let ind = 0; ind < sections.length; ind++) {
        if (sections[ind] && typeof (sections[ind]) == 'object' && sections[ind].field_details && jsonParse(sections[ind].field_details) && jsonParse(sections[ind].field_details).length) {
          sections[ind].field_details = jsonParse(sections[ind].field_details);
          this.fields[ind] = sections[ind].field_details;
        }
        sections[ind].grid_layout = jsonParse(sections[ind].grid_layout) || [];
        if (sections[ind].grid_layout) {
          sections[ind].grid_layout.grid_definition = jsonParse(sections[ind].grid_layout.grid_definition) || [];
        }
        if (this.dynamic_form && !this.dynamic_form.get([sections[ind].section_id])) {
          let section_form = this.fb.group({});
          if (this.fields[ind]) {
            let fields = this.fields[ind];
            fields.forEach(field => {
              section_form.addControl(field.field_name, this.fb.control(null, [
                Validators.minLength(field.min_length || 1),
                // Validators.maxLength(field.max_length == 0 ? null : field.max_length),
                Validators.pattern(field.pattern),
                Validators.min(field.min_value)
                // Validators.max(field.max_value == 0 ? null : field.max_value)
              ]))
              if (field.max_length) {
                section_form.get(field.field_name).setValidators([Validators.maxLength(field.max_length)]);
                section_form.get(field.field_name).updateValueAndValidity();
              }
              if (field.max_value) {
                section_form.get(field.field_name).setValidators([Validators.max(field.max_value)]);
                section_form.get(field.field_name).updateValueAndValidity()
              }

              if (field.mandatory_flag) {
                section_form.get(field.field_name).setValidators([Validators.required]);
              }

              if (field.pattern && field.pattern != '') {
                section_form.get(field.field_name).setValidators([Validators.pattern('/' + field.pattern + '/')]);
              }
            });
          }

          if (this.dynamic_form && this.dynamic_form.addControl) {
            if (sections[ind].multiple) {
              this.dynamic_form.addControl(sections[ind].section_id, this.fb.control([]));
              sections[ind].multiple_form = new FormGroup(section_form.controls);
              sections[ind].multiple_form.addControl('random_id', new FormControl());
            }
            else {
              this.dynamic_form.addControl(sections[ind].section_id, section_form);
            }


          }
        }
      }
    }
    this.checkActiveSection(this.section_list);
    // this.cdRef.detectChanges();
  }

  checkActiveSection(sections) {
    let found_selected_index = 0;
    sections = jsonParse(sections);
    for (let ind = 0; ind < sections.length; ind++) {
      if (sections[ind].active_section) {
        if (this.display_type == 3) {
          this.setStepperIndex(ind);
        }
        else {
          this.setActiveSection(ind);
        }
        found_selected_index = 1;
      }
    }

    if (!found_selected_index) {
      if (this.display_type == 3) {
        this.setStepperIndex(0);
      }
      sections[0].active_section = 1;
    }
  }

  // isJson(str) {
  //   try {
  //     JSON.parse(str);
  //   }
  //   catch (e) {
  //     return str;
  //   }
  //   return JSON.parse(str);
  // }


  // multipleCellClicked(ev) {
  //   this.CellClicked(ev);

  // }

  cellClicked(ev?, section?, form_group?) {

    if (ev.func == 'edit') {
      this[ev.func](ev, section, form_group);
    }
    else {
      this.parentCellClicked(ev);
    }
  }

  openModal(fields, form, all_data) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { fields: fields, form: form, allData: all_data };
    dialogConfig.autoFocus = true;
    dialogConfig.height = '100%';
    dialogConfig.width = '80%';
    dialogConfig.disableClose = true;
    // this.dialog.open(DynamicSectionModalComponent, dialogConfig).afterClosed().subscribe(data => {

    // });
  }

  setSectionVerticleNavbar(i, form) {
    this.setActiveSection(i);
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  response(e) {

    this.SendValue.emit(e);
  }

  enableSave(section) {
    section.hide_multiple_form = 0;

    section.edit_flag = 1;
    section.sections = jsonParse(section.sections);
    if (section.sections && section.sections.length) {
      section.sections = jsonParse(section.sections);
      section.sections.forEach((sec) => {

        this.enableSave(sec);
      })
    }

    // this.cdRef.detectChanges();
    return;
    // if (data && (data.edit_flag || data.data)) {
    //   form.patchValue(data.data[0]);

    // }
  }

  removeMultipleForm(section) {

    let new_obj = new Object();
    if (section && typeof section == 'object' && section.length == undefined) {
      for (let i = 0; i < Object.keys(section).length; i++) {
        let prop = Object.keys(section)[i];
        if (prop != 'multiple_form' && prop != 'sections' && prop != 'section_reference' && prop != 'parent_section') {
          new_obj[prop] = jsonParse(section[prop]);
        }
      }
    }

    if (section.sections) {
      new_obj['sections'] = [];
      section.sections.forEach((sec, i) => {
        new_obj['sections'][i] = this.removeMultipleForm(sec);
      })
    }

    return new_obj;

    // delete (section.multiple_form);
    section.multiple_form = null;
    section.sections = jsonParse(section.sections);

    if (section.sections && section.sections.length) {

      section.sections = jsonParse(section.sections);
      section.sections.forEach((sec) => {


        return this.removeMultipleForm(sec);
      })
    }

    // this.cdRef.detectChanges();
    return section;
    // if (data && (data.edit_flag || data.data)) {
    //   form.patchValue(data.data[0]);

    // }
  }

  cancel(section, form, display_type, parent_section) {
    if (display_type && (display_type == 2 || display_type == 3 || display_type == 6) && parent_section) {
      cancel(parent_section, form, this.t_id, 0);
    }
    cancel(section, form, this.t_id, 0);


    // if(this.onClose && !this.t_id ){
    //   this.onClose.emit();
    // }
    //   // this.cdRef.detectChanges();
    // if (this.t_id) {
    //   section.edit_flag = 0;
    //   section.sections = jsonParse(section.sections);

    //   if (section.sections && section.sections.length) {

    //     section.sections = jsonParse(section.sections);
    //     section.sections.forEach((sec) => {
    //       return this.cancel(sec);
    //     })
    //   }


    //   // this.cdRef.detectChanges();
    //   // return;
    // }
    // else {
    //   if (this.dynamic_form.get([section.section_id]) && this.dynamic_form.get([section.section_id]).reset()) {
    //     this.dynamic_form.get([section.section_id]).reset();
    //   }
    // }
    // if (this.dialog_ref) { //for popup close

    //   this.onClose.emit()
    // }
  }


  prepareSection(sections) {
    if (sections) {
      sections = jsonParse(sections);
      if (sections.length) {
        sections.forEach(section => {

          if (!this.t_id) {
            section.edit_flag = 1;
          }

          return this.prepareSection(section);
        });
      }
      if (sections.sections) {
        return this.prepareSection(sections.sections);
      }
    }
    return;
  }

  dynamicFormSave(section_list, form_group, next_section, index?) {
    //if section supports multiple and api url is present or if section is not multiple
    //data has to be sent to backend for saving

    let random_id = Math.floor(Date.now() + Math.random() * 1000)
    let unique_value_found = 0;
    if (form_group.valid) {
      //if section is not multiple
      if (section_list && ((section_list.multiple && section_list.save_api_url != '') || !section_list.multiple)) {
        let processed_section_list = new Object();
        for (let i = 0; i < Object.keys(section_list).length; i++) {
          if (typeof section_list[Object.keys(section_list)[i]] == "object" && section_list[Object.keys(section_list)[i]].length >= 0) {
            processed_section_list[Object.keys(section_list)[i]] = cloneArray(section_list[Object.keys(section_list)[i]]);
          }
          else if (typeof section_list[Object.keys(section_list)[i]] == "object") {
            processed_section_list[Object.keys(section_list)[i]] = Object.assign({}, section_list[Object.keys(section_list)[i]]);
          }
          else {
            processed_section_list[Object.keys(section_list)[i]] = section_list[Object.keys(section_list)[i]];
          }
        }
        // processed_section_list = Object.assign({}, section_list);

        if (processed_section_list && processed_section_list['section_id'] && form_group) {
          if (!processed_section_list['multiple_form']) {
            processed_section_list['data'] = [Object.assign({}, this.dynamic_form.get([section_list.section_id]).value)];
          }
          else {
            let section_form = Object.assign({}, processed_section_list['multiple_form']);
            let form_value_arr = cloneArray(this.dynamic_form.get([processed_section_list['section_id']]).value) || [];
            form_value_arr.push(Object.assign({}, section_form.value));
            this.dynamic_form.get([processed_section_list['section_id']]).setValue(cloneArray(form_value_arr));

            //setting value in sections array
            processed_section_list['data'] = [];
            // if (!(processed_section_list['data'] && typeof processed_section_list['data'] == 'object' && processed_section_list['data']['length'] >= 0)) {
            //   processed_section_list['data'] = [];
            // }
            processed_section_list['data'].push(Object.assign({}, section_form.value));
          }
        }
        processed_section_list['sections'] = this.multiSectionDataSave(processed_section_list['sections'], form_group);
        // delete (processed_section_list.multiple_form);
        let new_final = this.removeMultipleForm(processed_section_list);

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
          section_data_value = [form_group.value];
        }
        else {
          section_data_value = form_group.value;
        }


        this.dynamic_svc.apiCall('post', environment.SERVER_URL + new_final['save_api_url'], { sections: [new_final], data: this.dynamic_form.value, section_data: section_data_value, section_id: new_final['section_id'], t_id: this.t_id }, this.other_data || null).subscribe(resData => { //
          let last_step_flag;

          if (resData && resData && resData['id']) {
            if (!this.t_id) {
              this.t_id = resData['id'];
              this.sharing_data['t_id'] = this.t_id;
            }

            try {
              this.step_enable[this.sec_reference.selectedIndex || 0] = true;
              if (section_list && section_list[index] && section_list[index + 1])
                this.section_list[index + 1].enable = true;

              if (this.display_type == 3) {
                if (this.stepper && this.section_list) {
                  console.log(this.stepper.selectedIndex);
                  last_step_flag = this.stepper.selectedIndex == this.section_list.length - 1 || false;
                }
                this.stepper.next();
                console.log(this.stepper.selectedIndex);
              }
            }
            catch (err) { }

            if (next_section) {
              this.nextSection(section_list);
              setTimeout(() => {
                this.step_enable[this.sec_reference.selectedIndex || 0] = true;
                if (this.section_list && this.section_list[index] && this.section_list[index + 1])
                  this.section_list[index + 1].enable = true;
              })
              console.log(this.step_enable);
            }

            if (section_list.multiple) {
              form_group.reset();
              try {
                setDefaultValue(section_list, form_group);
              }
              catch (err) {

              }
            }
            this.enableSave(section_list);

          }

          if (resData && resData['status']) {
            if (section_list.multiple) {
              form_group.reset();
            }
          }


          this.dataSaved(this.t_id, resData, last_step_flag, section_list);
          this.display_table = 0;



          setTimeout(() => {
            this.display_table = 1;
          })
          this.notification_svc.snackbar(resData['message'], 'Close', 5000);

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
        this.display_table = 0;
        unique_value_found = this.uniqueCheck(section_list, section_form);
        //flow while editing existing record
        if (!unique_value_found) {
          if (section_form.value.t_id || section_form.value.random_id) {
            //setting value in sections array
            for (let i = 0; i < section_list.data.length; i++) {
              if ((section_list.data[i].t_id == section_form.value.t_id) && section_form.value.t_id) {
                let obj = Object.assign({}, section_form.value);
                obj = JSON.parse(JSON.stringify(obj))
                section_list.data[i] = obj;
              }
              else if ((section_list.data[i].random_id == section_form.value.random_id) && section_form.value.random_id) {
                let obj = Object.assign({}, section_form.value);
                obj = JSON.parse(JSON.stringify(obj))
                section_list.data[i] = obj;
              }
            }

            //setting value for section_data obj.
            let found_in_form_group = 0;
            for (let i = 0; i < this.dynamic_form.get([section_list.section_id]).value.length; i++) {
              if (this.dynamic_form.get([section_list.section_id]).value[i].t_id && this.dynamic_form.get([section_list.section_id]).value[i].t_id == section_form.value.t_id) {
                let form_value_arr = cloneArray(this.dynamic_form.get([section_list.section_id]).value);
                let obj = Object.assign({}, section_form.value);
                obj = JSON.parse(JSON.stringify(obj))
                form_value_arr[i] = obj;
                this.dynamic_form.get([section_list.section_id]).patchValue(form_value_arr);
                found_in_form_group = 1;
              }
              else if (this.dynamic_form.get([section_list.section_id]).value[i].random_id && this.dynamic_form.get([section_list.section_id]).value[i].random_id == section_form.value.random_id) {
                let form_value_arr = cloneArray(this.dynamic_form.get([section_list.section_id]).value);
                let obj = Object.assign({}, section_form.value);
                obj = JSON.parse(JSON.stringify(obj))
                form_value_arr[i] = obj;
                this.dynamic_form.get([section_list.section_id]).patchValue(form_value_arr);
                found_in_form_group = 1;
              }
            }
            if (!found_in_form_group) {
              let form_value_arr = cloneArray(this.dynamic_form.get([section_list.section_id]).value);
              let obj = Object.assign({}, section_form.value);
              obj = JSON.parse(JSON.stringify(obj))
              form_value_arr.push(obj);
              this.dynamic_form.get([section_list.section_id]).patchValue(form_value_arr);
            }
          }
          //flow while adding a new record
          else {
            if (!(this.edit_obj && this.edit_obj.index && (section_form.value.t_id || section_form.value.random_id))) {
              //setting value for section_data obj.
              //setting value in sections array
              if (!unique_value_found) {
                let form_value_arr = cloneArray(this.dynamic_form.get([section_list.section_id]).value) || [];
                section_form.patchValue({ random_id: random_id })
                let section_form_value = Object.assign({}, section_form.value);
                section_form_value = JSON.parse(JSON.stringify(section_form_value))
                form_value_arr.push(section_form_value);
                this.dynamic_form.get([section_list.section_id]).patchValue(form_value_arr);
                let obj = Object.assign({}, section_form.value);
                obj = JSON.parse(JSON.stringify(obj))
                if (section_list && section_list.data && typeof section_list.data == 'object') {
                  section_list.data.push(obj);
                }
                else {
                  section_list.data = [];
                  section_list.data.push(obj);
                }
              }
            }
            else {
              let form_value_arr = (this.dynamic_form.get([section_list.section_id]).value) || [];
            }
          }
        }
        if (!unique_value_found) {
          section_form.reset();
          setDefaultValue(section_list, section_form)

        }

        // if (unique_value_found) {
        //   // let obj = Object.assign({},section_form.value);
        //   // obj = JSON.parse(JSON.stringify(obj))  
        //   // section_form.reset();
        //   // section_form.patchValue(obj)
        // }

        setTimeout(() => {
          this.display_table = 1;
        })
      }
    }
    else {
      // this.notification_svc.snackbar("Please enter correct values!", "Cancel", 3000)
      console.log(form_group);
      this.markFormGroupTouched(form_group);
      let invalid_controls = findInvalidControls(form_group, section_list, this.translate, this.notification_svc);
    }
  }



  uniqueCheck(section_list, section_form) {
    let unique_value_found = 0;
    let field_name;
    if (section_list.field_details) {
      for (let i = 0; i < (section_list.field_details).length; i++) {
        let field = section_list.field_details[i];
        if (field.is_unique) { //field.unique
          for (let j = 0; j < (section_list.data).length; j++) {
            let section_data = Object.assign({}, section_list.data[j]);
            //Unique check for existing value
            if (section_form.value.t_id || section_form.value.random_id) {
              // if (section_form.value.t_id && (section_data.t_id == section_form.value.t_id)) {
              for (let k = 0; k < (section_list.data).length; k++) {
                if ((section_list.data)[k].t_id) {
                  if (((section_list.data)[k].t_id != section_form.value.t_id)) {
                    if ((section_list.data)[k][field.field_name] == section_form.value[field.field_name]) {
                      unique_value_found = 1;
                      field_name = field;
                      this.translate.get(field_name.module_code + '_' + field_name.sub_module_code + '_' + field_name.form_code + '_' + field_name.label_code).subscribe(res => {
                        this.notification_svc.snackbar("An entry exists with the same " + res, "Cancel", 3000)
                      })
                      return unique_value_found;
                    }
                  }
                }
                else {
                  if (((section_list.data)[k].random_id != section_form.value.random_id)) {
                    if ((section_list.data)[k][field.field_name] == section_form.value[field.field_name]) {
                      unique_value_found = 1;
                      field_name = field;
                      this.translate.get(field_name.module_code + '_' + field_name.sub_module_code + '_' + field_name.form_code + '_' + field_name.label_code).subscribe(res => {
                        this.notification_svc.snackbar("An entry exists with the same " + res, "Cancel", 3000)
                      })
                      return unique_value_found;
                    }
                  }
                }
              }
              // }

            }

            //Unique check for existing value
            // else if (cc) {
            //   if ((section_data.random_id == section_form.value.random_id)) {
            //     for (let k = 0; k < (section_list.data).length; k++) {
            //       if ((section_data.random_id != section_form.value.random_id)) {
            //         if ((section_list.data)[k][field.field_name] == section_form.value[field.field_name]) {
            //           unique_value_found = 1;
            //           field_name = field;
            //           this.translate.get(field_name.module_code + '_' + field_name.sub_module_code + '_' + field_name.form_code + '_' + field_name.label_code).subscribe(res => {
            //             this.notification_svc.snackbar("An entry exists with the same " + res, "Cancel", 3000)
            //           })
            //           return unique_value_found;
            //         }
            //       }
            //     }
            //   }
            // }

            //Unique check for new value
            else {
              if (section_data[field.field_name] == section_form.value[field.field_name]) {
                unique_value_found = 1;
                field_name = field;
              }
            }
          }
        }
      }
    }

    if (unique_value_found) {
      this.translate.get(field_name.module_code + '_' + field_name.sub_module_code + '_' + field_name.form_code + '_' + field_name.label_code).subscribe(res => {
        this.notification_svc.snackbar("An entry exists with the same " + res, "Cancel", 3000)
      })
    }

    return unique_value_found
  }

  multiSectionDataSave(sections, form_group) {


    // let processed_sections = [];
    sections = jsonParse(sections);
    if (sections && sections.length) {

      for (let i = 0; i < sections.length; i++) {
        if (form_group && sections[i].section_id && form_group.get([sections[i].section_id])) {
          // form_group.get([sections[i].section_id]).setValue(sections[i].data);
          sections[i].data = [Object.assign({}, form_group.get([sections[i].section_id]).value)];
          // sections[i] = this.deleteMultipleSection(sections[i])
        }
        else {
          return this.multiSectionDataSave(sections[i].sections, form_group);
        }

      }

      // sections.forEach(section => {
      //   if (form_group && section.section_id && form_group.get([section.section_id])) {
      //     section.data = form_group.get([section.section_id]).value;

      //     // let processed_section = Object.assign({}, section);
      //     // delete (processed_section.multiple_form);
      //     // processed_sections.push(processed_section);

      //   }
      //   if (section.sections) {
      //     return this.multiSectionDataSave(section.sections, form_group);
      //   }
      // });
      return sections;
    }
    else {
      return sections;
    }
  }

  handleHTMLTextEditor(fields, data) {
    fields.forEach(field => {
      if (field.control_type_id == 17 || field.control_type_id == 16) {
        data[field.field_name] = encodeURIComponent(data[field.field_name]);
      }
    });
  }

  deleteMultipleSection(section) {
    // let processed_section;
    if (section && typeof section == "object" && section.length) {
      for (let i = 0; i < section.length; i++) {
        delete (section[i].multiple_form);
        delete (section[i].parent_section);
        if (section[i].sections) {
          return this.deleteMultipleSection(section[i].sections);
        }
      }
    }
    else {
      section.multiple_form = null;
      section.parent_section = null;

      if (section.sections) {
        return this.deleteMultipleSection(section.sections)
      }
    }


    return section;
  }
  nextSection(section) {
    console.log(this.section_data)
    nextSection(section, this.section_list, this.section_data);
    console.log()

    if (section.section_reference) {

    }
  }

  edit(ev, section, form_group) {
    let obj = Object.assign({}, form_group.value);
    let random_id = Math.floor(Date.now() + Math.random() * 1000);
    enableSave(section);
    this.display_table = 0;
    form_group.reset()
    setTimeout(() => {
      form_group.patchValue(jsonParse(ev.data));
      if (!(jsonParse(ev.data).t_id || jsonParse(ev.data).random_id)) {
        form_group.patchValue({ random_id: random_id });
        ev.data.random_id = random_id;
      }
      this.edit_obj.index = section.data.indexOf(ev.data);
      this.edit_obj.section = section;
      this.edit_obj.id = new Date() + '_' + Math.random() * 1000
      // section.data.splice(section.data.indexOf(ev.data), 1);

      // if (!(jsonParse(ev.data).t_id || jsonParse(ev.data).random_id)) {
      //   section.data.splice(section.data.indexOf(ev.data), 1);
      // }
      this.display_table = 1;

      // Not Working, team edit

    }, 100)
  }

  enableMultipleForm(section, form_group) {
    form_group.reset();
    try {
      setDefaultValue(section, form_group);
    }
    catch (err) {
    }
    this.enableSave(section);
  }

  markAllAsValidFields() {
    this.section_data.forEach(section => {
      section.field_details.forEach(field => {
        field.verification_status = 1;
      });
    });
  }
}

@Pipe({
  name: 'DynamicSectionConditionCheckPipe'
})
export class DynamicSectionConditionCheckPipe implements PipeTransform {
  transform(form_val: any, conditions, section_id?, parent_form?, form?): boolean {
    try {
      console.log(conditions)
      if (form_val) {
        let form_value = form_val;
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
            let final_value;
            conditions.forEach((condition) => {
              final_value = JSON.parse(JSON.stringify(form_value));
              let str;
              if (condition.condition) {
                // condition.condition = jsonParse(condition.condition);
                try {
                  if (eval(condition.condition)) {
                    status = true;
                  } else {
                    status = false;
                  }
                }
                catch (err) {
                  status = true;
                }

              }
              else {
                if ((condition.section && condition.section != '') || (condition.section_id && condition.section_id != '')) {
                  condition.section = condition.section || condition.section_id;
                  condition.section = condition.section.replace(/\./g, '"]["')
                  str = 'final_value["' + (condition.section || '') + '"]["' + condition.field + '"]'
                }
                else {
                  str = form_value[condition.field] && form_value[condition.field] != '' ? form_value[condition.field] : null;
                }

                if (eval(((str || null) + condition.operator + condition.value))) {
                  status = true;
                }
                else {
                  if (form_value && form_value.length) {
                    form_value.forEach(form => {

                      if (condition.field) {
                        str = 'form["' + (condition.section || '') + '"]["' + condition.field + '"]'
                      }
                      else {
                        str = form[condition.field] && form[condition.field] != '' ? form[condition.field] : null;
                      }


                      if (eval(((form[condition.field] && form[condition.field] != '' ? form[condition.field] : null) + condition.operator + condition.value))) {
                        status = true;
                      }
                      else {
                        status = false;
                      }
                    });
                  }
                  else {
                    status = false;
                  }
                }
              }
            })
          }
          return status;
        }
        catch (err) {

          return true;
        }
      }
      else {
        return true;
      }
    }
    catch (err) {
      console.log(err);
      return true;
    }
  }
}

@Pipe({
  name: 'FetchColumnsFromFields'
})
export class FetchColumnsFromFields {
  constructor(private translate: TranslateService) { }
  transform(field_details: any[]) {
    let columns = [];
    try {
      for (let i = 0; i < field_details.length; i++) {
        if (field_details[i].visibility && field_details[i].label_code) {
          let obj = {
            label_code: field_details[i].module_code + '_' + field_details[i].sub_module_code + '_' + field_details[i].form_code + '_' + field_details[i].label_code,
            property: field_details[i].field_name,
            // data_type: this.getDataType(field_details[i])
          }
          columns.push(obj);
        }
      }

      return columns;
    }
    catch (err) {
      return columns;
    }
  }

  // getDataType(field_details) {

  //   switch (field_details.control_type_id) {

  //     case 1:
  //       return 'number'

  //     case 3:
  //       return 'number'

  //     case 9:
  //       return 'date';

  //     case 10:
  //       return 'datetime';

  //     case 16:
  //       return '';

  //     case 18:
  //       return '';

  //     case 20:
  //       return 'varbinary';

  //     case 21:
  //       return 'varbinary';

  //     default:
  //       return ''
  //   }
  // }
}

@Pipe({
  name: 'HideOption',
  pure: true
})
export class HideOption implements PipeTransform {
  transform(options: any[]) {
    console.log(options);
    try {
      let opts = [];
      for (let i = 0; i < options.length; i++) {
        if (options && options[i] && !options[i].hidden) {
          opts.push(JSON.parse(JSON.stringify(options[i])));
        }
      }
      return opts;
    }
    catch (err) {
      return options;
    }
  }
}


@Pipe({
  name: 'DynamicFieldsMasterTitle'
})
export class DynamicFieldsMasterTitle implements PipeTransform {
  transform(all_data: any, all_masters: any[], fields: any[]): Array<any> {
    let new_data = cloneArray(all_data);
    for (let h = 0; h < new_data.length; h++) {
      let data = new_data[h];
      if (fields) {
        for (let i = 0; i < fields.length; i++) {
          let code = data[fields[i].field_name];
          code = jsonParse(code);
          let masters = all_masters[fields[i].master_prop_name];

          if (code && masters && (masters.length || masters['data'])) {
            let master_array = [];
            master_array = masters['data'] ? masters['data'] : masters;
            if (typeof code != 'object') {
              let out_str;
              master_array.forEach(master => {
                if (master.code && code == master.code) {
                  out_str = master.title || '';
                  return;
                }
              })
              data[fields[i].field_name] = out_str;
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

              data[fields[i].field_name] = out_str.toString();
            }
          }


          // else {
          //   return [];
          // }
        }
      }
      else {

      }
    }
    return new_data;
  }
}

@Pipe({
  name: 'DynamicFieldsMasterTitleTable'
})

export class DynamicFieldsMasterTitleTable implements PipeTransform {
  constructor(
    private translate_pipe: TranslateService,
    private html_formatter: HTMLFormatter,
  ) { }

  transform(all_data: any, all_masters: any[], fields: any[]): Array<any> {
    let new_data = cloneArray(all_data);
    for (let h = 0; h < new_data.length; h++) {
      let processed_data = new Object();
      let data = new_data[h];
      processed_data = Object.assign({}, data);
      if (fields) {
        for (let i = 0; i < fields.length; i++) {
          let code = data[fields[i].field_name];
          code = jsonParse(code);
          let masters = all_masters[fields[i].master_prop_name];

          if (code && masters && (masters.length || masters['data'])) {
            let master_array = [];
            master_array = masters['data'] ? masters['data'] : masters;
            if (typeof code != 'object') {
              let out_str;
              let found = false;
              master_array.forEach(master => {
                if (master.code && code == master.code && !found) {
                  out_str = master.title || '';
                  Object.keys(master).forEach(key => {
                    if (key.indexOf('child_') > -1) {
                      all_masters[key] = jsonParse(master[key]);
                    }
                  })
                  found = true;
                }
              })
              processed_data[fields[i].field_name] = out_str || '';
            }
            else if (typeof code == 'object' && code.length) {
              let out_str = [];
              code.forEach(c => {
                master_array.forEach(master => {
                  if (master.code && c == master.code) {
                    if (out_str) {
                      out_str.push(master.title || '');
                    }
                    Object.keys(master).forEach(key => {
                      if (key.indexOf('child_') > -1) {
                        all_masters[key] = jsonParse(master[key]);
                      }
                    })
                    return;
                  }
                })
              })

              processed_data[fields[i].field_name] = out_str.toString() || '';
            }

          }
          else {
            if (fields[i].control_type_id == 12) {
              processed_data[fields[i].field_name] = code ?
                fields[i].checkbox_true_label && fields[i].checkbox_true_label != '' ? this.html_formatter.transform(this.translate_pipe.get(fields[i].module_code + '_' + fields[i].sub_module_code + '_' + fields[i].form_code + '_' + fields[i].checkbox_true_label)['value']) : 'Yes'
                :
                fields[i].checkbox_false_label && fields[i].checkbox_false_label != '' ? this.html_formatter.transform(this.translate_pipe.get(fields[i].module_code + '_' + fields[i].sub_module_code + '_' + fields[i].form_code + '_' + fields[i].checkbox_false_label)['value']) : 'No';
            }
            else {
              processed_data[fields[i].field_name] = code || '';
            }
          }
          // else {
          //   return [];
          // }
        }
      }
      else {
        processed_data = null;
      }
      new_data[h].processed_data = processed_data;
    }

    return new_data;
  }
}

@Pipe({
  name: 'JSONParser'
})
export class JSONParser implements PipeTransform {
  transform(input: any): any {

    return jsonParse(input);
  }
}

@Pipe({
  name: 'JSONParserAssign'
})
export class JSONParserAssign implements PipeTransform {
  transform(input: any): any {
    input = jsonParse(input);
    console.log(input);
    return input;
  }
}



@Pipe({
  name: 'HTMLFormatter'
})
export class HTMLFormatter implements PipeTransform {
  transform(input, flag?) {
    if (input) {
      try {
        let a = decodeURIComponent(input)
        input = a;
        console.log(input, decodeURIComponent(input))
      }
      catch (err) {
        console.log(err)
        input = input;

      }
      let out_str = (' ' + input).slice(1);
      try {
        out_str = out_str.replace(/&nbsp;/g, ' ');
        out_str = out_str.replace(/nbsp;/g, ' ');
        out_str = out_str.replace(/&amp;/g, '');
        out_str = out_str.replace(/amp;/g, '');
        if (flag) {
          out_str = out_str.replace(/\<[a-z]{1,6}\>/g, '');
          out_str = out_str.replace(/<\/[a-z]{1,6}>/g, '');
        }
      }
      catch (err) {
        out_str = input;
      }
      return out_str;
    }
  }
}




export const special_keys = [
  8,
  9,
  13,
  16,
  17,
  18,
  19,
  20,
  27,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
  45,
  46,
  91,
  92,
  144,
  145,
  112,
  113,
  114,
  115,
  116,
  117,
  118,
  119,
  120,
  121,
  122,
  123
];

const length_validation_controls = [
  2,  // Text
  3,  // Number
  5,  // Email
  6,  // Password
  16, // Textarea
  21  // Phonenumber
];

const value_validation_controls = [
  3, //Number
  // 9, //Date
  // 10 //Date time
]


export function prepareSections(sections, form, section_data, t_id, form_builder, display_type, virtual_scroll_fields?, common_section_data?, parent_section?) {
  sections = jsonParse(sections);
  common_section_data = jsonParse(common_section_data);

  if (sections && typeof sections == 'object') {
    for (let ind = 0; ind < sections.length; ind++) {

      if (parent_section) {
        sections[ind].parent_section = parent_section;
      }

      console.log(t_id);
      if (!t_id) {
        sections[ind].edit_flag = 1;
      }
      else {
        sections[ind].edit_flag = 0;
      }

      if (sections[ind] && typeof (sections[ind]) == 'object' && sections[ind].field_details && jsonParse(sections[ind].field_details) && jsonParse(sections[ind].field_details).length) {
        sections[ind].field_details = jsonParse(sections[ind].field_details);
      }

      sections[ind].grid_layout = jsonParse(sections[ind].grid_layout) || [];
      if (sections[ind].grid_layout) {
        sections[ind].grid_layout.grid_definition = jsonParse(sections[ind].grid_layout.grid_definition) || [];
      }
      let section_form = form_builder.group({});

      if (sections[ind].field_details && typeof sections[ind].field_details == 'object' && sections[ind].field_details.length) {
        let fields = sections[ind].field_details;
        if (fields) {
          fields.forEach(field => {
            section_form.addControl(field.field_name, form_builder.control());
            try {
              field.child_fields = jsonParse(field.child_fields) || [];
            }
            catch (err) {
              field.child_fields = [];
            }
            field.child_fields.forEach(element => {
              section_form.addControl(element.field_name, form_builder.control());
            });

            try {
              if (field.default_value) {
                let value;
                try {
                  value = eval(field.default_value);
                }
                catch (err) {
                  value = field.default_value;
                }
                section_form.get(field.field_name).patchValue(value);
              }
            }
            catch (err) {

            }
            try {
              setValidators(field, section_form);
            }
            catch (err) { }
          });
        }
      }

      if (form) {
        if (sections[ind].multiple) {
          form.addControl(sections[ind].section_id, form_builder.control([]));
          sections[ind].multiple_form = new FormGroup(section_form.controls);
          sections[ind].multiple_form.addControl('random_id', new FormControl(null));
          try {
            if ((sections[ind].data && jsonParse(sections[ind].data) && jsonParse(sections[ind].data).length) || (common_section_data && Object.keys(common_section_data) && Object.keys(common_section_data).length && jsonParse(common_section_data[sections[ind].section_id]).length)) {
              let data;
              if (common_section_data && Object.keys(common_section_data) && Object.keys(common_section_data).length) {
                data = jsonParse(common_section_data[sections[ind].section_id]);
                sections[ind].data = jsonParse(common_section_data[sections[ind].section_id])
              }
              else {
                data = jsonParse(sections[ind].data);
                sections[ind].data = jsonParse(sections[ind].data)
              }

              data.forEach(element => {
                console.log(element);
                let fields = sections[ind].field_details;
                fields.forEach(field => {
                  console.log(fields);
                  if (field.enable_virtual_scroll && virtual_scroll_fields) {
                    let obj = {
                      master_id: field.master_table_id
                    };
                    // console.log(sections[ind].element, sections[ind].element[field.field_name])
                    // if (sections[ind] && sections[ind].element[field.field_name]) {
                    if (field.control_type_id == 7 && element[field.field_name]) {
                      if (!virtual_scroll_fields[field.master_table_id]) {
                        element[field.field_name] = jsonParse(element[field.field_name])
                        virtual_scroll_fields[field.master_table_id] = [element[field.field_name]];
                      }
                      else {
                        element[field.field_name] = jsonParse(element[field.field_name])

                        virtual_scroll_fields[field.master_table_id] = [...virtual_scroll_fields[field.master_table_id], ...element[field.field_name]];
                      }
                    }
                    else if (field.control_type_id == 8) { // sections[ind].element[field.field_name] && jsonParse(sections[ind].element[field.field_name]) && jsonParse(sections[ind].element[field.field_name]).length
                      if (!virtual_scroll_fields[field.master_table_id]) {
                        element[field.field_name] = jsonParse(element[field.field_name])
                        virtual_scroll_fields[field.master_table_id] = jsonParse(element[field.field_name]);
                      }
                      else {
                        element[field.field_name] = jsonParse(element[field.field_name])
                        virtual_scroll_fields[field.master_table_id] = [...virtual_scroll_fields[field.master_table_id], ...element[field.field_name]];
                      }
                      // obj['values'] = jsonParse(sections[ind].data[0][field.field_name]);
                    }
                    // }
                  }
                });
              });
            }
          }
          catch (err) {
            console.log(err);
          }

        }
        else {
          try {
            if (sections[ind].data || common_section_data) {
              if (common_section_data && Object.keys(common_section_data) && Object.keys(common_section_data).length) {
                sections[ind].data = jsonParse(common_section_data[sections[ind].section_id]);
              }
              else {
                sections[ind].data = jsonParse(sections[ind].data);
              }
              if (sections[ind].data[0]) {
                if (sections[ind].field_details && typeof sections[ind].field_details == 'object' && sections[ind].field_details.length) {
                  let fields = sections[ind].field_details;
                  if (fields) {
                    fields.forEach(field => {
                      if (field.control_type_id == 8) {
                        console.log(sections[ind].data[0][field.field_name]);
                        if (typeof sections[ind].data[0][field.field_name] == 'string')
                          sections[ind].data[0][field.field_name] = jsonParse(sections[ind].data[0][field.field_name]);
                      }

                      if (field.enable_virtual_scroll && virtual_scroll_fields) {
                        if (sections[ind].data[0][field.field_name]) {
                          if (field.control_type_id == 7 && sections[ind].data[0][field.field_name]) {
                            let parsed_field_val;
                            if (parseInt(sections[ind].data[0][field.field_name])) {
                              parsed_field_val = parseInt(sections[ind].data[0][field.field_name]);
                            }
                            else {
                              parsed_field_val = sections[ind].data[0][field.field_name];
                            }
                            if (!virtual_scroll_fields[field.master_table_id]) {
                              virtual_scroll_fields[field.master_table_id] = [parsed_field_val];
                            }
                            else {
                              virtual_scroll_fields[field.master_table_id] = [...virtual_scroll_fields[field.master_table_id], parsed_field_val];
                            }
                          }
                          else if (field.control_type_id == 8 && sections[ind].data[0][field.field_name] && jsonParse(sections[ind].data[0][field.field_name]) && jsonParse(sections[ind].data[0][field.field_name]).length) {
                            if (!virtual_scroll_fields[field.master_table_id]) {
                              virtual_scroll_fields[field.master_table_id] = jsonParse(sections[ind].data[0][field.field_name]);;
                            }
                            else {
                              virtual_scroll_fields[field.master_table_id] = [...virtual_scroll_fields[field.master_table_id], ...sections[ind].data[0][field.field_name]];
                            }
                            // obj['values'] = jsonParse(sections[ind].data[0][field.field_name]);
                          }
                        }
                        // virtual_scroll_fields.push(obj);
                      }
                    });
                  }
                }
                section_form.patchValue(sections[ind].data[0]);
              }
            }
            form.addControl(sections[ind].section_id, section_form);
          }
          catch (err) {

          }
        }
      }
      sections[ind].sections = jsonParse(sections[ind].sections);
      if (sections[ind].sections && sections[ind].sections.length) {
        if (sections[ind].multiple) {
          console.log(sections[ind].data);
          prepareSections(sections[ind].sections, sections[ind].multiple_form, section_data, t_id, form_builder, sections[ind].display_type_id, virtual_scroll_fields, common_section_data || null, sections[ind]);
        }
        else {
          prepareSections(sections[ind].sections, form ? form.get([sections[ind].section_id]) : null, section_data, t_id, form_builder, sections[ind].display_type_id, virtual_scroll_fields, common_section_data || null, sections[ind]);

        }
      }
    }
  }
  checkActiveSection(section_data, display_type);

  // this.cdRef.detectChanges();
}

export function setValidators(field, section_form) {
  try {
    let validators = [];
    //Min and Max length validation
    if (length_validation_controls.indexOf(field.control_type_id) > -1) {
      if (field.min_length != '' && field.min_length != null) {
        validators.push(Validators.minLength(eval(field.min_length)));
      }

      if (field.max_length != '' && field.max_length != null) {
        validators.push(Validators.maxLength(eval(field.max_length)));
      }

      if (field.final_pattern && field.final_pattern != '') {
        validators.push(Validators.pattern(field.final_pattern));
      }
    }

    //Min and Max value validation
    if (value_validation_controls.indexOf(field.control_type_id) > -1) {
      if (field.min_value != '' && field.min_value != null) {
        validators.push(Validators.min(eval(field.min_value)));
      }

      if (field.max_value != '' && field.max_value != null) {
        validators.push(Validators.max(eval(field.max_value)));
      }
    }

    // if (field.pattern != '' && field.pattern) {
    //   validators.push(Validators.pattern(field.pattern));
    // }

    if (field.mandatory_flag != '' && field.mandatory_flag) {
      validators.push(Validators.required);
    }

    try {
      if ((field.control_type_id == 9 || field.control_type_id == 10)) {
        // section_form.get(field.field_name).setValue(new Date());
        if (field.min_value && field.min_value != '') {
          try {
            field.min_value = eval(field.min_value);
          }
          catch (err) { }
        }
        if (field.max_value && field.max_value != '') {
          try {
            field.max_value = eval(field.max_value);
          }
          catch (err) { }
        }
      }
    }
    catch (err) { }

    // if (field.control_type_id == 9) {
    //   validators.push(Validators.min(new Date() as any))
    // }

    section_form.get(field.field_name).setValidators(validators);
    section_form.get(field.field_name).updateValueAndValidity();
  }
  catch (err) { }
}


export function prepareSectionData(sections, form, section_data, common_section_data?) {
  common_section_data = jsonParse(common_section_data);
  sections = jsonParse(sections);
  if (sections && typeof sections == 'object') {
    for (let ind = 0; ind < sections.length; ind++) {
      if (form) {
        let section_form = form.get([sections[ind].section_id]);
        try {
          if (common_section_data && Object.keys(common_section_data) && Object.keys(common_section_data).length) {
            sections[ind].data = jsonParse(common_section_data[sections[ind].section_id])
          }
        }
        catch (err) {

        }
        sections[ind].data = jsonParse(sections[ind].data);
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
            section_form.patchValue(sections[ind].data[0]);
          }
        }
        else {
          section_data[ind].data = sections[ind].data;
        }
        // form.addControl(sections[ind].section_id, section_form);
      }

      if (section_data[ind].grid_layout) {
        section_data[ind].grid_layout = jsonParse(sections[ind].grid_layout);
      }

      sections[ind].sections = jsonParse(sections[ind].sections);
      if (sections[ind].sections && sections[ind].sections.length) {
        try {
          if (sections[ind].multiple) {
            prepareSectionData(sections[ind].sections, sections[ind].multiple_form, section_data[ind].sections, common_section_data);
          }
          else {
            prepareSectionData(sections[ind].sections, form.get([sections[ind].section_id]), section_data[ind].sections, common_section_data);

          }
        }
        catch (err) {
          console.log(err);
        }
      }
    }
  }
}

export function setActiveSection(ind, section_data) {
  for (let i of section_data) {
    i.active_section = 0;
  }
  section_data[ind].active_section = 1;
}

export function enableSave(section) {
  section.edit_flag = 1;
  section.sections = jsonParse(section.sections);

  if (section.sections && section.sections.length) {

    section.sections = jsonParse(section.sections);
    section.sections.forEach((sec) => {
      enableSave(sec);
    })
  }
  return;
}

export function removeMultipleForm(section) {
  delete (section.multiple_form);
  delete (section.section_reference)
  delete (section.parent_section);
  section.sections = jsonParse(section.sections);

  if (section.sections && section.sections.length) {

    section.sections = jsonParse(section.sections);
    section.sections.forEach((sec) => {
      return removeMultipleForm(sec);
    })
  }

  return section;
}

export function deleteMultipleSection(section) {
  if (section && typeof section == "object" && section.length) {
    for (let i = 0; i < section.length; i++) {
      delete (section[i].multiple_form);
      delete (section[i].parent_section);
      if (section[i].sections) {
        return deleteMultipleSection(section[i].sections);
      }
    }
  }
  else {
    delete (section.multiple_form);
    delete (section.parent_section);

    if (section.sections) {
      return deleteMultipleSection(section.sections)
    }
  }
  return section;
}

export function multiSectionDataSave(sections, form_group) {
  sections = jsonParse(sections);
  if (sections && sections.length) {
    for (let i = 0; i < sections.length; i++) {
      if (form_group && sections[i].section_id && form_group.get([sections[i].section_id])) {
        sections[i].data = [Object.assign({}, form_group.get([sections[i].section_id]).value)];
      }
      else {
        return multiSectionDataSave(sections[i].sections, form_group);
      }
    }
    return sections;
  }
  else {
    return sections;
  }
}

export function enableMultipleForm(section, form_group) {
  form_group.reset();
  try {
    setDefaultValue(section, form_group);
  }
  catch (err) {
  }

  enableSave(section);
}

export function findInvalidControls(form_group, section_list, translate, notification_svc, invalid_field_subject?) {
  const invalid = [];
  if (form_group) {
    const controls = form_group.controls;
    const invalid_controls = [];
    const invalid_field = [];


    try {

      if (section_list && section_list.sections && form_group) {
        for (let i = 0; i < section_list.sections.length; i++) {
          if (form_group.get([section_list.sections[i].section_id]))
            findInvalidControls(form_group.get([section_list.sections[i].section_id]), section_list.sections[i], translate, notification_svc, invalid_field_subject);
        }
      }

    }

    catch (err) {
      console.log(err);
    }

    if (section_list && section_list.field_details) {

      if (controls && Object.keys(controls)) {
        for (const name in controls) {
          try {
            if (controls[name].invalid) {
              invalid.push(name);
              invalid_controls.push(controls[name]);
            }
          } catch (err) {

          }
        }
      }


      let found = 0;
      section_list.field_details.forEach(field => {
        if (!found) {
          if (field.field_name == invalid[0]) {
            invalid_field.push(field);
            try {

            }
            catch (err) {

            }
            translate.get(field.module_code + '_' + field.sub_module_code + '_' + field.form_code + '_' + field.label_code).subscribe(res => {
              if (invalid_controls[0] && invalid_controls[0].errors && invalid_controls[0].errors.required) {
                notification_svc.snackbar(stripHtmlTags(res) + " is mandatory", "Cancel", 3000)
              }
              else {
                notification_svc.snackbar(stripHtmlTags(res) + " is invalid", "Cancel", 3000)
              }
              found = 1;
            })
          }
        }
      })
    }

    if (invalid_field_subject && invalid_field_subject.invalid_field) {
      invalid_field_subject.triggerInvalidField(invalid_field);
    }
  }
  return invalid;
}

export function markFormGroupTouched(formGroup: FormGroup) {
  (<any>Object).values(formGroup.controls).forEach(control => {
    control.markAsTouched();
    if (control.controls) {
      markFormGroupTouched(control);
    }
  });
}

export function displayErrors(section_list, invalid_controls, translate, notification_svc) {
  let found = 0;
  if (section_list && section_list.field_details) {
    section_list.field_details.forEach(field => {
      if (!found) {
        if (field.field_name == invalid_controls[0]) {
          try {

          }
          catch (err) {

          }
          translate.get(field.module_code + '_' + field.sub_module_code + '_' + field.form_code + '_' + field.label_code).subscribe(res => {

            notification_svc.snackbar(res + " is invalid", "Cancel", 3000)
            found = 1;
          })
        }
      }
    })
  }
  if (!found) {
    notification_svc.snackbar("Form is invalid", "Cancel", 3000)
  }
}


export function cancel(section, form?, t_id?, recursion_flag?) {
  if (section.edit_flag) {
    if (form && form.reset && !t_id) {
      form.reset();
    }
    if (t_id) {
      // if (section.multiple) {
      //   // section.hide_multiple_form = 1;
      //   if (recursion_flag) {
      //     section.edit_flag = 1;
      //   }
      // }
      // else {
      section.edit_flag = 0;
      // }
      section.sections = jsonParse(section.sections);

      if (section.sections && section.sections.length) {

        section.sections = jsonParse(section.sections);
        section.sections.forEach((sec) => {
          return cancel(sec, form, t_id, 1);
        })
      }
    }
  }
}

export function readOnlyMode(section) {

  section.edit_flag = 0;
  section.sections = jsonParse(section.sections);

  if (section.sections && section.sections.length) {

    section.sections = jsonParse(section.sections);
    section.sections.forEach((sec) => {
      readOnlyMode(sec);
    })
  }
}

export function markAllAsValidFields(section, status) {
  if (section.field_details)
    section.field_details.forEach(element => {
      element.verification_status = status || 0;
    });

  if (section.sections)
    section.sections = jsonParse(section.sections);

  if (section.sections && section.sections.length) {
    section.sections = jsonParse(section.sections);
    section.sections.forEach((sec) => {
      markAllAsValidFields(sec, status);
    })
  }
}

export function sectionDataToCommonSecData(section, common_section_data) {
  if (section)
    common_section_data[section.section_id] = section.data || null;

  if (section.sections)
    section.sections = jsonParse(section.sections);

  if (section.sections && section.sections.length) {
    section.sections.forEach((sec) => {
      sectionDataToCommonSecData(sec, common_section_data);
    })
  }
}

export function checkActiveSection(sections, display_type) {
  let found_selected_index = 0;
  sections = jsonParse(sections);
  if (sections) {
    for (let ind = 0; ind < sections.length; ind++) {
      if (sections[ind].active_section) {
        if (display_type == 3) {
          // setStepperIndex(ind);
        }
        else {
          setActiveSection(ind, sections);
          checkActiveSection(sections[ind].sections, sections[ind].display_type_id);
        }
        found_selected_index = 1;
      }
    }

    if (!found_selected_index) {
      if (display_type == 3) {
        // setStepperIndex(0);
      }
      if (sections[0]) {
        sections[0].active_section = 1;
        checkActiveSection(sections[0].sections, sections[0].display_type_id);
      }
    }
  }
}

export function stripHtmlTags(str) {
  try {
    return str.replace(/(<([^>]+)>)/ig, "");
  }
  catch (err) {
    return str;
  }
}

export function setDefaultValue(section, form_group) {
  try {
    if (section && section.field_details && typeof section.field_details == 'object' && section.field_details.length && form_group && form_group.controls) {
      (section.field_details).forEach(field => {
        try {
          if (field.default_value) {
            let value;
            try {
              value = eval(field.default_value);
            }
            catch (err) {
              value = field.default_value;
            }
            if (field.field_name && form_group.get(field.field_name)) {
              form_group.get(field.field_name).patchValue(value);
            }

          }
          else {
            if (field.field_name && form_group.get(field.field_name)) {
              form_group.get(field.field_name).reset();
            }
          }

        }
        catch (err) {
          form_group.reset();
        }
      });
    }

    if (section.sections && section.sections.length) {
      section.sections = jsonParse(section.sections);
      section.sections.forEach((sec) => {
        this.setDefaultValue(sec, form_group);
      })
    }
  }
  catch (err) {

  }
}

export function nextSection(section, sections_list, sections) {
  console.log(section, sections_list);
  if (section && section.section_reference && section.section_reference.selectedIndex >= 0) {
    if (sections_list.length - 1 > section.section_reference.selectedIndex) {
      section.section_reference.selectedIndex = section.section_reference.selectedIndex + 1;
      setActiveSection(section.section_reference.selectedIndex, sections_list)
    }
    else {
      if (section && section.section_reference && section.section_reference.selectedIndex) {
        section.section_reference.selectedIndex = 0;
        setActiveSection(section.section_reference.selectedIndex, sections_list);
        cancel(section.parent_section, null, 1, 1)
      }
      // let out_array = {}
      // let parent_obj = findParentSectionObject(sections, section.parent_section_id, out_array)
      // setActiveSection(parent_obj.index + 1, parent_obj.sec_array);
      // console.log(section)
      // console.log(parent_obj)
    }
  }

}

export function addSectionReference(sec_reference, section_list) {
  if (section_list && section_list.length) {
    section_list.forEach(sec => {
      sec['section_reference'] = sec_reference;
    })
  }
  console.log(section_list)
}

export function findParentSectionObject(all_section_list, parent_id, out_array) {
  if (all_section_list && all_section_list.length && parent_id && out_array) {
    for (let i = 0; i < all_section_list.length; i++) {
      let section = all_section_list[i];
      if (section.section_id == parent_id) {
        out_array.sec_array = all_section_list;
        out_array.index = i;
        return out_array;
      }
      else if (section && section.sections) {
        out_array = findParentSectionObject(section.sections, parent_id, out_array)
      }
    }
  }
  return out_array
}

