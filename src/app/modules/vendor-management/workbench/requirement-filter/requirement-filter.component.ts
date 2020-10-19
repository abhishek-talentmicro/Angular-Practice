import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { WorkbenchService } from 'src/app/services/vendor-management/workbench/workbench.service';
import { MatDialogRef } from '@angular/material/dialog';
import { DynamicModalService } from 'src/app/services/vendor-management/workbench/dynamic-modal/dynamic-modal.service';
import { jsonParse } from 'src/app/functions/functions';
import { prepareSections } from 'src/app/controls/components/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-requirement-filter',
  templateUrl: './requirement-filter.component.html',
  styleUrls: ['./requirement-filter.component.scss'],
  providers: [
    WorkbenchService
  ]
})
export class RequirementFilterComponent implements OnInit {
  section_data: any
  form_code
  form_group: FormGroup
  edit_flag
  masters: any
  display_type: any;
  t_id: number;
  constructor(
    private workbench_service: WorkbenchService,
    public dialogRef: MatDialogRef<RequirementFilterComponent>,
    private change_detector: ChangeDetectorRef,
    private dynamic_modal_svc: DynamicModalService,
    private fb: FormBuilder
  ) {
    this.form_group = new FormGroup({});
  }

  ngOnInit() {
    if (this.edit_flag) {

    }

    this.getForm()
  }

  getForm() {
    this.dynamic_modal_svc.getFormDetails({ form_code: this.form_code, template_code: 0, t_id: this.t_id || 0 }).subscribe(res => {
      if (res['data'] && res['data'].length && typeof res['data'] == "object") {
        this.section_data = this.parser(res['data'])

        if (res['data'][0]) {
          this.display_type = res['data'][0].display_type_id
        }
      }

      let virtual_scroll_fields = {};
      prepareSections(this.section_data, this.form_group, this.section_data, this.t_id, this.fb, this.display_type, virtual_scroll_fields);
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
        if (masters['status'] && masters['data']) {
          this.masters = masters['data'].masters;
        }
        else {
          this.masters = []
        }


      }, err => {
        this.masters = []
      })
      // if (res['status']) {

      // }
    }, err => {
      this.section_data = []
    })

    this.change_detector.detectChanges();
  }

  onCancel() {
    this.dialogRef.close()
  }


  parser(section) {
    for (let i = 0; i < section.length; i++) {
      if (section[i] && section[i].sections && typeof section[i].sections == 'string') {
        while (typeof section[i].sections != 'object') {
          section[i].sections = jsonParse(section[i].sections);
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
}
