import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
export const MY_FORMATS = {
  parse: {
    dateInput: 'MMM DD, YYYY',
  },
  display: {
    dateInput: 'MMM DD, YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD MMM YYYY',
    monthYearA11yLabel: 'MMM YYYY',
  },
};
@Component({
  selector: 'tm-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: false } },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },


  ],

})

export class DatePickerComponent implements OnInit, OnDestroy {

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
  @Input() label_block;
  @Output() getValue = new EventEmitter();
  @Output() onChange = new EventEmitter();
  @Input() field;
  @Input() minValue;
  @Input() maxValue;
  @Input() time_to_be_considered;
  @Input() disabled;

  @ViewChild('picker') picker;

  subscription: Subscription;
  prev_value;
  date = new FormControl();

  picker_open_flag = 1;
  constructor() {

  }

  ngOnInit() {
    setTimeout(() => {
      if (this.form.get(this.controlName).value) {


        this.date.setValue(new Date(this.form.get(this.controlName).value));
        if (this.time_to_be_considered && this.date.value) {
          this.form.get(this.controlName).setValue(moment.parseZone(this.date.value).format('YYYY-MM-DD[T]') + this.time_to_be_considered);
        }


      }

    });
    this.subscription = this.form.get(this.controlName).valueChanges.subscribe(res => {
      if (res && res != this.prev_value) {
        this.prev_value = res;
        this.date.setValue(new Date(this.form.get(this.controlName).value));
        if (this.time_to_be_considered && this.date.value) {
          this.form.get(this.controlName).setValue(moment.parseZone(this.date.value).format('YYYY-MM-DD[T]') + this.time_to_be_considered);
        }
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
    if (this.time_to_be_considered) {
      this.form.get(this.controlName).setValue(moment.parseZone(ev.value).format('YYYY-MM-DD[T]') + this.time_to_be_considered);
    }
    else {
      this.form.get(this.controlName).setValue(moment.parseZone(ev.value).format('YYYY-MM-DD[T]HH:mm:ss'));
    }

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
    this.onChange.emit({ value: moment.parseZone(this.form.get(this.controlName).value).format('YYYY-MM-DD[T]HH:mm:ss') });
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


