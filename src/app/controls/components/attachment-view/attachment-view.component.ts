import { Component, OnInit, Input, OnChanges, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DocumentViewPopupComponent } from '../document-view-popup/document-view-popup.component';
import { stripHtmlTags } from '../dynamic-form/dynamic-form.component';
import { ExportExcelService } from 'src/app/services/vendor-management/workbench/export-excel/export-excel.service';
import { jsonParse, cloneArray } from 'src/app/functions/functions';


@Component({
  selector: 'app-attachment-view',
  templateUrl: './attachment-view.component.html',
  styleUrls: ['./attachment-view.component.scss'],
  providers: [ExportExcelService]
})
export class AttachmentsViewComponent implements OnInit {
  type
  documents = []
  @Input() row_data;
  @Input() property_name;
  @Input() multiple;
  @Input() editable;
  @Input() size;
  @Output() edit = new EventEmitter()
  all_files = [];
  all_files_backup = [];
  constructor(
    private change_detector: ChangeDetectorRef,
    private dialog: MatDialog,
  ) { }


  ngOnInit() {
    // 
    // this.setData();
    // this.fileArray();
    console.log(this.row_data)
    if (this.row_data && this.row_data[this.property_name]) {
      this.all_files = cloneArray(jsonParse(this.row_data[this.property_name]));
      this.all_files_backup = jsonParse(this.row_data[this.property_name]);
      if (this.all_files) {
        this.setType();
      }
    }
    this.change_detector.detectChanges()
  }
  ngOnChanges(e) {
    
    this.change_detector.detectChanges()
    if (e.details) {
      // this.setData()
    }
  }

  setType() {
    for (let i = 0; i < this.all_files.length; i++) {
      const details = this.all_files[i];

      if (details.file_title) {
        if ((details.file_title).split('.').pop() == 'docx' || (details.file_title).split('.').pop() == 'doc') {
          details['type'] = 1
        }

        else if ((details.file_title).split('.').pop() == 'pdf') {
          details['type'] = 2
        }
        else if ((details.file_title).split('.').pop() == 'xlsx' || (details.file_title).split('.').pop() == 'xls') {
          details['type'] = 4
        }
        else {
          details['type'] = 3
        }
      }
      else {
        details['type'] = 3
      }
    }
  }

  viewDocument(all_files, file) {
    viewDocument(all_files, file, this.dialog, this.row_data)
  }

  // fileArray() {
  //   this.all_files = [];
  //   this.section_data.forEach(attach => {
  //     attach.FileData ? this.all_files.push(...attach.FileData) : (attach.document ? this.all_files.push(...attach.document) : [])
  //   });
  // }

  editDocument(details, i) {
    // this.activeDocument(this.row_data)
    this.edit.emit({
      func: 'edit',
      data: this.row_data
    })
  }

  // activeDocument(j) {
  //   for (let i = 0; i < this.all_files_backup.length; i++) {
  //     if (j != i) {
  //       this.all_files_backup[i].is_active = false;
  //     }
  //     else {
  //       this.all_files_backup[i].is_active = true;
  //     }

  // }

  // }

  stripHtmlTags(str) {
    return stripHtmlTags(str);
  }

  // tableRecordsfromexcel(arr) {
  //   if (arr && typeof arr == 'object' && arr.length) {
  //     let property_names = arr[0];
  //     let final_array = [];
  //     for (let i = 0; i < property_names.length; i++) {
  //       let key = property_names[i];
  //       for (let j = 1; j < arr.length;j++ ){
  //         rows.reduce(function(result, field, index) {
  //           result[columns[index]] = field;
  //           return result;
  //         }, {})
  //       }

  //    }
  //   }
  // }


  // }

  //   setData() {
  //     this.documents=[]
  //     if (details && details.length) {
  //       for (let i of details) {
  //         if (i.FileData) {
  //           for (let k of i.FileData) {
  //             if (k.mime_type) {
  //               if (k.mime_type.indexOf('/msword') > -1) {
  //                 k['type'] = 1
  //               }
  //               else if (k.mime_type.indexOf('/pdf') > -1) {
  //                 k['type'] = 2
  //               }
  //               else if (k.mime_type.indexOf('/vnd.openxmlformats') > -1) {
  //                 k['type'] = 1
  //               }
  //               else {
  //                 k['type'] = 3
  //               }
  //               this.documents.push(k)
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
}


export function viewDocument(all_files, file, dialog, other_data?) {
  const dialogConfig = new MatDialogConfig()
  dialogConfig.width = '72%';
  dialogConfig.height = '100%';
  const dialogRef = dialog.open(DocumentViewPopupComponent, dialogConfig);
  (dialogRef.componentInstance).file = file;
  (dialogRef.componentInstance).all_files = all_files;
  (dialogRef.componentInstance).other_data = other_data;
  (dialogRef.componentInstance).index = all_files.indexOf(file) == -1 ? 0 : all_files.indexOf(file);
  dialogRef.afterClosed().subscribe(value => {
    if (value) {
      
    }
  }, err => {

  })

}

// a1a24c5 last array commit
