import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { special_keys } from '../dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-number',
  templateUrl: './number.component.html',
  styleUrls: ['./number.component.css']
})
export class NumberComponent implements OnInit {

  @Input() placeholder;
  @Input() type;
  @Input() value;
  @Input() id;
  @Input() style;
  @Input() class;
  @Input() label_code;
  @Input() hint;
  @Input() control_type;
  @Input() required;
  @Input() error_msg;
  @Input() form;
  @Input() controlName;
  @Input() label;
  @Input() maxLength;
  @Input() label_block;
  @Input() minLength;
  @Input() maxValue;
  @Input() minValue;
  @Input() prefix_label;
  @Input() suffix_label;
  @Input() label_class;
  @Input() disabled;

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      this.form.patchValue(this.form.value);
    });
    console.log(this.label);
  }


  regexCheck(event: KeyboardEvent) {
    let pattern = /[0-9]/;
    if ((special_keys.indexOf(event.keyCode) == -1 && special_keys.indexOf(event.which) == -1) && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      let char = event.key;
      try {
        let regex = new RegExp(pattern);
        if (regex.test(char)) {
          // event.target['value'] += event.key;
        }
        else {
          event.preventDefault();
        }
      }
      catch (err) {
        return true;
      }
    }
    else {
    }
    return true;
  }
  getNumber(val) {
    return Number(val)
  }
}
