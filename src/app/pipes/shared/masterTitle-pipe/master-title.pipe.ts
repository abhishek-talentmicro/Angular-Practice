import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'StaticMasterPipe'
})
export class StaticMasterPipe implements PipeTransform {
    transform(code: any, masters: any[]): string {
        let out_str;
        if (code && masters && typeof masters == 'object' && masters.length) {
            masters.forEach(master => {
                if (master.code == code) {
                    out_str = master.title;
                }
            })
        }

        return out_str || ''
    }
}