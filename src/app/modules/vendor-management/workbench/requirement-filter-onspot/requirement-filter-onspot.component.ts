import { Component, OnInit, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { WorkbenchService } from 'src/app/services/vendor-management/workbench/workbench.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WorkbenchTabsService } from 'src/app/services/vendor-management/workbench-tabs/workbench-tabs.service';
import { prepareSections } from 'src/app/controls/components/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-requirement-filter-onspot',
  templateUrl: './requirement-filter-onspot.component.html',
  styleUrls: ['./requirement-filter-onspot.component.scss'],
  providers: [WorkbenchService]
})
export class RequirementFilterOnspotComponent implements OnInit {
  filterData
  filter_templates
  form_code
  section_data: any;
  display_type: any;
  pre_data
  masters: any;
  form_group: FormGroup;
  loading;
  constructor(
    private dialogref: MatDialogRef<RequirementFilterOnspotComponent>,
    @Inject(MAT_DIALOG_DATA) private data,
    private change_detector: ChangeDetectorRef,
    private workbench_service: WorkbenchService,
    private workbench_tabservice: WorkbenchTabsService,
    private fb :FormBuilder

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
    if (this.filterData) {
      const rightMostPos = window.innerWidth - Number(this.filterData.left);
      this.dialogref.updatePosition({
        top: `${this.filterData.top}px`,
        right: `${rightMostPos}px`
      });
    }
  }
  getDetails() {
    this.workbench_service.getFormDetails({ form_code: this.form_code, template_code: 0, t_id: 0 }).subscribe(res => {

      if (res && res['data'] && res['data'].details && res['data'].details.length) {
        this.section_data = res['data'].details;
        // this.section_data = res['data'].details;
        this.display_type = this.section_data[0].display_type_id;
      }

      let virtual_scroll_fields = {};
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
        this.change_detector.detectChanges();
      })
    })
  }

  onCancel() {
    this.dialogref.close()
  }


  sendData() {

    let form_value = this.form_group.value[this.section_data[0].section_id]
    form_value['template_code'] = this.form_code
    form_value['section_id'] = this.section_data[0].section_id


    this.dialogref.close({
      filter_requirement_data: this.form_group.value[this.section_data[0].section_id],
      section: this.section_data,
      display_type: this.display_type,
      masters: this.masters,
      form_group: this.form_group,
      section_data: this.section_data
    })
  }
}


