import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { jsonParse } from 'src/app/app.component';
import { TranslateService } from "@ngx-translate/core";
import { DatePipe } from '@angular/common';
import { DynamicFieldMasterTitle, DynamicFilesTitlePipe } from 'src/app/controls/components/dynamic-section/dynamic-section.component';
import { HTMLFormatter, prepareSections } from 'src/app/controls/components/dynamic-form/dynamic-form.component';
import { ProfileSettingsService } from 'src/app/services/shared/profile-settings/profile-settings.service';
import { WorkbenchService } from 'src/app/services/vendor-management/workbench/workbench.service';
import { ViewAssessmentsService } from 'src/app/services/vendor-management/workbench/view-assessments/view-assessments.service';

@Component({
  selector: 'app-view-assessments',
  templateUrl: './view-assessments.component.html',
  styleUrls: ['./view-assessments.component.scss'],
  providers: [
    WorkbenchService,
    ViewAssessmentsService, HTMLFormatter,
    DatePipe, DynamicFieldMasterTitle, DynamicFilesTitlePipe
  ],

})
export class ViewAssessmentsComponent implements OnInit {
  id
  section_data: any;
  masters: any;
  form_code: any;
  form_group: FormGroup;
  display_type;
  candidate_information;
  candidate_details;
  print_tag;
  logo;
  title;

  constructor(
    private dialogRef: MatDialogRef<ViewAssessmentsComponent>,
    private view_svc: ViewAssessmentsService,
    private workbench_service: WorkbenchService,
    private change_detector: ChangeDetectorRef,
    private translate_pipe: TranslateService,
    private datePipe: DatePipe,
    private master_pipe: DynamicFieldMasterTitle,
    private file_pipe: DynamicFilesTitlePipe,
    private html_formatter: HTMLFormatter,
    private fb: FormBuilder,
    private profile_svc: ProfileSettingsService
  ) {
    this.form_group = new FormGroup({});
  }

  ngOnInit() {
    this.getDetails(this.id).then(res => {
      this.getMasters(res)
    })
    // this.profile_svc.rmsLogo.subscribe(logo => {
    //   console.log(logo)
    //   if (logo && logo.SC596) {
    //     this.logo = logo.SC596;
    //   }
    //   if (logo && logo.SC5103) {
    //     this.title = logo.SC5103 || '';
    //   }
    // })
  }
  getDetails(id) {
    return new Promise((resolve, reject) => {
      this.view_svc.getDetails(id).subscribe(res => {
        let master_obj = [];
        if (res['status']) {
          this.section_data = res['data'].assessment_details;
          this.candidate_information = res['data'].candidate_details;
          this.candidate_details = res['data'].candidate_details;
          this.form_code = res['data'].assessment_details[0].template_code;
          let virtual_scroll_fields = {}
          prepareSections(this.section_data, this.form_group, this.section_data, this.id, this.fb, this.display_type, virtual_scroll_fields);
          console.log(virtual_scroll_fields);

          for (let i = 0; i < Object.keys(virtual_scroll_fields).length; i++) {
            let obj = {}
            let master_id = Object.keys(virtual_scroll_fields)[i];
            obj['master_id'] = master_id;
            obj['values'] = virtual_scroll_fields[master_id];
            master_obj.push(obj);
          }
        }
        resolve(master_obj)

      })
    })

  }

  close() {
    this.dialogRef.close()
  }

