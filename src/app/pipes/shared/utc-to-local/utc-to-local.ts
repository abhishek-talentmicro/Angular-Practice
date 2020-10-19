import { PipeTransform, Pipe } from '@angular/core';
@Pipe({
    name: 'UtcToLocalTime'
})
export class UTCtoLocalPipe implements PipeTransform {
    // transform(val: any): any {
    //     try {
    //         new Date(val);
    //         super.transform(val, "d-MMM-yyyy h:mm a")
    //         return val;
    //     }
    //     catch (e) {
    //         return null;
    //     }
    transform(val: any): Date {
        try {
            new Date(val);
            return val;
        }
        catch (e) {
            return null;
        }
        // return val;

        // return val;
    }
}

