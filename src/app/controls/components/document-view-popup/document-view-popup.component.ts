import { Component, OnInit, Inject, Input, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { makeFormDataFile, downloadFile } from '../../functions/file-function';
import { ExportExcelService } from 'src/app/services/vendor-management/workbench/export-excel/export-excel.service';
@Component({
  selector: 'app-document-view-popup',
  templateUrl: './document-view-popup.component.html',
  styleUrls: ['./document-view-popup.component.scss'],
  providers: [ExportExcelService]

})
export class DocumentViewPopupComponent implements OnInit {
  doc_file = false;

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DocumentViewPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private excel_svc: ExportExcelService


  ) { }

  @Input() all_files;
  @Input() file;
  @Input() index;
  @Input() other_data;
  loader = true;
  negative_index;
  index_outof_bound;
  reset_embed_tag = true;
  reset_object_tag = true;


  ngOnInit() {
    this.loaderFn();
    this.all_files = this.previewCheck(this.all_files);
    this.getXslx(this.all_files[this.index]);
    this.getDocxBase64(this.all_files[this.index])
  }

  previousFile() {
    this.doc_file = false;
    this.reset_embed_tag = false;
    this.reset_object_tag = false;
    if (this.index == 0) {
      this.index_outof_bound = false;
    }
    else {
      this.index--;
      this.loaderFn();
      this.getXslx(this.all_files[this.index]);
      this.getDocxBase64(this.all_files[this.index])


    }
    setTimeout(() => {
      this.reset_embed_tag = true;
      this.reset_object_tag = true;
    })
  }

  nextFile() {
    this.doc_file = false;
    this.reset_embed_tag = false;
    this.reset_object_tag = false;
    if (this.index == this.all_files.length - 1) {
      this.index_outof_bound = true;
      this.index = this.all_files.length - 1;
    }

    else {
      this.index++;
      this.loaderFn();
      this.getXslx(this.all_files[this.index]);
      this.getDocxBase64(this.all_files[this.index])

      this.index_outof_bound = false;
    }

    setTimeout(() => {
      this.reset_embed_tag = true;
      this.reset_object_tag = true;
    })
  }
  close() {
    this.dialogRef.close();
  }

  previewCheck(file_arr) {
    let file_ext = ['xlsx']
    for (let index = 0; index < file_arr.length; index++) {
      let file = file_arr[index];
      // if (file_ext.includes((file.file_title).split('.').pop())) {
      if (((file.file_title).split('.').pop() == 'docx' || (file.file_title).split('.').pop() == 'doc') && !(file && file.file_path && file.file_path != '')) {
        file['is_doc'] = 1;
      }
      if ((file.file_title).split('.').pop() == 'xlsx' || (file.file_title).split('.').pop() == 'xls') {
        file['is_table'] = 1;
      }
      // }
    }
    return file_arr;
  }


  getXslx(details) {
    let file_ext = ['xls', 'xlsx'];
    if (file_ext.includes((details.file_title).split('.').pop().toLowerCase()) && !details['table_data']) {
      if (details.file_path && details.file_path != '') {
        this.excel_svc.importFromFilepath(details.file_path).subscribe(res => {
          try {
            let reader = new FileReader();
            reader.readAsBinaryString(res.body);
            reader.onloadend = (ev) => {
              const file = reader.result;
              var base64data = reader.result;
              let bstr = (base64data);
              Promise.all([
                import("xlsx")
              ]).then((modules) => {
                const XLSX = modules[0];
                const wb = XLSX.read(file, { type: 'binary' });
                const wsname: string = wb.SheetNames[0];
                let jsonData = wb.SheetNames.reduce((initial, name) => {
                  const sheet = wb.Sheets[name];
                  initial[name] = XLSX.utils.sheet_to_json(sheet);
                  return initial;
                }, {});
                details['table_data'] = jsonData[wsname];
              })
                .catch((err) => {
                  console.log(err);
                })
            }
          }
          catch (err) {
            details['table_data'] = undefined;
          }
          return true;
        },
          err => {
            details['table_data'] = undefined;
            return null;
          })
      }
      else {
        try {
          let reader = new FileReader();
          let f = makeFormDataFile(details)
          reader.readAsBinaryString(f);
          reader.onload = (ev) => {
            const file = reader.result;
            var base64data = reader.result;
            let bstr = (base64data);
            Promise.all([
              import("xlsx")
            ]).then((modules) => {
              const XLSX = modules[0];
              const wb = XLSX.read(file, { type: 'binary' });
              const wsname: string = wb.SheetNames[0];
              let jsonData = wb.SheetNames.reduce((initial, name) => {
                const sheet = wb.Sheets[name];
                initial[name] = XLSX.utils.sheet_to_json(sheet);
                return initial;
              }, {});
              details['table_data'] = jsonData[wsname];
            })
              .catch((err) => {
                console.log(err);
              })
          }

        }
        catch (err) {
          details['table_data'] = undefined;
        }
      }
    }
  }



  loaderFn() {
    this.loader = true;
    setTimeout(() => {
      this.loader = false;
    }, 5000)
  }

  downloadFile(file) {
    downloadFile(file, this.excel_svc);
  }


  getDocxBase64(file) {
    let file_ext = ['doc', 'docx'];
    if (file) {
      if (file_ext.includes((file.file_title).split('.').pop().toLowerCase())) {
        if (!(file && file.file_path && file.file_path != '')) {
          this.excel_svc.getDocxBase64(file, file.file_path).subscribe(res => {
            if (res && res['data'] && res['data']['base64String']) {
              if (res['data']['base64String'].indexOf('data:application/pdf;base64,') > -1) {
                file.base64 = res['data']['base64String'];
              }
              else {
                file.base64 = 'data:application/pdf;base64,' + res['data']['base64String'];
              }
              file.converted_mime_type = res['mime_type'];
            }
          })
        }
      }
    }
  }

  makeFormDataFile(file) {
    return makeFormDataFile(file);
  }
}






