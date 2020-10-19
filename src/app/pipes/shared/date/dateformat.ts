import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';


@Pipe({
  name: 'dateformat'
})
export class Dateformat implements PipeTransform {
  transform(items: any) {
    let d = new Date(items)
    return moment(d).format('DD-MMM-YYYY')
  }
}


@Pipe({
  name: 'time'
})
export class TimeFormat implements PipeTransform {
  transform(items: any) {
    let d = (items)
    d = String(d)
    return d.substring(d.indexOf('T') + 1)
  }
}
@Pipe({
  name: 'fulltime'
})
export class FulltimeFormat implements PipeTransform {
  transform(items: any) {
    let d = String(items)
    return d.substring(d.indexOf(':') - 2, d.indexOf(':') + 6);
  }
}

@Pipe({
  name: 'timeAgo'
})

export class timeAgo implements PipeTransform {
  transform(date) {
    try {
      return moment(date).fromNow();
    }
    catch (err) {
      return date;
    }
  }
}
