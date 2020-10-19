import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.css']
})
export class ToggleComponent implements OnInit {

  @Input() color;
  @Input() disabled: boolean;
  @Input() checked: boolean;
  @Input() form;
  @Input() label;
  @Input() controlName;
  @Input() required;
  constructor() { }

  ngOnInit() {
  }
  ngOnChanges(ev): void {
    if (ev.disabled.currentValue) {
      this.form.get(this.controlName).disable();
    }
  }
}
