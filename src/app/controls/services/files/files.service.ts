import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StandardFile } from '../../classes/file/file';

@Injectable()
export class FilesService {
  constructor(private http: HttpClient) { }

  api_url = environment.SERVER_URL;
  convertFilesToBase64(files) {
    return new Observable((obs) => {
      if (files && files.length) {
        let converted = [];
        for (let i = 0; i < files.length; i++) {
          if (files[i]) {
            let reader = new FileReader();

            reader.onload = () => {
              let file = new StandardFile();
              let extension;
              try {
                let length = files[i].name.split('.').length;
                extension = files[i].name.split('.') ? files[i].name.split('.')[length - 1] : '';
                if(extension){
                  extension = extension.toLowerCase();
                }
              }
              catch (err) {
                extension = '';
              }

              file.setFileDetails(files[i].name, files[i].type, reader.result, extension, 1, 0, files[i].size, 1, null)
              converted.push(file);
              if (files.length == converted.length) {
                obs.next(converted);
              }
            }
            reader.readAsDataURL(files[i]);
          }
        };
      }
      else {
        obs.next([]);
      }
    })
  }


  // convertFilesToBase64(files) {
  //   return new Observable((obs) => {
  //     if (files && files.length) {
  //       let converted = [];
  //       for (let i = 0; i < files.length; i++) {
  //         if (files[i]) {
  //           let reader = new FileReader();

  //           reader.onload = () => {
  //             let file = new ICRFile();
  //             file.setFileDetails(files[i].name, files[i].type, files[i].size, files[i], reader.result, null)
  //             converted.push(file);
  //             if (files.length == converted.length) {
  //               obs.next(converted);
  //             }
  //           }
  //           reader.readAsDataURL(files[i]);
  //         }
  //       };
  //     }
  //     else {
  //       obs.next([]);
  //     }
  //   })
  // }

  convertBase64ToFiles(files) {
    return new Observable((obs) => {
      if (files && files.length) {
        let converted = [];
        for (let i = 0; i < files.length; i++) {
          if (files[i]) {
            files[i].file = this.dataURLtoFile(files[i].base64, files[i].fileName);
          }
        };
        obs.next(files);
      }
      else {
        obs.next([]);
      }
    })
  }

  dataURLtoFile(dataurl, filename) {
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

  saveAttachments(files, multiple) {
    if (multiple && files && files.length) {
      return new Observable(obs => {
        this.recursiveSave(files, 0, [], obs);
      })
    }
    else if (files && files.length == undefined) {
      return this.saveAttachment(files)
    }
    else {
      return new Observable(obs => {
        obs.next(null);
      });
    }
  }

  recursiveSave(files, index, response, observable) {
    if (files[index] && files[index].file) {
      this.saveAttachment(files[index]).subscribe(res => {
        if (!response) {
          response = [];
        }
        response.push(res['data']);
        if (index < files.length - 1) {
          return this.recursiveSave(files, ++index, response, observable);
        }
        else {
          observable.next(response);
        }
      }, err => {

      })
    }
    else {
      response.push(files[index]);
      if (index < files.length - 1) {
        return this.recursiveSave(files, ++index, response, observable);
      }
      else {
        observable.next(response);
      }
    }
  }

  saveAttachment(file) {
    let fd = new FormData();
    fd.append('attachment', file.file, file.fileName);
    return new Observable(res => {
      res.next();
    })
    // return this.http.post("", fd)
  }

  verifyDocument(obj, params?) {
    return this.http.post(this.api_url + 'OnBoarding/DocumentsVerification', obj, {
      params: params
    })
  }

}
