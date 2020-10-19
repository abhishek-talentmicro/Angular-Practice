import { Component, OnInit, Inject } from '@angular/core';
import { RoutesService } from '../../login/services/routes/routes.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { ProfileSettings } from '../../../classes/shared/profile-settings/profile-settings';
import { Subscription } from 'rxjs';
import { ProfileSettingsService } from '../../../services/shared/profile-settings/profile-settings.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionService } from '../../login/services/session/session.service';
import { StandardFile } from '../../../controls/classes/file/file';
import { NotificationService } from '../../../services/shared/notification/notification.service';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { UserImageCropperComponent } from '../user-image-cropper/user-image-cropper.component';
@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss'],
  providers: [
    ProfileSettingsService
  ]
})
export class ProfileSettingsComponent implements OnInit {
  FileName;
  profile_settings_form: FormGroup;
  default_imgs: any = "../../../../assets/profile-pic.jpg";
  image_guid;
  // flag;
  imgs: any;
  attachment_id: number;
  // images: any = "data:image/jpeg;base64," + this.imgs;
  profile_settings = new ProfileSettings;
  profile_settings_backup = new ProfileSettings;
  files = new StandardFile();
  route_subscription: Subscription;
  master = [];
  profile_list: any = {};
  user_type: any = [];
  init() {
    this.default_imgs = "../../../../assets/user-profile.jpg";
    this.imgs = '';
    this.attachment_id = 0;
    this.profile_settings = new ProfileSettings();
    this.profile_settings_backup = new ProfileSettings();
    this.files = new StandardFile();

    this.profile_settings_form = new FormGroup(
      {
        short_signature: new FormControl(''),
        long_signature: new FormControl(''),
        assign_to: new FormControl(null),
        time_zone_id: new FormControl(null),
        extension_number: new FormControl(null)
      });
  }

  constructor(
    private profile_Setting_Service: ProfileSettingsService,
    private routes_service: RoutesService,
    private router: Router,
    private activated_route: ActivatedRoute,
    private dialog: MatDialog,
    private modalService: NgbModal,
    private _session: SessionService,
    public dialogRef: MatDialogRef<ProfileSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private notification_svc: NotificationService

  ) { }

  ngOnInit() {
    this.init();
    this.getProfileDetails();
  }

  imageChangedEvent: any = '';
  croppedImage: any = '';

  //ckeditor  used for  Long Signature
  public Editor = DecoupledEditor;
  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  public onChange({ editor }: ChangeEvent) {
    const data = editor.getData();

  }


  filechange(event: any): void {
    this.imageChangedEvent = event;
    this.cropImage();
  }
  // filechange(value) {
  //   let fil = document.getElementById("file-input")['files'][0];
  //   let reader = new FileReader();
  //   reader.onload = (e) => {
  //     let binarydata = reader.result;
  //     let base64String = window.btoa(binarydata.toString());
  //     this.file_name = base64String;
  //     this.imgs = "data:image/jpeg;base64," + base64String;

  //   };
  //   reader.readAsBinaryString(fil);
  // }
  getProfileDetails() {
    this.profile_Setting_Service.getProfileDetails().subscribe(res => {

      if (res && res['data']) {
        if (res['data'].masters) {
          if (res['data'].masters.assign_to) {
            this.master['assign_to'] = res['data'].masters.assign_to || [];
          }
          if (res['data'].masters.time_zone) {
            this.master['time_zone'] = res['data'].masters.time_zone || [];
          }
        }
        if (res['data'].details) {
          this.attachment_id = 0;
          this.profile_list = res['data'].details;
          if (res['data'].details.user_type) {
            if (typeof res['data'].details.user_type == 'string') {
              this.user_type = JSON.parse(res['data'].details.user_type);
            }
            else {
              this.user_type = res['data'].details.user_type;

            }
          }
          // if (res['data']["details"].image_guid) {
          //   this.image_guid = res['data']["details"].image_guid;
          // }
          // if (res['data']["details"].flag) {
          //   this.flag = res['data']["details"].flag;
          // }
          this.profile_settings.setData(res['data'].details);
          if (this.profile_settings && this.profile_settings.files && this.profile_settings.files.attachment_id) {
            this.attachment_id = this.profile_settings.files.attachment_id;
          }
          this.profile_settings_form.setValue(this.profile_settings.getFormGroupData());
        }
      }
    });
  }
  cropImage() {
    let modalService = this.modalService;
    const reader = new FileReader();
    reader.readAsDataURL(document.getElementById('file-input')['files'][0]);
    let file = document.getElementById('file-input')['files'][0];
    let image_file = new StandardFile();
    reader.onload = (e) => {
      const modal = modalService.open(UserImageCropperComponent, {
        backdrop: 'static',
        keyboard: false,
        size: 'lg'
      });
      (modal.componentInstance).imageChangedEvent = this.imageChangedEvent;
      (modal.componentInstance).aspectRatio = 1 / 1;
      (modal.componentInstance).crop_flag = 1;
      modal.result.then(result => {
        console.log('success');
        this.croppedImage = result;
        console.log(result);
        // if (this.croppedImage !== undefined) {
        this.imgs = result;
        // this.flag = 0;
        if (result) {
          this.attachment_id = 0;
        }
        image_file.setFileDetails(file.name, file.type, result, file.name.split('.')[1], 1, 0, file.size, 1, null);
        this.profile_settings.files = image_file;
        // }
      },
        err => {
          // console.log('error');
          // document.getElementById('file-input')['value'] = null;
          // console.log(document.getElementById('file-input')['files']);
        })
    };
    reader.onerror = function () {
      console.log(reader.result);
    };
  }


  cancelProfile() {
    this.dialogRef.close();
  }

  saveProfile() {
    this.profile_settings.setFormGroupData(this.profile_settings_form.value);
    // this.profile_settings.files = this.imgs;
    this.profile_settings.user_id = this._session.getUserId();

    this.profile_Setting_Service.saveProfileDetails(this.profile_settings).subscribe(res => {

      if (res['data']) {
        this.notification_svc.snackbar(res['message'], 'Cancel', 5000);
        this.dialogRef.close();
      }
    })
  }


}
