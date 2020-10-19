import { Component, OnInit, Input, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { ImageCropperComponent } from '../image-cropper/image-cropper.component';
import { FilesService } from 'src/app/controls/services/files/files.service';
import { NotificationService } from 'src/app/services/shared/notification/notification.service';
import { viewDocument } from '../attachment-view/attachment-view.component';
import { downloadFile } from '../../functions/file-function';
import { ConfirmationComponent } from 'src/app/modules/shared/confirmation/confirmation.component';
import { ExportExcelService } from 'src/app/services/vendor-management/workbench/export-excel/export-excel.service';
import { cloneArray, jsonParse } from 'src/app/functions/functions';

@Component({
  selector: 'app-files-modal',
  templateUrl: './files-modal.component.html',
  styleUrls: ['./files-modal.component.scss'],
  providers: [ExportExcelService,FilesService]
})
export class FilesModalComponent implements OnInit {

  public active;
  public file;
  multiple;
  result = [];
  file_types;
  files = [];
  input = [];
  id;

  len: number;
  attachments = [];
  only_file_name;
  uploadedAttchments = [];
  attachmentsUrl: any = [];
  previewUrl = [];
  croppedImage: any = '';
  imageChangedEvent: any = '';

  supported_file_type;
  file_type_title_arr = [];
  file_type_title;
  @Input() crop;

  max_length;
  field_id;
  selected_files = [];

  active_files = [];
  inactive_files = [];
  all_verified;
  back_up = []



  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    if (this.crop) {
      this.cropImage();
    }
  }
  constructor(
    private dialog: MatDialog,
    private file_service: FilesService,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<FilesModalComponent>,
    private modalService: NgbModal,
    private change_detector: ChangeDetectorRef,
    private notification: NotificationService,
    private file_save_svc: ExportExcelService
  ) {

  }

  ngOnInit() {
    if (this.data) {
      this.multiple = this.data.multiple;
      if (this.data.max_length) {
        this.max_length = this.data.max_length;
      }
      if (this.data.all_verified) {
        this.all_verified = this.data.all_verified;
      }

      if (this.data.field_id) {
        this.field_id = this.data.field_id;
      }
    }
    if (!this.multiple) {
      if (this.data && this.data.result) {
        this.result = this.data.result;
        this.back_up = cloneArray(this.data.result);
      }
      else {
        this.result = [];
      }
      this.checkActiveFiles(this.result);
    }
    else {
      if (this.data && this.data.result && this.data.result.length) {
        this.result = this.data.result || [];
        this.back_up = cloneArray(this.data.result)

      }
      else {
        this.result = [];
      }
      this.checkActiveFiles(this.result);
    }
    this.file_types = this.data.file_types;
    this.supported_file_type = jsonParse(this.data.supported_file_type);
    this.fileTypeTitle(this.supported_file_type);
    this.input = Object.assign([], this.result || []);
    // this.input = JSON.parse(JSON.stringify(this.result || []));

    this.id = Math.floor((Math.random() * 1000) + 1);

    this.files = [];
    let drop_zone = document.getElementById('drop-zone');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      drop_zone.addEventListener(eventName, (e) => {
        e.preventDefault()
        e.stopPropagation()
      }, false)
    })
    drop_zone.addEventListener('drop', this.fileInputDropped.bind(this), false);
  }

  addMorefiles(event) {

    for (let i = 0; i < event.target.files.length; i++) {
      this.attachments.push(event.target.files[i]);
      this.len = this.attachments.length + this.uploadedAttchments.length;
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[i]);
      reader.onload = (event) => {
        // this.previewUrl.push(event.target.result);
      }
    }
  }

  onSend() {
    this.dialogRef.close(this.attachments);
  }

  fileTypeTitle(obj) {
    if (obj && typeof obj == 'object' && obj.length) {
      let out_arr = [];
      obj.forEach(ele => {
        out_arr.push((ele.title).toLowerCase());
      })
      this.file_type_title = out_arr.toString();
      this.file_type_title_arr = out_arr;
    }
    else {
      this.file_type_title = '';
      this.file_type_title_arr = [];
    }
  }

  // cancel() {
  //   this.dialogRef.close(this.attachments);
  // }

  // removeFile(index) {
  //   this.attachments.splice(index, 1);
  //   this.len = this.attachments.length;
  // }

  previewImage(src, prepend_path_flag) {
    let modalService = this.dialog;
    const reader = new FileReader();
    const dialogRef = modalService.open(ImageCropperComponent);
    (dialogRef.componentInstance).image_src = src;
    (dialogRef.componentInstance).crop_flag = 0;
    (dialogRef.componentInstance).prepend_path = prepend_path_flag;
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        // this.Outputfiles.emit(value)
        // this.send_files.emit(value)
      }
    });
    dialogRef.afterClosed().subscribe(result => {

    },
      err => {


      })
  }

  cropImage() {

    const dialog = this.dialog.open(ImageCropperComponent, {
      disableClose: true
    });
    (dialog).componentInstance.image_src = this.active_files;
    (dialog).componentInstance.aspectRatio = 1 / 1;
    (dialog).componentInstance.crop_flag = 1;


    dialog.afterClosed().subscribe(result => {
      if(result){
        this.active_files = result;
      }
      // this.file_service.convertFilesToBase64(result).subscribe((res: Array<any>) => {

      //   if (res && res.length) {
      //     // if (!this.multiple) {
      //       this.active_files = res;
      //     // }
      //     // else {
      //     //   this.active_files = [...this.active_files, ...res];
      //     // }
      //   }
      //   else {
      //     this.active_files = [];
      //   }
      //   document.getElementById("input-file" + this.id)['value'] = null;

      //   this.change_detector.detectChanges();
      // })
    },
      err => {

      })








    // let modalService = this.dialog;
    // const modal = modalService.open(ImageCropperComponent, {
    //   backdrop: 'static',
    //   keyboard: false,
    //   size: 'lg'
    // });
    // (modal.componentInstance).image_src = this.selected_files;
    // (modal.componentInstance).aspectRatio = 1 / 1;
    // (modal.componentInstance).crop_flag = 1;
    // modal.result.then(result => {

    //   this.croppedImage = result;
    //   this.file_service.convertFilesToBase64(result).subscribe((res: Array<any>) => {

    //     if (res && res.length) {
    //       if (!this.multiple) {
    //         this.result = res;
    //       }
    //       else {
    //         this.result = [...this.result, ...res];
    //       }
    //     }
    //     else {
    //       this.result = [];
    //     }
    //     document.getElementById("input-file" + this.id)['value'] = null;

    //     this.change_detector.detectChanges();
    //   })
    // },
    //   err => {

    //   })
  }

  fileInputDropped(ev) {
    this.fileInputChanged(ev.dataTransfer.files);
  }

  fileInputChanged(files) {
    files = this.fileCheck(files);
    if (files && typeof files == 'object' && files.length) {
      this.imageChangedEvent = files;

      this.file_service.convertFilesToBase64(files).subscribe(res => {
        console.log(res, this.selected_files);
        this.selected_files = res as any;
        if (this.multiple) {
          this.active_files = this.active_files ? this.active_files.concat(this.selected_files) : this.selected_files;
        }
        else {
          this.active_files.forEach(file => {
            if (file && file.attachment_id) {
              file.status = 2;
              this.inactive_files.push(file);
            }
          })
          this.active_files = this.selected_files;
        }

        if (this.active_files && this.active_files.length && this.active_files && this.active_files.length > this.max_length) {
          this.active_files = this.active_files.slice(0, this.max_length);
          this.notification.snackbar(`You can select only ${this.max_length} files`, 'Cancel', 6000);
        }
        if (this.crop) {
          this.cropImage();
        }
      })
    }
    else {
      //TODO
    }
  }

  fileCheck(file_arr) {
    let out_files = [];
    let notif;
    if (file_arr && typeof file_arr == 'object' && file_arr.length) {
      if (this.file_type_title_arr && typeof this.file_type_title_arr == 'object' && this.file_type_title_arr.length) {
        for (let i = 0; i < file_arr.length; i++) {
          let file = file_arr[i];
          if (this.file_type_title_arr.includes('.' + ((file.name).split('.').pop()).toLowerCase())) {
            out_files.push(file);
          }
          else {
            notif = true;
          }
        }
      }
      else {
        return file_arr;
      }
    }
    if (notif) {
      if (this.multiple && file_arr.length > 1) {
        this.notification.snackbar("Unsupporetd Files are removed", 'Cancel', 6000)
      }
      else {
        this.notification.snackbar("Unsupporetd file type", 'Cancel', 6000)
      }
    }

    return out_files;

  }

  removeFile(file, i) {
    if (file && file.attachment_id) {
      file.status = 2;
      this.inactive_files.push(file);
      this.active_files.splice(i, 1);
    }
    else {
      let index = this.active_files.indexOf(file);
      if (index > -1) {
        this.active_files.splice(index, 1);
      }
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  close() {
    this.result = [];
    this.result = [...this.active_files, ...this.inactive_files]
    this.dialogRef.close(this.result);
  }

  checkActiveFiles(array) {
    let obj = [];
    this.active_files = [];
    this.inactive_files = [];
    array.forEach(element => {
      if (element && element.status == 1) {
        this.active_files.push(element);
      }
      else {
        this.inactive_files.push(element);
      }
    });

  }

  viewDocument(all_files, file) {
    viewDocument(all_files, file, this.dialog);
  }

  downLoad(file) {
    downloadFile(file, this.file_save_svc)
  }

  // verifySingleDocument(file, index) {
  //   let obj = {
  //     field_id: this.field_id,
  //     secion_id: 0,
  //     is_verified: 1,
  //     verified_all: 0,
  //     attachment_ids: [file.attachment_id ? file.attachment_id : 0]
  //   };

  //   this.file_service.verifyDocument(obj).subscribe(res => {
  //     this.notification.snackbar(res['message'], 'Close', 5000);
  //     if (res && res['status']) {
  //       file.is_verified = 1;
  //       this.result[index] = file;
  //     }
  //   })
  // }

  // declineSingleDocument(file, index) {
  //   let obj = {
  //     field_id: this.field_id,
  //     secion_id: 0,
  //     is_verified: 2,
  //     verified_all: 0,
  //     attachment_ids: [file.attachment_id ? file.attachment_id : 0]
  //   };

  //   this.file_service.verifyDocument(obj).subscribe(res => {
  //     this.notification.snackbar(res['message'], 'Close', 5000);
  //     if (res && res['status']) {
  //       file.is_verified = 1;
  //       this.result[index] = file;
  //     }
  //   })
  // }

  // verifyDocument(file, index) {
  //   let message;
  //   message = 'Confirm your action'
  //   const dialog = this.dialog.open(ConfirmationComponent, {
  //     width: '300px',
  //     data: {
  //       title: "Confirmation",
  //       message: message,
  //       positive_button: "Verify",
  //       negative_button: "Cancel"
  //     }
  //   });
  //   dialog.afterClosed().subscribe(res => {
  //     if (res) {
  //       this.verifySingleDocument(file, index)
  //     }

  //   })
  // }
}
