import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NotificationService } from 'src/app/services/shared/notification/notification.service';
import { NotesService } from 'src/app/services/vendor-management/workbench/requirement/notes.service';
import { jsonParse } from 'src/app/functions/functions';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
  providers: [NotesService]
})
export class NotesComponent implements OnInit {

  @Input() notes;

  notes_form: FormGroup;
  notes_section: any = new Object();
  req_id;
  display_table = 1;

  constructor(private fb: FormBuilder,
    private dialogref: MatDialogRef<NotesComponent>,
    private notes_svc: NotesService,
    private notififcation_svc: NotificationService) { }

  ngOnInit() {
    if (this.notes.req_id) {
      this.notes_form = this.fb.group({
        notes: ['', Validators.required],
        req_id: []
      })
    }


    if (this.notes && this.notes.notes_data) {
      this.notes_section.data = this.notes.notes_data;
      this.req_id = this.notes.req_id
      this.notes_section.grid_layout = { "grid_title": "Notes", "grid_definition": [{ "editable_flag": 0, "label_type": 0, "save_url": "", "control_type_id": 2, "form_code": 1515, "grid_title": "", "property": "notes", "visible": true, "width": 0, "description": "", "data_type": "nvarchar", "ascending": 0, "grouping": 0, "cell_class": "", "cell_template": "", "filter": "", "label_code": "6055", "title": "Notes", "sub_module_code": 1414, "module_code": 1001, "status": 1, "view_type": 0, "field_name": "", "sequence": 1 }, { "editable_flag": 0, "label_type": 0, "save_url": "", "control_type_id": 2, "form_code": 1515, "grid_title": "", "property": "cr_user_id", "visible": true, "width": 0, "description": "", "data_type": "nvarchar", "ascending": 0, "grouping": 0, "cell_class": "", "cell_template": "", "filter": "", "label_code": "6062", "title": "Created By", "sub_module_code": 1414, "module_code": 1001, "status": 1, "view_type": 0, "field_name": "", "sequence": 2 }, { "editable_flag": 0, "label_type": 1005, "save_url": "", "control_type_id": 10, "form_code": 1515, "grid_title": "", "property": "cr_date", "visible": true, "width": 0, "description": "", "data_type": "datetime", "ascending": 0, "grouping": 0, "cell_class": "", "cell_template": "", "filter": "", "label_code": "6098", "title": "Created Date", "sub_module_code": 1414, "module_code": 1001, "status": 1, "view_type": 0, "field_name": "", "sequence": 3 }], "table_code": 1017, "form_code": 1515, "description": "", "export_flag": 0, "file_name": "", "enable_filter": 0, "enable_order": 0, "editable_flag": 0 }
    }
  }

  close() {
    this.dialogref.close(this.notes_section.data);
  }

  addNotes() {
    if (this.notes_form.valid) {
      this.notes_form.get('req_id').setValue(this.req_id)
      this.notes_svc.saveReqNotes(this.notes_form.value).subscribe(data => {
        this.notififcation_svc.snackbar(data['message'], 'Cancel', 3000)
        this.getNotes();
        this.notes_form.reset();
      },
        err => {

        })
    }
    else {
      this.notififcation_svc.snackbar("Please enter Valid inputs", 'Cancel', 3000)
    }
  }

  getNotes() {
    this.display_table = 0;
    this.notes_svc.getReqNotes({ req_id: this.req_id }).subscribe(data => {
      try {

        if (data && data['data']) {
          this.notes_section.data = jsonParse(data['data'])
          setTimeout(() => {
            this.display_table = 1;
          })
        }

      }
      catch (err) {

      }
    }, err => {

    })
  }
}
