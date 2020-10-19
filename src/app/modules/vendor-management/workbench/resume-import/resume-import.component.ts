import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonValuePopupComponent } from './common-value-popup/common-value-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit, ViewChild, ChangeDetectorRef, OnChanges, ApplicationRef, OnDestroy, Input } from '@angular/core';
import * as XLSX from 'xlsx';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ResumeImportService } from 'src/app/services/vendor-management/workbench/resume/resume-import/resume-import.service';
import { WorkbenchTabsService } from 'src/app/services/vendor-management/workbench-tabs/workbench-tabs.service';
import { NotificationService } from 'src/app/services/shared/notification/notification.service';
import { cloneArray } from 'src/app/functions/functions';


@Component({
  selector: 'app-resume-import',
  templateUrl: './resume-import.component.html',
  styleUrls: ['./resume-import.component.scss'],
  providers: [ResumeImportService]
})
export class ResumeImportComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild('table', { static: false }) table_view;
  @ViewChild("virtual_scroll", { static: false }) cdk_view_port: CdkVirtualScrollViewport;
  files = [];
  @Input() current_tab;
  @Input() newTab;
  xl_files;
  resume_data_list = [];
  headers = [];
  backup_row;
  backup_resume_list = [];
  dynamic_data_list = [];
  title_data = [];
  multiple_flag = 0;

  public final
  arrayBuffer: any;
  loading1: boolean = false;
  text = "Select Folder";
  res_data: any = {};
  current_row;
  hel;
  selected_option = 0;
  action_form: FormGroup;
  result_xl_file: any;
  job_portal: [];
  job_portal_credential: []

  import_details = {
    valid_status: false,
    valid_tagging_status: false,
    valid_resume_id: false,
    undo_flag: false,
    loading: false,
    imp_loading: false,
    valid_row_edit: false

  }

  constructor(
    private resume_import_srv: ResumeImportService,
    private dialog: MatDialog,
    private change_detector: ChangeDetectorRef,
    private application_ref: ApplicationRef,
    private workbench_tab_srv: WorkbenchTabsService,
    private notification: NotificationService
  ) {
    this.title_data = [{
      id: 0,
      title: 'First Name',
      from: 'FirstName',
      to: 'first_name',
      visibility: true,
      cell_click: this.openResumeDetails.bind(this)
    },
    {
      id: 1,
      title: 'Last Name',
      from: 'LastName',
      to: 'last_name',
      visibility: true
    },
    {
      id: 2,
      title: 'Email ID',
      from: 'Email',
      to: 'email_id',
      visibility: true
    },

    {
      id: 3,
      title: 'Contact Number',
      from: 'Mobile',
      to: 'mobile_no',
      visibility: true
    },
    {
      id: 4,
      title: 'Source',
      from: 'Source',
      to: 'source',
      visibility: false
    },
    {
      id: 5,
      title: 'Job Code',
      from: 'JobCode',
      to: 'job_code',
      visibility: true
    },
    {
      title: 'Currency',
      from: 'Currency',
      to: 'currency',
      visibility: false
    },
    {
      title: 'Duration',
      from: 'DurationTitle',
      to: 'duration_title',
      visibility: false
    },
    {
      title: 'Skills',
      from: 'SkillIDs',
      to: 'scale_title',
      visibility: false
    },
    {
      title: 'Current Employee',
      from: 'CurrentEmployee',
      to: 'current_employee',
      visibility: false
    },
    {
      title: 'Current Designation',
      from: 'CurrentDesignation',
      to: 'current_designation',
      visibility: false
    },
    {
      title: " Total Experience",
      from: 'Totalexperience',
      to: 'experience',
      type: 'number',
      visibility: false
    },
    {
      title: 'Current Location',
      from: 'CurrentLocation',
      to: 'current_location',
      visibility: false
    },
    {
      title: 'Present CTC',
      from: 'presentCTC',
      to: 'amount',
      type: 'number',
      visibility: false
    },
    {
      title: 'Notice Period',
      from: 'NoticePeriod',
      to: 'notice_period',
      type: 'number',
      visibility: false
    },
    {
      title: 'Skill Titles',
      from: 'skillTitles',
      to: 'skill_titles',
      type: 'array',
      visibility: false
    },


    ]
    this.action_form = new FormGroup({
      files: new FormControl([]),
      xl_files: new FormControl([]),
      job_portal: new FormControl(null, Validators.required),
      credential: new FormControl(null)

    })
  }

  ngOnInit() {
    let data = this.workbench_tab_srv.getTabDetails(this.current_tab);
    console.log(data)
    if (data && data.data) {
      if (data.data.resume_data_list) {
        this.resume_data_list = data.data.resume_data_list;
      }
      if (data.data.title_data) {
        this.title_data = data.data.title_data;
      }
      if (data.data.import_details) {
        this.import_details = data.data.import_details;
      }
      if (data.data.backup_resume_list) {
        this.backup_resume_list = data.data.backup_resume_list;
      }
      if (data.data.files) {
        this.files = data.data.files;
      }
      if (data.data.xl_files) {
        this.xl_files = data.data.xl_files;
      }
      if (data.data.selected_option) {
        this.selected_option = data.data.selected_option;
      }
      if (data.data.action_form) {
        this.action_form = data.data.action_form;
        this.action_form.patchValue(data.data.action_form.value);
      }
      this.job_portal = data.data.job_portal || [];
      this.job_portal_credential = data.data.job_portal_credential || []

    }
    else {
      this.loadJobPortals();
    }
  }

  loadJobPortals() {
    this.resume_import_srv.getJobPortalList().subscribe(res => {
      console.log(res)
      if (res) {
        this.job_portal = res['data'] || []
      }
    })
  }


  loadJobPortalCredential(ev) {
    console.log(ev)
    this.resume_import_srv.getJobPortalCredentials({ portal_code: this.action_form.value.job_portal }).subscribe(res => {
      console.log(res)
      if (res) {
        this.job_portal_credential = res['data'] || [];
      }
    })
  }

  ngOnDestroy() {
    this.workbench_tab_srv.updateTabDetails(this.current_tab, {
      resume_data_list: this.resume_data_list,
      title_data: this.title_data,
      import_details: this.import_details,
      backup_resume_list: this.backup_resume_list,
      files: this.files,
      xl_files: this.xl_files,
      selected_option: this.selected_option,
      action_form: this.action_form,
      job_portal: this.job_portal,
      job_portal_credential: this.job_portal_credential
    });
  }

  ngOnChanges() {
    this.change_detector.detectChanges();
  }

  fileTypeChanges(ev?) {
    console.log(this.selected_option)
    if (this.selected_option == 1) {
      this.title_data[4].visibility = true; //this is for source code and job code visibility
      this.title_data[5].visibility = true;
    }
    if (this.selected_option == 0) {
      this.title_data[4].visibility = false;
      this.title_data[5].visibility = false;
    }
  }
  calclateTop() {
    if (!this.cdk_view_port || !this.cdk_view_port["_renderedContentOffset"]) {
      return "-0px";
    }
    let offset = this.cdk_view_port["_renderedContentOffset"];
    console.log(`-${offset}px`)
    return `-${offset}px`;
  }


  saveFileResult(result) {

    // this.valid_status = false;
    // this.valid_tagging_status = false;
    console.log(result)
    this.files = result
  }

  uploadFiles() {
    this.import_details.valid_status = false;
    this.import_details.valid_tagging_status = false;
    console.log(this.files)
    if (this.files.length > 0) {
      this.resume_data_list = [];
      this.uploadResumeRecursive(0)
    }
    else {
      this.notification.snackbar('Please select file', 'Close', 3000);
    }

  }

  uploadResumeRecursive(n) {
    let l = this.files.length;

    this.import_details.loading = true;
    try {
      if (n < l) {
        let form_data = new FormData();
        let f = (this.makeFormDataFile(this.files[n]));
        form_data.append('attachment', f, f.name);
        this.resume_import_srv.saveResume(form_data).subscribe(res => {
          console.log(res)
          if (res) {
            res['files'] = this.files[n];
            this.resume_data_list.push(res);
            console.log(this.resume_data_list)
          }
          // this.resume_data_list[n]['file'] = this.files[n];
          this.uploadResumeRecursive(n + 1);
        })
      }
      else {
        this.dynamic_data_list = [];
        if (this.resume_data_list && this.resume_data_list.length) {
          this.headers = Array.from(Object.keys(this.resume_data_list[0]));
        }


        this.resume_data_list.forEach(element => {
          this.dynamic_data_list.push(Array.from(Object.values(element)));
        });

        this.resume_data_list = cloneArray(this.resume_data_list)
        this.backup_resume_list = cloneArray(this.resume_data_list)
        this.change_detector.detectChanges();

        this.import_details.loading = false;
      }
    }
    catch (error) {
      this.resume_data_list = [];
      this.dynamic_data_list = [];
    }
  }


  incomingfile(event) {
    // get data from file upload
    console.log(event)
    this.result_xl_file = event;
    let files = event
    let form_data = new FormData();
    let f = (this.makeFormDataFile(files[0]));
    form_data.append('attachment', f, f.name);
    // this.valid_status = false;
    // this.valid_tagging_status = false;
    console.log(form_data)
    this.xl_files = f;
    console.log(this.xl_files)
    // this.text = event.target.files.length + " file selected";
  }

  uploadXl() {
    this.dynamic_data_list = [];
    this.loading1 = true;
    this.import_details.valid_status = false;
    this.import_details.valid_tagging_status = false;
    //uploading file
    if (this.xl_files) {
      try {
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
          this.arrayBuffer = fileReader.result;
          //to import excel file
          let data = new Uint8Array(this.arrayBuffer);
          let arr = new Array();
          for (let i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
          let bstr = arr.join("");
          let workbook = XLSX.read(bstr, { type: "binary" });
          let first_sheet_name = workbook.SheetNames[0];
          let worksheet = workbook.Sheets[first_sheet_name];
          this.resume_data_list = cloneArray(JSON.parse(JSON.stringify(XLSX.utils.sheet_to_json(worksheet, { raw: true }))));
          this.backup_resume_list = cloneArray(JSON.parse(JSON.stringify(XLSX.utils.sheet_to_json(worksheet, { raw: true }))));
          this.resume_data_list = this.fullNameSplitter(this.resume_data_list);
          this.backup_resume_list = this.fullNameSplitter(this.backup_resume_list);
          console.log(this.resume_data_list)
          if (this.resume_data_list && this.resume_data_list.length) {
            this.headers = (Array.from(Object.keys(this.resume_data_list[0])));
          }
          this.resume_data_list.forEach(element => {
            this.dynamic_data_list.push(Array.from(Object.values(element)));
            this.loading1 = false;
          });
          this.loading1 = false;
          console.log(this.resume_data_list, this.dynamic_data_list);

        }
        fileReader.readAsArrayBuffer(this.xl_files);
      }
      catch (err) {

        this.resume_data_list = [];
        this.dynamic_data_list = [];
        this.loading1 = false;

      }
    }
    else {
      this.notification.snackbar('Please select file', 'Close', 3000);
    }


  }

  fullNameSplitter(array) {
    array.forEach(ele => {
      if (ele['FullName']) {
        ele['FirstName'] = (ele['FullName'].trim()).split(' ').slice(0, 1).join(' ');
        ele['LastName'] = (ele['FullName'].trim()).split(' ').slice(1, ele['FullName'].split(' ').length).join(' ');
      }
    })

    return array;
  }

  makeFormDataFile(file) {
    try {
      if (file) {
        let base64 = (file.content);
        let file_title = (file.file_title);
        let mime_type = (file.mime_type);
        function dataURLtoFile(dataurl, filename) {

          var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }

          return new File([u8arr], filename, { type: mime });
        }
        let formatted_file = dataURLtoFile(base64, file_title);
        return formatted_file;
      }
    }
    catch (err) {


    }

  }
  resume_master_details;
  saveImportFile() {
    this.import_details.imp_loading = true;
    this.updateTableRow();
    try {
      // if (this.selected_option) {
      let dialog = this.dialog.open(CommonValuePopupComponent, {
        width: '480px',
        data: this.selected_option
      });
      dialog.afterClosed().subscribe(res => {
        this.import_details.imp_loading = false;
        if (res) {
          this.resume_master_details = res;
          this.saveImportFileRecursive(0);

        }
      })
      // }
      // else {
      //   this.saveImportFileRecursive(0);

      // }

    }
    catch (err) {


    }
  }

  openDialog() {
    try {
      if (this.selected_option) {
        let dialog = this.dialog.open(CommonValuePopupComponent, {
          width: '64vw',
        });
        dialog.afterClosed().subscribe(res => {
          this.import_details.imp_loading = false;
          if (res) {
            this.resume_master_details = res;
            this.saveImportFileRecursive(0);

          }
        })
      }
      else {
        this.saveImportFileRecursive(0);
      }

    }
    catch (err) {
      this.saveImportFileRecursive(0);
    }
  }

  openResumeDetails(resume) {
    this.newTab(3, null, resume)
  }

  saveImportFileRecursive(n) {
    let l = this.resume_data_list.length;
    try {
      if (n < l) { //setting  key and value name from array
        this.title_data.forEach(element => {
          if (element.type == "number") {
            this.res_data[element.to] = parseFloat(this.resume_data_list[n][element.from]) || 0;
          }
          else {
            this.res_data[element.to] = (this.resume_data_list[n][element.from]) || '';
          }
          this.res_data['files'] = this.resume_data_list[n]['files'] || null
          // if (element.type == "array") {
          //   this.res_data[element.to] = (this.resume_data_list[n][element.from]) || []
          // }
        });
        console.log(this.resume_data_list[n].file)
        this.resume_import_srv.importResume({ resume_details: this.res_data, resume_master_details: this.resume_master_details }, this.multiple_flag).subscribe(res => {

          try {
            if (res && res['data']) {
              let status = JSON.parse(res['data'])
              if (status && status['cv_status']) {
                this.import_details.valid_status = true;
                this.resume_data_list[n]['cv_import_status'] = status['cv_status'];
                this.resume_data_list[n]['res_id'] = status['cv_status'].resume_id;
                if (status['cv_status'].resume_id) {
                  this.import_details.valid_resume_id = true;
                }
              }
              // if (status && status['tagging_status']) {
              //   this.import_details.valid_tagging_status = true;
              //   this.resume_data_list[n]['tagging_status'] = status['tagging_status'][0];
              //   this.resume_data_list[n]['requirement_id'] = status['tagging_status'][0].req_id;
              //   if (status['tagging_status'].req_id) {
              //     this.import_details.valid_resume_id = true;
              //   }
              //   if (status['tagging_status'].req_res_id) {
              //     this.resume_data_list[n]['req_res_id'] = status['tagging_status'][0].req_res_id;
              //   }
              // }
              if (status && status['tagging_status']) {
                this.import_details.valid_tagging_status = true;
                this.resume_data_list[n]['tagging_status'] = status['tagging_status'];
                this.resume_data_list[n]['requirement_id'] = status['tagging_status'].req_id;
                if (status['tagging_status'].req_id) {
                  this.import_details.valid_resume_id = true;
                }

                if (status['tagging_status'].req_res_id) {
                  this.resume_data_list[n]['req_res_id'] = status['tagging_status'].req_res_id;
                }
              }


              // this.dynamic_data_list[n].status = res['message'];
            }
          }
          catch (err) {
            console.log(err)
          }

          this.saveImportFileRecursive(n + 1);
        });
      }
      else {
        this.import_details.imp_loading = false;

      }
    }
    catch (err) {


    }

  }

  rowEdit(i, row) {
    // this.change_detector.detectChanges();
    // this.backup_resume_list = this.resume_data_list;
    this.current_row = i;

    this.import_details.valid_row_edit = true;

  }

  updateTableRow() {
    this.import_details.valid_row_edit = false;
    this.current_row = -1;

  }

  undoChanges(i) {
    this.import_details.undo_flag = true;
    let cp = cloneArray(this.backup_resume_list)
    this.resume_data_list[i] = cp[i];
    this.resume_data_list = cloneArray(this.resume_data_list)

    this.current_row = -1;
    this.import_details.valid_row_edit = false;
    // this.application_ref.tick();
    this.change_detector.detectChanges();
    this.change_detector.markForCheck();
  }
  eventPortal() {
    console.log('Hel')
    if (this.action_form.value.job_portal) {
      let event = new CustomEvent('selectedTheRequirement', {
        detail: {
          DAD: 0,
          DuplicateTallintURL: "http://23.236.49.140:1002/api/v1.1/WM/portal/checkApplicantForPacehcm",
          duplicateCheckApiUrl: "http://23.236.49.140:1002/api/v1.1/WM/portal/checkPortalApplicantsMonster",
          heMasterId: 2020,
          overwriteResumeOnlyDoc: 1,
          overwriteResumeWithDoc: 1,
          password: 'pass1',
          portal: {
            DAD: 0,
            DuplicateTallintURL: "http://23.236.49.140:1002/api/v1.1/WM/portal/checkApplicantForPacehcm",
            duplicateCheckApiUrl: "http://23.236.49.140:1002/api/v1.1/WM/portal/checkPortalApplicantsMonster",
            portalId: 2,
            portalName: "Monster",
            resumeSaveApiUrl: "http://23.236.49.140:1002/api/v1.1/WM/portal/savePortalApplicantsMonster",
            tallintURL: "http://23.236.49.140:1002/api/v1.1/WM/portal/saveApplicantForPacehcm",
            tokenInURL: 1
          },
          requirements: [3613],
          resumeSaveApiUrl: "http://23.236.49.140:1002/api/v1.1/WM/portal/savePortalApplicantsMonster",
          tallintURL: "http://23.236.49.140:1002/api/v1.1/WM/portal/saveApplicantForPacehcm",
          token: "b8d06768-9e5b-11ea-aefe-42010af00005",
          token_in_url: 1,
          userName: 'tom',
          version: "1",
        }
      });
      document.dispatchEvent(event);
    }
    else {
      this.notification.snackbar('Please select a portal to proceed', 'Close', 5000);
    }

  }
}

  // @HostListener('window : scroll', ['$event'])
  // scroll(event) {


  // }
