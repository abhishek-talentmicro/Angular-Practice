import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css']
})
export class CheckboxComponent implements OnInit {


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
  @Input() options;
  @Input() disabled;
  @Input() multiple;
  @Output() getValue = new EventEmitter();
  @Input() label_block;

  checkbox_form: FormGroup;

  constructor() { }

  ngOnInit() {
    this.checkbox_form = new FormGroup({
      check: new FormControl()
    })
  }

  selectedCheckbox(ev) {

    this.form.get(this.controlName).setValue((ev.checked ? 1 : 0));
  }

}
