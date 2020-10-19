import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ApplicantAttachments } from 'src/app/classes/workbench/applicant-attachments/applicant-attachments';
import { ApplicantAttachmentsService } from 'src/app/services/vendor-management/workbench/applicant-attachments/applicant-attachments.service';


@Component({
  selector: 'app-applicant-attachments',
  templateUrl: './applicant-attachments.component.html',
  styleUrls: ['./applicant-attachments.component.scss']
})
export class ApplicantAttachmentsComponent implements OnInit {

  applicatnt_attachment_form:FormGroup
  req_res_list:Array<any>=[]
  applicant_attachment_obj = new ApplicantAttachments();
  loading:boolean=false
  constructor(
    // @Inject(MAT_DIALOG_DATA) private data,
    private applicant_attchment_svc: ApplicantAttachmentsService,
    private dialogref:MatDialogRef<ApplicantAttachmentsComponent>,
    private fb:FormBuilder
  ) { }
  selected_entries: Array<any>;

  ngOnInit() {

   
    this.loadForm();
    this.getApplicantIds()
  }


  loadForm(){
    this.applicatnt_attachment_form=this.fb.group({
      req_res_id:[''],
      requirement_id:[''],
      attachments:[''],
      notes:['']
    })
  }
  getApplicantIds(){
    if(this.selected_entries&&this.selected_entries.length>0){
      for(let i of this.selected_entries){
        this.req_res_list.push(i.req_res_id)
      }
    }

    // if(this.applicatnt_attachment_form){
    //   this.applicatnt_attachment_form.patchValue({
    //     req_res_id:this.req_res_list
    //   })
    // }
  }

  
  

  saveApplicantAttachments(){
   if(this.applicatnt_attachment_form.valid){
    try{
      this.loading=true

    this.applicant_attachment_obj.setData(this.applicatnt_attachment_form.value)
    this.applicant_attchment_svc.uploadAttachments(this.applicant_attachment_obj.getData()).subscribe(res=>{
      this.loading=false

      if(res['status']){
        this.dialogref.close()
      }else{
        this.loading=false
      }
    },err=>{
      this.loading=false

    })
    }
    catch(e){

      
    }
   }else{
     this.markFormGroupTouched(this.applicatnt_attachment_form)
   }
  }
  
  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      control.markAsDirty();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  close(){
    this.dialogref.close()
  }
}