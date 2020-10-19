import { Component, OnInit, Input, ChangeDetectorRef, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { prepareSections } from 'src/app/controls/components/dynamic-form/dynamic-form.component';
import { NotificationService } from 'src/app/services/shared/notification/notification.service';
import { WorkbenchService } from 'src/app/services/vendor-management/workbench/workbench.service';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { DynamicModalService } from 'src/app/services/vendor-management/workbench/dynamic-modal/dynamic-modal.service';
import { jsonParse } from 'src/app/functions/functions';

@Component({
  selector: 'app-dynamic-modal',
  templateUrl: './dynamic-modal.component.html',
  styleUrls: ['./dynamic-modal.component.scss'],
  providers: [
    WorkbenchService
  ]
})
export class DynamicModalComponent implements OnInit {
  form_code;
  filter_templates
  edit_flag;
  selected_template
  section_data;
  url;
  display_type;
  masters;
  form_group: FormGroup;
  loading;
  disable;
  t_id: any;
  other_data = new Object();
  dataSavedFn;

  constructor(
    private workbench_service: WorkbenchService,
    private change_detector: ChangeDetectorRef,
    private dialogref: MatDialogRef<DynamicModalComponent>,
    private dynamic_modal_svc: DynamicModalService,
    private fb: FormBuilder,
    private notification_svc: NotificationService

  ) {
    this.form_group = new FormGroup({});
  }

  ngOnInit() {


    this.dataSavedFn = this.dataSaved.bind(this);
    // if (this.edit_flag) {
    //   this.t_id = this.selected_template.filter_template_id
    //   this.getDetails();

    // } else {
    //   this.getDetails();

    // }
    this.other_data['filter_template_id'] = this.t_id || 0


    this.getDetails()
    this.change_detector.detectChanges();
  }

  getDetails() {

    this.dynamic_modal_svc.getFormDetails({ form_code: this.form_code, template_code: 0, t_id: this.t_id || 0 }).subscribe(res => {
      if (res && res['data'] && res['data'] && res['data']) {
        this.section_data = jsonParse(res['data']);
        this.display_type = this.section_data[0].display_type_id;
      }
      // prepareSections(this.section_data, this.form_group, this.section_data, this.t_id || 0, this.fb, this.display_type)

      let virtual_scroll_fields = {}
      prepareSections(this.section_data, this.form_group, this.section_data, this.t_id || 0, this.fb, this.display_type, virtual_scroll_fields);
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
      }, err => {
        this.section_data = []
      })
    })
  }

  onCancel(res?) {
    this.dialogref.close(res)
  }


  filterRequirements(e) {

  }


  onRequirementSave(ev?) {
    console.log(ev)
    this.workbench_service.saveFilterTemplate(this.form_group.value.sections || []).subscribe(res => {
      console.log(res)
      if (res && res['status']) {
        this.dialogref.close(res);
      }
    })
  }

  dataSaved(t_id, res, str?) {
    if (res && res['id']) {
      this.dialogref.close(res);
    }
    this.notification_svc.snackbar(res['message'], "Close", 3000);
  }

}
