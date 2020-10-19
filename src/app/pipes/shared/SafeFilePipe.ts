
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from "@angular/common";
@Pipe({ name: 'SafeFilePipe' })
export class SafeFilePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}



@Pipe({ name: 'SanitizePipe' })
export class SanitizePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(value: any, type: string): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
    try {
      if(value){
        switch (type) {
          case 'html': return this.sanitizer.bypassSecurityTrustHtml(value);
          case 'style': return this.sanitizer.bypassSecurityTrustStyle(value);
          case 'script': return this.sanitizer.bypassSecurityTrustScript(value);
          case 'url': return this.sanitizer.bypassSecurityTrustUrl(value);
          case 'resourceUrl': return this.sanitizer.bypassSecurityTrustResourceUrl(value);
          default: throw new Error(`Invalid safe type specified: ${type}`);
        }
      }
    }
    catch (err) {
      return value
    }
  }
}

@Pipe({
  name: "evalPipe",
})
export class evalPipe implements PipeTransform {
  transform(condition, t_id, section, requirement_details?, i?, row_data?,parent_form?) {
    if (condition) {
      try {
        console.log(t_id)
        console.log(section)
        if (eval(condition)) {
          return true
        }
        else {
          return false
        }
      }
      catch (err) {
        console.log(err);
        console.error("Invalid Condition")
        return true
      }
    }
    else {
      return true
    }
  }
}