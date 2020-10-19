import {Injectable} from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';

@Injectable(
)
export class ExportExcelService {

  fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  fileExtension = '.xlsx';
  constructor(
    private http : HttpClient
  ) {}
  public exportExcel(jsonData: any[], fileName: string): void {
    let wscols = []
    let objectMaxLength = [];
    for (let i = 0; i < jsonData.length; i++) {
      let value = <any>Object.values(jsonData[i]);
      if (value && value.length) {
        for (let j = 0; j < value.length; j++) {
          objectMaxLength[j] = 15;
          if (value && value[j] && value[j].length) {
            objectMaxLength[j] = objectMaxLength[j] >= value[j].length ? objectMaxLength[j] : value[j].length;
          }
        }
      }

    }
    console.log(objectMaxLength);

   if(jsonData.length > 10){
    for (let j = 0; j < 10; j++) {
      for (let i = 0; i < (Object.keys(jsonData[j])).length; i++) {
        let key = (Object.keys(jsonData[j])[i]);
        if (objectMaxLength[i] < key.length) {
          objectMaxLength[i] = key.length;
        }
        wscols.push({ width: objectMaxLength[i] })
      }
      
    }
   }
   else{
    for (let j = 0; j < jsonData.length; j++) {
      for (let i = 0; i < (Object.keys(jsonData[j])).length; i++) {
        let key = (Object.keys(jsonData[j])[i]);
        if (objectMaxLength[i] < key.length) {
          objectMaxLength[i] = key.length;
        }
  
        wscols.push({ width: objectMaxLength[i] })
      }
      
    }
   }




    let ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
    ws["!cols"] = wscols;
    let range = XLSX.utils.decode_range(ws['!ref']);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        let cell_address = { c: C, r: R };
        let cell_ref = XLSX.utils.encode_cell(cell_address);
        try {
          let d = moment(ws[cell_ref].v, moment.ISO_8601);
          if (d.isValid()) {
            ws[cell_ref].t = 'd';
            ws[cell_ref].z = 'dd/mmm/yyyy'
            // ws['wpx'] = "25"
            // ws[cell_ref].w = new Date(ws[cell_ref].v)
          }
          // if ((moment(ws[cell_ref].v))['_isValid']) {
          //   if ((ws[cell_ref].v)) {

          //   }
          // }
        }
        catch (err) { }
      }
    }
    let wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveExcelFile(excelBuffer, fileName);
  }

  private saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: this.fileType });
    FileSaver.saveAs(data, fileName + this.fileExtension);
  }

  saveFile(blob, fileName, path?) {
    if (path) {
      // FileSaver.saveAs(path, fileName);
      this.downloadFile(path, 1).subscribe(res => {
        const data: Blob = new Blob([res.body], { type: res.body.type });
        FileSaver.saveAs(data, fileName);
      })
    }
    else {
      const data: Blob = new Blob([blob], { type: blob.type });
      FileSaver.saveAs(data, fileName);
    }

  }

  exportFileToexcel(obj) {
    let ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(obj);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
  }


  importFromFilepath(filepath) {
    return this.http.get(filepath, { responseType: 'blob', observe: 'response' })
  }

  downloadFile(filepath, original_flag) {

    return this.http.get(filepath, {
      params: {
        original_type: original_flag || 1
      },
      responseType: 'blob', observe: 'response'
    }
    )
  }

  getDocxBase64(file, filepath) {
    let obj = [];
    obj.push(file)
    return this.http.post(environment.SERVER_URL + 'Document/Converter', obj, {
      params: {
        file_path: filepath || ''
      }
    })
  }
}