  fetchStylesheets(){
    var output:string= '';
    for(var i=0;i<document.styleSheets.length;i++){
      output = output +' <link rel="stylesheet" type="text/css" href="'+    
               window.document.styleSheets[0].href +'" /> ';
    }
    return output;
}
  getMasters(obj) {
    this.workbench_service.getFormMaster(obj, { template_code: this.form_code, t_id: 0, form_code: 0 }).subscribe(masters => {
      this.masters = masters['data'].masters;
      this.change_detector.detectChanges();
    })
  }
   print(horizonalPrint, printFooter) {
    let win;
    this.print_tag = 1

    setTimeout(() => {
      let printContents = document.getElementById('print-content').innerHTML;
      let body = document.body.innerHTML;
      let head = document.head.innerHTML  + this.fetchStylesheets();
      let mywindow = window.open();
      mywindow.document.head.innerHTML = head;
      mywindow.document.getElementsByTagName('title')[0].innerText = ""
      mywindow.document.body.innerHTML = printContents;
      setTimeout(() => {
        mywindow.print();
        mywindow.close();
        this.print_tag = 0
      })
      mywindow.focus();
      window.close();
    }, 100);

    // document.body.innerHTML = printContents;

    // window.print();

    // document.body.innerHTML = originalContents;


    // let table_content = `<h6 style="border-bottom:1px solid gainsboro; padding:5px">` + this.section_data[0].template_title + `</h6>` + this.printString(this.section_data)
    // let header = horizonalPrint ?
    //   `<html>
    //     <link rel="stylesheet" type="text/css" media="screen,print" href="assets/bootstrap/bootstrap.min.css">
    // <head>`
    //   :
    //   `<html>
    //     <head>
    //       <link rel="stylesheet" type="text/css" media="screen,print" href="assets/bootstrap/bootstrap.min.css">`;


    //   mywindow.document.write(`
    // <table>
    //   <thead>
    //   <tr><td class>
    //     <div class="header"><img src = "assets/logo-tallint.png"></div>
    //   </td></tr>
    //   </thead>

    //   <tbody> `+


    //     this.printCandidateDetais(this.candidate_information) +

    //     table_content
    //     + `

    //   </table></tbody>

    // </table>`
    //   );
    // mywindow.document.write(document.getElementById('print-content').innerHTML);

    // if (!printFooter) {
    //   mywindow.document.write('<footer class="print-footer">' + (".print-footer") + '</footer>');
    // }
    // mywindow.document.write('</body></html>');
  }


  printString(section_list) {
    let table_rows = "";
    let out_str;
    let label;
    let prefix;
    let suffix;

    if (section_list && typeof section_list == 'object' && section_list.length) {
      section_list = jsonParse(section_list);
      section_list.forEach(section => {
        section = jsonParse(section);
        if (section) {
          section.field_details.forEach(field => {
            section.data = jsonParse(section.data);
            if (section.data && typeof section.data == 'object' && section.data.length) {
              section.data.forEach(data => {
                if (data[field.field_name]) {
                  if (field.control_type_id == 9) {
                    out_str = this.datePipe.transform(data[field.field_name], 'mediumDate');
                  }
                  else if (field.control_type_id == 10) {
                    out_str = this.datePipe.transform(data[field.field_name], 'medium');
                  }

                  else if (field.master_prop_name) {
                    out_str = this.html_formatter.transform(this.master_pipe.transform(data[field.field_name], this.masters[field.master_prop_name], this.masters))
                  }

                  else if (field.control_type_id == 19 || field.control_type_id == 20) {
                    out_str = this.file_pipe.transform(data[field.field_name])
                  }

                  else if (field.control_type_id == 12) {
                    try {
                      out_str = eval(data[field.field_name])
                        ?
                        field.checkbox_true_label && field.checkbox_true_label != '' ? (this.html_formatter.transform(this.translate_pipe.get(field.module_code + '_' + field.sub_module_code + '_' + field.form_code + '_' + field.checkbox_true_label)['value'])) : 'Yes'
                        :
                        field.checkbox_false_label && field.checkbox_false_label != '' ? (this.html_formatter.transform(this.translate_pipe.get(field.module_code + '_' + field.sub_module_code + '_' + field.form_code + '_' + field.checkbox_false_label)['value'])) : 'No';
                    }
                    catch (err) {

                    }

                  }

                  else {
                    out_str = this.html_formatter.transform(data[field.field_name]);
                  }
                  label = field.label_code ? this.html_formatter.transform(this.translate_pipe.get(field.module_code + '_' + field.sub_module_code + '_' + field.form_code + '_' + field.label_code)['value']) : null;
                  prefix = field.prefix_code ? this.html_formatter.transform(this.translate_pipe.get(field.module_code + '_' + field.sub_module_code + '_' + field.form_code + '_' + field.prefix_code)['value']) : null;
                  suffix = field.suffix_code ? this.html_formatter.transform(this.translate_pipe.get(field.module_code + '_' + field.sub_module_code + '_' + field.form_code + '_' + field.suffix_code)['value']) : null;
                  table_rows += ('<tr><td class="w-75">' + (label ? label : '') + '</td><td class="w-25">' + ((prefix ? (prefix + ' ') : '') + out_str + (suffix ? (' ' + suffix) : '')) + '</td></tr>');
                }
                else {
                  let check;

                  if (field.control_type_id == 12) {
                    try {
                      check = eval(data[field.field_name])
                        ?
                        field.checkbox_true_label && field.checkbox_true_label != '' ? (this.html_formatter.transform(this.translate_pipe.get(field.module_code + '_' + field.sub_module_code + '_' + field.form_code + '_' + field.checkbox_true_label)['value'])) : 'Yes'
                        :
                        field.checkbox_false_label && field.checkbox_false_label != '' ? (this.html_formatter.transform(this.translate_pipe.get(field.module_code + '_' + field.sub_module_code + '_' + field.form_code + '_' + field.checkbox_false_label)['value'])) : 'No';
                    }
                    catch (err) {

                    }
                  }


                  label = field.label_code ? this.html_formatter.transform(this.translate_pipe.get(field.module_code + '_' + field.sub_module_code + '_' + field.form_code + '_' + field.label_code)['value']) : null;
                  prefix = field.prefix_code ? this.html_formatter.transform(this.translate_pipe.get(field.module_code + '_' + field.sub_module_code + '_' + field.form_code + '_' + field.prefix_code)['value']) : null;
                  suffix = field.suffix_code ? this.html_formatter.transform(this.translate_pipe.get(field.module_code + '_' + field.sub_module_code + '_' + field.form_code + '_' + field.suffix_code)['value']) : null;
                  table_rows += ('<tr><td class="w-75">' + (label ? label : '') + '</td><td class="w-25">' + ((prefix ? (prefix + ' ') : '') + (check ? check : '') + (suffix ? (' ' + suffix) : '')) + '</td></tr>');

                  // table_rows += ('<tr><td class="w-75">' + label ? label : '' + '</td><td class="w-25">' + prefix ? (prefix + ' ') : '' + ' ' + suffix ? (' ' + suffix) : '' + '</td></tr>');
                }
              })
            }
            else {
              label = this.html_formatter.transform(this.translate_pipe.get(field.module_code + '_' + field.sub_module_code + '_' + field.form_code + '_' + field.label_code)['value']);
              table_rows += ('<tr><td class="w-75">' + label + '</td><td class="w-25">      </td></tr>');
            }
          })

          if (section.sections && section.sections.length) {
            section.sections = jsonParse(section.sections);
            this.printString(section.sections);
          }
        }
      })
    }

    return '<table class="table table-bordered" style="table-layout: fixed">' + table_rows + '</table>';
  }


