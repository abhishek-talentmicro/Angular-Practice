import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SocialMediaService } from 'src/app/services/vendor-management/workbench/social-media/social-media.service';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-social-media-share',
  templateUrl: './social-media-share.component.html',
  styleUrls: ['./social-media-share.component.scss'],
  providers: [SocialMediaService]
})
export class SocialMediaShareComponent implements OnInit {

  portals = [];
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  share_link;
  smp_template: any = [];
  smp_template_ref: any = [];
  smp_template_length;
  smp_template_index;
  isLinear = false;
  constructor(
    public dialogRef: MatDialogRef<SocialMediaShareComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private sm_service: SocialMediaService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.sm_service.getShareLink(this.data.req_id).subscribe(res => {
      this.portals = res['data'].share_link;
      this.share_link = res['data'].link;
      // this.smp_template_index = 1;
      // this.smp_template = res['data'].smp_template;
      // this.smp_template_ref = res['data'].smp_template[0];
      // this.smp_template_length = this.smp_template.length;
    });
  }

  share(sid) {
    this.portals.forEach(item => {
      if (item['portal_id'] == sid) {
        // if (!item['call_api'] && sid != 5) {
        window.open(item.share_link, '_blank');
        // }
        // else {
        // this.loginService.loginTwitter(item['api_url'] || 'http://localhost:3000/').subscribe(res => {

        //   window.location.href = `https://api.twitter.com/oauth/authorize?oauth_token=${res['token']}`;
        // })
        // window.location.href = "https://api.twitter.com/oauth/authorize";
        // }
      }
    })
  }

  copyLink(param) {
    let inp = document.getElementById('share_link_input') as HTMLInputElement;
    inp.focus();
    inp.select();
    document.execCommand('copy');
  }

  // copyTemplate(param) {
  //   // let inp = document.getElementById('temp_body_input') as HTMLInputElement;
  //   let inp = param;
  //   inp.focus();
  //   inp.select();
  //   document.execCommand('copy');
  // }
  copyTemplate(val: string, stepper: MatStepper) {
    let temp = document.createElement('textarea');
    temp.style.position = 'fixed';
    temp.style.left = '0';
    temp.style.top = '0';
    temp.style.opacity = '0';
    temp.value = val;
    document.body.appendChild(temp);
    temp.focus();
    temp.select();
    document.execCommand('copy');
    document.body.removeChild(temp);
    this._snackBar.open('Copied a Template');
    stepper.next();
  }

  nextMedia() {
    if (this.smp_template_index < this.smp_template_length) {
      this.smp_template_index++;
      this.smp_template_ref = this.smp_template[this.smp_template_index - 1];
    }
  }
  prevMedia() {
    if (this.smp_template_index > 1) {
      this.smp_template_index--;
      this.smp_template_ref = this.smp_template[this.smp_template_index - 1];
    }
  }
  skip(stepper: MatStepper) {

    //if a language is selected, create a new language tab
    // this._snackBar.open('Copied a Template');
    stepper.next();

  }
}
