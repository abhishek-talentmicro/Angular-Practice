import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS
} from '@angular/material-moment-adapter';
import * as moment from 'moment';
//create our constant variable with the information about the format that we want
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD MMM YYYY',
  },
  display: {
    dateInput: 'DD MMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD MMM YYYY',
    monthYearA11yLabel: 'MMM YYYY',
  },
};

@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.css'],
  providers: [
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: false } },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
})
export class DateTimePickerComponent implements OnInit, OnDestroy {

  @Input() placeholder;
  @Input() type;
  @Input() value;
  @Input() id;
  @Input() style;
  @Input() class;
  @Input() label;
  @Input() hint;
  @Input() control_type;
  @Input() required;
  @Input() error_msg;
  @Input() form: FormGroup;
  @Input() controlName;
  @Output() getValue = new EventEmitter();
  @Output() onChange = new EventEmitter();
  @Input() field;
  @Input() minValue;
  @Input() maxValue;
  @Input() disabled;
  subscription: Subscription;
  prev_value;
  date = new FormControl();

  picker_open_flag = 1;
  @ViewChild('picker', { static: false }) picker;

  constructor() { }

  ngOnInit() {
    if (this.form.get(this.controlName).value) {
      if (this.form.get(this.controlName).value) {
        this.date.setValue(new Date(this.form.get(this.controlName).value));
      }
    }

    this.subscription = this.form.get(this.controlName).valueChanges.subscribe(res => {
      if (res && res != this.prev_value) {
        this.prev_value = res;
        this.date.setValue(new Date(this.form.get(this.controlName).value));
        this.onChange.emit({ value: moment.parseZone(this.form.get(this.controlName).value).format('YYYY-MM-DD[T]HH:mm:ss') });
      }
      if (!res) {
        this.date.reset()
      }
    })
  }

  ngOnDestroy(): void {
    if (this.subscription && this.subscription.unsubscribe) {
      this.subscription.unsubscribe();
    }

  }

  addEvent(ev) {
    console.log(ev)
    console.log(moment(ev.value))
    console.log(moment.parseZone(ev.value).format('YYYY-MM-DD[T]HH:mm:ss'))
    this.form.get(this.controlName).setValue(moment.parseZone(ev.value).format('YYYY-MM-DD[T]HH:mm:ss'));
    this.getValue.emit(ev);
    this.onChange.emit({ value: moment.parseZone(ev.value).format('YYYY-MM-DD[T]HH:mm:ss') });
  }
  anc(evt) {
    console.log(new Date(evt))
  }
  removeDate(ev) {
    ev.preventDefault();
    console.log(this.form.get(this.controlName));
    this.form.get(this.controlName).reset();
    this.date.reset();
  }

  openPicker(open_flag) {
    if (open_flag && !this.disabled) {
      setTimeout(() => {
        this.picker.open();
      })
    }
  }
}
