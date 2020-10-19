import { Component, OnInit, Input } from '@angular/core';
import { coerceNumberProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit {
  constructor() { }

  ngOnInit() {
  }

  @Input() autoTicks: boolean;

  @Input() disabled: boolean;

  @Input() invert: boolean;
 
  @Input() showTicks: boolean;

  @Input() thumbLabel: boolean = true;
  
  @Input() vertical: boolean;

  @Input() max: number = 100;

  @Input() min: number = 0;

  @Input() step: number;

  value;

  get tickInterval(): number | 'auto' {
    return this.showTicks ? (this.autoTicks ? 'auto' : this._tickInterval) : 0;
  }

  set tickInterval(value) {
    this._tickInterval = coerceNumberProperty(value);
  }
  
  private _tickInterval = 1;
}

