import { Component, OnInit, Input, Output, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EventEmitter } from '@angular/core';
import { FilesModalComponent } from '../files-modal/files-modal.component';
import { FileViewerComponent } from '../file-viewer/file-viewer.component';
import { FilesService } from '../../services/files/files.service';
import { NotificationService } from 'src/app/services/shared/notification/notification.service';
import { ConfirmationComponent } from 'src/app/modules/shared/confirmation/confirmation.component';
import { downloadFile } from '../../functions/file-function';
import { DocumentViewPopupComponent } from '../document-view-popup/document-view-popup.component';
import { ExportExcelService } from 'src/app/services/vendor-management/workbench/export-excel/export-excel.service';
import { jsonParse, cloneArray } from 'src/app/functions/functions';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
  providers: [FilesService, ExportExcelService]
})
export class FilesComponent implements OnInit {

  @Input() multiple;
  @Input() result;
  @Input() file_types
  @Input() final;
  @Output() returnFiles = new EventEmitter();
  @Input() flag;
  @Input() controlName;
  @Input() form;
  @Input() crop;
  @Input() label;
  @Input() required;
  @Input() on_change_func;
  @Input() callback_func;
  @Input() supported_file_type;
  active_files_length = 0;
  @Input() minLength;
  @Input() maxLength;
  @Input() verify_api_call;
  @Input() field_id;
  @Input() section_id;
  active_files;
  all_verified;
  all_declined = false;
  @Input() max_fieldwidth_px;
  @Input() verification_required;
  @Input() disabled;
  first_upload;
  constructor(
    private dialog: MatDialog,
    private change_detector: ChangeDetectorRef,
    private verify_svc: FilesService,
    private notification_svc: NotificationService,
    private file_save_svc: ExportExcelService

  ) { }

  ngOnInit() {
    if (this.supported_file_type) {
      this.supported_file_type = jsonParse(this.supported_file_type);
    }
    this.final = ["asdf"];
    if (this.form && this.form.get(this.controlName) && this.form.get(this.controlName).value) {
      this.result = this.form.get(this.controlName).value;
      this.checkActiveFiles();
    }
    else {
      this.result = [];
      this.checkActiveFiles();
    }
    setTimeout(() => {
      if (this.form && this.form.get(this.controlName) && this.form.get(this.controlName).value) {
        this.result = this.form.get(this.controlName).value;
      }
      else {
        this.result = [];
      }
    });

    this.form.get(this.controlName).valueChanges.subscribe(value => {
      if (value) {
        if (this.result != value) {
          this.result = value;
          this.checkActiveFiles();
          this.checkVerifyAllFlag(this.active_files);
        }
      }

      else {
        this.result = [];
        this.checkActiveFiles();
      }
    })

    this.checkActiveFiles();
    this.checkVerifyAllFlag(this.active_files);
  }

  fileChanged() {
  }

  removeFile() {
  }

  checkActiveFiles() {
    this.active_files_length = 0;
    this.active_files = [];
    if (this.result && this.result.length) {
      this.result.forEach(element => {
        if (element.status == 1) {
          this.active_files.push(element);
          this.active_files_length++;
        }
      });
    }
  }

  openModal() {
    const dialog = this.dialog.open(FilesModalComponent, {
      width: '300px',
      data: {
        result: cloneArray(this.result) || [],
        multiple: this.multiple || 0,
        file_types: this.file_types,
        supported_file_type: this.supported_file_type,
        min_length: this.minLength,
        max_length: this.maxLength,
        field_id: this.field_id,
        all_verified: this.all_verified,
        all_declined: this.all_declined,
        verification_required: this.verification_required
      },
      disableClose: true
    });
    (dialog).componentInstance.crop = this.crop ? this.crop : 0;
    dialog.afterClosed().subscribe(res => {

      if (res) {
        console.log(res)
        this.result = Object.assign([], res || []);
        // this.returnFiles.emit({ files: this.result, source: this.flag })
        this.form.get(this.controlName).setValue(this.result);
        if (this.on_change_func) {
          this.callback_func(this.on_change_func, this.result)
        }
        this.returnFiles.emit(this.result)
      }
      // this.result = JSON.parse(JSON.stringify(res || []));
      // this.returnFiles.emit({ files: this.result, source: this.flag })
      // this.final = JSON.parse(JSON.stringify(res))
      this.checkActiveFiles();
      this.checkVerifyAllFlag(this.active_files);

      this.change_detector.detectChanges()
      // this.filesComparsion();

    })
  }
  result1: any = [];
  filesComparsion() {
    //   if (this.result.length == 1 && this.result[0].status == 1) {

    //     this.result = this.result[0];
    //   }
    //   else if (this.result.length != 1) {
    //     this.result = this.result.status = 0;

    //   }
  }

