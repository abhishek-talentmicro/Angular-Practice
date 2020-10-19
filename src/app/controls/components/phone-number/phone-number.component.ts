import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { special_keys } from '../dynamic-form/dynamic-form.component';
import { Subscription } from 'rxjs';
import { jsonParse } from 'src/app/app.component';

@Component({
  selector: 'app-phone-number',
  templateUrl: './phone-number.component.html',
  styleUrls: ['./phone-number.component.scss']
})
export class PhoneNumberComponent implements OnInit {

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
  @Input() form;
  @Input() controlName;
  @Input() disabled;
  @Input() maxLength;
  @Input() minLength;
  @Input() label_block;
  @Input() data;
  @Input() pattern_desc;
  @Input() split_index_array;
  @Input() pattern;

  mobile_number_length = 12;
  subscription: Subscription

  // length = 9;
  // split_index_array = [3, 3]
  splits = [];
  inp_pattern;
  new_formControl = new FormControl();
  constructor() { }

  // ngOnInit() {
  //   if (this.form.get(this.controlName).value) {
  //     this.displayNumber(this.form.get(this.controlName).value);
  //   }
  //   console.log(this.form.get(this.controlName).value);
  // }

  ngOnChanges(ev) {
    if (ev.data) {
      this.displayNumber(ev.data.currentValue);
      console.log(this.pattern)
      this.inp_pattern = this.pattern

    }
  }


  // inputNumber(evt: KeyboardEvent) {

  //   let input = <HTMLInputElement>event.srcElement;
  //   let charCode = (evt.which) ? evt.which : evt.keyCode;

  //   let pattern = '';


  //   if (pattern && pattern != '' && (special_keys.indexOf(charCode) == -1) && !evt.ctrlKey && !evt.shiftKey && !evt.altKey) {
  //     let char = evt.key;
  //     try {
  //       let regex = new RegExp(pattern);
  //       if (regex.test(char)) {
  //         // event.target['value'] += event.key;
  //       }
  //       else {
  //         event.preventDefault();
  //       }
  //     }
  //     catch (err) {
  //       return true;
  //     }
  //   }
  //   else {
  //   }
  //   return true;
  // }
  // // this.displayPhoneNumber(evt)
  // // try {
  // //   if (charCode == 13) {
  // //     return false;
  // //   }
  // //   if (charCode == 8 || charCode == 9) {
  // //     return true;
  // //   }
  // //   if (input.value.length == 0) {
  // //     if (charCode == 96 || charCode == 48) {
  // //       return false
  // //     }
  // //     else if (charCode < 31 || (charCode >= 48 && charCode <= 57) || (charCode >= 96 && charCode <= 105)) {
  // //       return true;
  // //     }
  // //     else {
  // //       return false;
  // //     }
  // //   }
  // //   else if (input.value.length >= this.mobile_number_length) {
  // //     return false;
  // //   }
  // //   else if (input.value.length < this.mobile_number_length) {
  // //     if (charCode < 31 || (charCode >= 48 && charCode <= 57) || (charCode >= 96 && charCode <= 105)) {
  // //       return true;
  // //     }
  // //     else {
  // //       return false;
  // //     }
  // //   }

  // // }
  // // catch (error) {

  // // }
  // // finally {
  // //   this.displayPhoneNumber(evt)
  // // }
  // // }


  // displayNumber(str) {
  //   str = str ? str.replace(/\-/g, '') : '';
  //   str = str ? str.replace(/ /g, '') : '';
  //   str = str ? str.replace(/\+/g, '') : '';
  //   str = str ? str.replace(/\(/g, '') : '';
  //   str = str ? str.replace(/\)/g, '') : '';
  //   try {
  //     if (str) {
  //       str = str.replace(/\-/g, '');
  //       let a = str.slice(0, 3);
  //       let b = str.slice(3, 6);
  //       let c = str.slice(6, 10);
  //       let out = '';
  //       if (a && a != '' && a.length == 3) {
  //         a += '-';
  //       }
  //       out += a;
  //       if (b && b != '' && b.length == 3) {
  //         b += '-';
  //       }
  //       out += b;
  //       out += c;

  //       this.new_formControl.setValue(out)
  //     }
  //     else {
  //       this.new_formControl.reset();
  //     }
  //   }
  //   catch (err) {
  //     this.new_formControl.reset();
  //   }
  // }

  // displayPhoneNumber(evt) {
  //   let charCode = (evt.which) ? evt.which : evt.keyCode;
  //   if (evt.target.value && (evt.target.value.length == 3 || evt.target.value.length <= 7) && special_keys.indexOf(charCode) == -1) {
  //     if (evt.keyCode != 8 && evt.keyCode != 46) {
  //       this.new_formControl.setValue(evt.target.value + '-');
  //     }
  //   }

  //   this.form.get(this.controlName).setValue((evt.target.value).split('-').join(''));
  //   if (this.form.get(this.controlName).value.length > 10) {
  //     this.form.get(this.controlName).setValue(String(this.form.get(this.controlName).value).slice(0, 10));
  //   }

  //   if (evt.keyCode != 8 && evt.keyCode != 46) {
  //     this.displayNumber(this.form.get(this.controlName).value);
  //   }

  // }
  ngOnInit(): void {
    this.splits = getSplits(this.maxLength, this.split_index_array);
    this.maxLength = this.maxLength ? this.maxLength : 10;
    this.inp_pattern = this.pattern;


    this.subscription = this.new_formControl.valueChanges.subscribe(res => {

      try {
        this.form.get(this.controlName).setValue(Object.values(this.new_formControl.value).toString().replace(/,/g, ''))
      }
      catch (err) {
        this.form.get(this.controlName).reset();
      }
    })
  }
  ngAfterViewInit(): void {
    this.inp_pattern = this.pattern;
  }

  displayNumber(str) {
    try {
      this.splits = getSplits(this.maxLength, this.split_index_array)
      if (str) {
        let out = {};
        let start_index = 0
        for (let i = 0; i < this.splits.length; i++) {
          out['control' + i] = str.slice(start_index, start_index + parseInt(this.splits[i]));
          start_index += parseInt(this.splits[i]);
        }
        this.new_formControl.setValue(out)
      }
      else {
        this.new_formControl.reset();
      }
    }
    catch (err) {
      this.new_formControl.reset();
    }
  }

}

export function getSplits(max_length, split_index_arr) {
  try {
    let splits = [];
    let final_split;
    split_index_arr = jsonParse(split_index_arr)
    max_length = max_length ? max_length : 10
    if (split_index_arr && split_index_arr.length && typeof split_index_arr == 'object') {
      let sum = split_index_arr.reduce((a, b) => {
        return parseInt(a) + parseInt(b)
      })
      if (sum <= max_length) {
        final_split = max_length - sum;
        for (let i = 0; i < split_index_arr.length; i++) {
          splits.push(split_index_arr[i]);
        }
        if (final_split) {
          splits.push(final_split)
        }
      }
    } else {
      splits.push(max_length)
    }

    return splits
  }
  catch (err) {
    return []
  }
}