  printCandidateDetais(candidate_details) {
    let date;
    try {
      date = this.datePipe.transform(candidate_details['lu_on'], 'd-MMM-yyyy h:mm a') || candidate_details['lu_on'];
    }
    catch (err) {
      date = ''
    }
    candidate_details = jsonParse(candidate_details);
    return (`
  <table class="table table-bordered" >
    <tbody>
    <h6 style="border-bottom:1px solid gainsboro; padding:5px">Applicant Details</h6>
      <tr>
        <td scope="row">Applicant Name : ` + (candidate_details['name'] ? candidate_details['name'] : '') + `</td>
        <td scope="row">Applicant Email : ` + (candidate_details['email_id'] ? candidate_details['email_id'] : '') + `</td>
      </tr> 
      <tr>
        <td scope="row">Applicant Mobile Number  : ` + (candidate_details['phone_no'] ? candidate_details['phone_no'] : '') + `</td>
        <td scope="row">Resume Status  : ` + (candidate_details['resume_status'] ? candidate_details['resume_status'] : '') + `</td>
      </tr> 
      
      <tr>
      <td scope="row">Requirement : ` + (candidate_details['requirement_title'] ? candidate_details['requirement_title'] : '') + `</td>
      <td scope="row">Recruiter Name : ` + (candidate_details['recruiter_name'] ? candidate_details['recruiter_name'] : '') + `</td>
    </tr> 
    <tr>
    <td scope="row">Stage - Status : ` + (candidate_details['screening_stage'] ? candidate_details['screening_stage'] : '') + ' (' + (candidate_details['screening_status'] ? candidate_details['screening_status'] : '') + ')' + `</td>
    <td scope="row">Date : ` + (date ? date : '') + `</td>
    </tr> 
    ` + (candidate_details['source_name'] ? `<tr>
    <td scope="row">Source : ` + candidate_details['source_name'] + `</td> </tr> ` : '') + `
    <tbody>   
  </table>
    `)
  }


  // let customPrint = function (classesToLoad, horizonalPrint, printFooter) {
  //   let header = horizonalPrint ? '<style type="text/css" media = "print" >@page{size: landscape; width: 450mm; height: 300mm; } </style><html><head> <link href="/app - print.css" type="text/css" rel = "stylesheet" > ' : ' < html > <head><link href="/app-print.css" type = "text/css" rel = "stylesheet" > ';
  //   let mywindow = window.open('', 'PRINT', horizonalPrint ? 'height=650,width=1350' : 'fullscreen=1');
}