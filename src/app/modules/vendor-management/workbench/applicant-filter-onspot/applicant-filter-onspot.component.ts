import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { WorkbenchService } from 'src/app/services/vendor-management/workbench/workbench.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { prepareSections } from 'src/app/controls/components/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-applicant-filter-onspot',
  templateUrl: './applicant-filter-onspot.component.html',
  styleUrls: ['./applicant-filter-onspot.component.scss'],
  providers: [
    WorkbenchService,

  ],

})
export class ApplicantFilterOnspotComponent implements OnInit {
  form_code: number
  filter_templates
  pre_data;
  stage_data;
  filterData
  display_type
  form_group: FormGroup
  section_data: any;
  masters: any;
  code_master;
  loading = false
  constructor(
    private change_detector: ChangeDetectorRef,
    private workbench_service: WorkbenchService,
    private dialogref: MatDialogRef<ApplicantFilterOnspotComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.form_group = new FormGroup({});
  }
  ngOnInit() {
    if (this.pre_data && this.pre_data) {


      this.section_data = this.pre_data.section_data,
        this.display_type = this.pre_data.display_type,
        this.masters = this.pre_data.masters,
        this.form_group = this.pre_data.form_group

    } else {
      if (this.data) {

        this.filter_templates = this.data
        this.change_detector.detectChanges();
      }
      this.getDetails()
    }
    console.log(this.stage_data);
    console.log(this.code_master);

    if (this.filterData) {
      const rightMostPos = window.innerWidth - Number(this.filterData.left);
      this.dialogref.updatePosition({
        top: `${this.filterData.top}px`,
        right: `${rightMostPos}px`
      });

    }
  }

  onCancel() {
    this.dialogref.close()
  }

  getDetails() {
    this.workbench_service.getFormDetails({ form_code: this.form_code, template_code: 0, t_id: 0 }).subscribe(res => {
      let virtual_scroll_fields = {}
      if (res && res['data'] && res['data'].details && res['data'].details.length) {
        this.section_data = res['data'].details;
        // this.section_data = res['data'].details;
        this.display_type = this.section_data[0].display_type_id;
      }
      prepareSections(this.section_data, this.form_group, this.section_data, null, this.fb, this.display_type, virtual_scroll_fields);
      console.log(virtual_scroll_fields);
      let master_obj = [];
      for (let i = 0; i < Object.keys(virtual_scroll_fields).length; i++) {
        let obj = {}
        let master_id = Object.keys(virtual_scroll_fields)[i];
        obj['master_id'] = master_id;
        obj['values'] = virtual_scroll_fields[master_id];
        master_obj.push(obj);
      }

      this.workbench_service.getFormMaster(master_obj, { form_code: this.form_code, t_id: 0, template_code: 0 }).subscribe(masters => {
        this.masters = masters['data'].masters;
      })
    })
    this.change_detector.detectChanges();
  }

  sendData() {


    let form_value = this.form_group.value[this.section_data[0].section_id]
    form_value['template_code'] = this.form_code
    form_value['section_id'] = this.section_data[0].section_id


    this.dialogref.close({
      filter_applicant_data: this.form_group.value[this.section_data[0].section_id],
      section: this.section_data,
      display_type: this.display_type,
      masters: this.masters,
      form_group: this.form_group,
      section_data: this.section_data,
      stage_data: this.stage_data,
      code_master: this.code_master
    })

  }

  removeStageData() {
    this.stage_data = null;
  }

  removeCodeMaster() {
    this.code_master = null;
  }
}
