import { Component, OnInit, Input, Pipe, PipeTransform } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { cloneArray } from 'src/app/functions/functions';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.css']
})
export class RadioComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() controlName;
  @Input() options;
  @Input() label;
  @Input() value;
  @Input() required;
  @Input() label_block;
  constructor() { }

  ngOnInit() {
    console.log(this.label_block);
    this.options = cloneArray(this.options);

    setTimeout(() => {
      if (this.form.value[this.controlName] && !isNaN(this.form.value[this.controlName])) {
        this.form.get(this.controlName).setValue(Number(this.form.value[this.controlName]));
      }
    });

  }

}