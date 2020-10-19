import { AppComponent } from '../app.component';
import { MatDialogConfig } from '@angular/material/dialog';
import { DocumentViewPopupComponent } from '../controls/components/document-view-popup/document-view-popup.component';


export const queryStringToJSON = (input) => {
  var pairs = input.split('&');
  var result = {};
  pairs.forEach(function (pair) {
    pair = pair.split('=');
    result[pair[0]] = decodeURIComponent(pair[1] || '');
  });

  return JSON.parse(JSON.stringify(result));
}

export const jsonToQueryString = (params) => {
  return Object.keys(params).map(key => key + '=' + params[key]).join('&');
}

export function cloneArray(items) {
  if (items && items.length) {
    return items.map(item => Object.assign({}, item));
  }
  else {
    return [];
  }
}

export function jsonParse(str) {
  try {
    if (typeof str == 'string')
      return JSON.parse(str);
    else
      return str;
  } catch (e) {

    if (typeof str == 'object')
      return str;
    else
      return str;
  }
}

// export function tabKey() {
//   return AppComponent.tab_key;
// }

// export function makeFormDataFile(file) {
//   try {
//       if (file) {
//           let base64 = (file.content);
//           let file_title = (file.file_title);
//           let mime_type = (file.mime_type);
//           function dataURLtoFile(dataurl, filename) {

//               var arr = dataurl.split(','),
//                   mime = arr[0].match(/:(.*?);/)[1],
//                   bstr = atob(arr[1]),
//                   n = bstr.length,
//                   u8arr = new Uint8Array(n);

//               while (n--) {
//                   u8arr[n] = bstr.charCodeAt(n);
//               }

//               return new File([u8arr], filename, { type: mime });
//           }
//           let formatted_file = dataURLtoFile(base64, file_title);
//           return formatted_file;
//       }
//   }
//   catch (err) {


//   }

// }

export function viewDocument(all_files, file, dialog, other_data?) {
  const dialogConfig = new MatDialogConfig()
  dialogConfig.width = '60%';
  dialogConfig.height = '80%';
  const dialogRef = dialog.open(DocumentViewPopupComponent, dialogConfig);
  (dialogRef.componentInstance).file = file;
  (dialogRef.componentInstance).all_files = all_files;
  (dialogRef.componentInstance).other_data = other_data;
  (dialogRef.componentInstance).index = all_files.indexOf(file) == -1 ? 0 : all_files.indexOf(file);
  dialogRef.afterClosed().subscribe(value => {
    if (value) {
      console.log(value)
    }
  }, err => {

  })

}
export function downloadFile(file, file_save_svc) {
  if (file && file.file_path && file.file_path != '') {
    // file_save_svc.importFromFilepath(file.file_path).subscribe(res => {
    //     if (res && res.body) {
    file_save_svc.saveFile(null, file.file_title, file.file_path);
    // }
    // },
    // err => {

    // })
  }
  else {
    let blob = makeFormDataFile(file);
    file_save_svc.saveFile(blob, file.file_title);
  }
}
export function makeFormDataFile(file) {
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
