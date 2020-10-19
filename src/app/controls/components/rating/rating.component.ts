import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {

  @Input() form_control;
  @Input() options;
  @Input() label;
  @Input() value;
  @Input() required;
  @Input() label_block;
  @Input() max_value;
  @Input() min_value;
  @Input() color;
  @Input() readonly;
  ratingArr = [];

  constructor(private snackBar: MatSnackBar) {
  }


  ngOnInit() {

    this.max_value = this.max_value ? this.max_value : 5;
    this.color = this.color ? this.color : 'primary';
    console.log("a " + this.max_value)
    for (let index = 0; index < this.max_value; index++) {
      this.ratingArr.push(index);
    }
  }
  onClick(rating: number) {
    this.form_control.setValue(rating)
    return false;
  }

  showIcon(index: number) {
    if (this.form_control.value >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

  edit(index: number) {
    if (this.value >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

}
export enum StarRatingColor {
  primary = "primary",
  accent = "accent",
  warn = "warn"
}