  // viewDocument(all_files, file) {
  //   const dialogConfig = new MatDialogConfig
  //   dialogConfig.width = '60%';
  //   dialogConfig.height = '500px';
  //   const dialogRef = this.dialog.open(FileViewerComponent, dialogConfig);
  //   (dialogRef.componentInstance).file = file;
  //   (dialogRef.componentInstance).all_files = all_files;
  //   if (file) {
  //     (dialogRef.componentInstance).index = all_files.indexOf(file) == -1 ? 0 : all_files.indexOf(file);
  //   }
  //   else {
  //     (dialogRef.componentInstance).index = 0;
  //   }
  //   dialogRef.afterClosed().subscribe(value => {
  //     if (value) {
  //       console.log(value)
  //     }
  //   }, err => {

  //   });
  // }

  verifyAll(accept_param) {


    let message;

    message = 'Confirm your action ? '
    const dialog = this.dialog.open(ConfirmationComponent, {
      width: '300px',
      data: {
        title: "Confirmation",
        message: message,
        positive_button: "Verify",
        negative_button: "Cancel",
        form_enable: 1,
        decline_flag: accept_param == 1 ? 0 : 1,
      }
    });
    dialog.afterClosed().subscribe(res => {
      if (res) {
        let obj = {
          field_id: this.field_id,
          secion_id: this.section_id,
          is_verified: 0,
          verified_all: accept_param,
          attachment_ids: []
        };
        this.active_files.forEach(ele => {
          if (!ele.is_verified) {
            obj.attachment_ids.push(ele.attachment_id);
          }
        })
        this.verify_svc.verifyDocument(obj).subscribe(res => {
          this.notification_svc.snackbar(res['message'], 'Close', 5000);
        })
      }

    })
  }

  confirmationDialog() {
    let message;

    message = 'Conform your action'
    const dialog = this.dialog.open(ConfirmationComponent, {
      width: '300px',
      data: {
        title: "confirmation",
        messgeage: message,
        positive_button: "Verify",
        negative_button: "Cancel"
      }
    });

    return dialog;
  }

  checkVerifyAllFlag(result) {
    let found;
    if (result && result.length) {
      for (let i = 0; i < result.length; i++) {
        if (!(result[i].is_verified) && !(result[i].attachment_id)) {
          this.first_upload = true;
          break;
        }
        if (!(result[i].is_verified)) {
          found = true;
        }
        else if (result[i].is_verified == 1) {
          this.all_verified = true;
        }
        else if (result[i].is_verified == 2) {
          this.all_declined = true;
        }
      }
    }
    if (found) {
      this.all_verified = false;
    }
  }
  viewDocument(all_files, file) {
    viewDocument(all_files, file, this.dialog);
  }

  downLoad(file) {
    downloadFile(file, this.file_save_svc)
  }
}





export function viewDocument(all_files, file, dialog) {
  const dialogConfig = new MatDialogConfig()
  dialogConfig.width = '72%';
  dialogConfig.height = '100%';
  const dialogRef = dialog.open(DocumentViewPopupComponent, dialogConfig);
  (dialogRef.componentInstance).file = file;
  (dialogRef.componentInstance).all_files = all_files;
  if (file) {
    (dialogRef.componentInstance).index = all_files.indexOf(file) == -1 ? 0 : all_files.indexOf(file);
  }
  else {
    (dialogRef.componentInstance).index = 0;
  }
  dialogRef.afterClosed().subscribe(value => {
    if (value) {
      console.log(value)
    }
  }, err => {

  });
}


