import { Component, OnInit, Input, Output, ChangeDetectorRef } from '@angular/core';
import { EventEmitter } from 'events';
import { FormGroup, Validators } from '@angular/forms';
import { special_keys } from '../dynamic-form/dynamic-form.component'

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css'],
})
export class TextComponent implements OnInit {

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
  @Input() label_block;
  @Input() pattern;
  @Input() pattern_desc;
  @Input() minlength;
  @Input() maxValue;
  @Input() minValue;
  @Input() minLength;
  @Input() transform;
  @Input() data;
  @Input() prefix_label;
  @Input() suffix_label;
  @Input() label_class;


  constructor(private change_detector_ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.form.patchValue(this.form.value);
  }

  ngOnChanges(ev) {
    if (ev.data) {
      this.transformFn();
    }
  }

  inputEmail(event: KeyboardEvent) {
    let input = <HTMLInputElement>event.srcElement;
    let charCode = (event.which) ? event.which : event.keyCode;

    if (charCode === 20) {
      return false;
    }
    try {
      if (event.keyCode === 32) {
        return false;
      }
    }
    catch (error) {

    }
  }

  regexCheck(event: KeyboardEvent) {
    let regex = new RegExp(this.pattern);
    if (this.pattern && this.pattern != '' && (special_keys.indexOf(event.keyCode) == -1 && special_keys.indexOf(event.which) == -1) && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      let char = event.key;
      try {
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
    else if ((event.ctrlKey || event.shiftKey || event.altKey) && (special_keys.indexOf(event.keyCode) == -1 && special_keys.indexOf(event.which) == -1)) {
      if (!regex.test(event.key)) {
        event.preventDefault();
      }
    }
    return true;
  }

  transformFn() {
    if (this.form.get(this.controlName).value) {
      if (this.transform == 1) {
        this.form.get(this.controlName).setValue((this.form.get(this.controlName).value).toUpperCase())
      }
      else if (this.transform == 2) {
        this.form.get(this.controlName).setValue((this.form.get(this.controlName).value).toLowerCase())
      }
      else if (!this.transform) {
        this.form.get(this.controlName).setValue(this.form.get(this.controlName).value);
      }
      this.change_detector_ref.detectChanges();
    }
  }
}
