/*
  Created
    by: Upendram Reddy Tanuja
    on: 21-Aug-2019 07:30 PM
    purpose: Date Format details
    comments: Date Format details
*/

import { Component, OnInit, Input, Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
})
export class DateFormatComponent implements OnInit {
  @Input() form_group: FormGroup;
  @Input() control_name;
  @Input() label;
  @Input() placeholder;
  @Input() label_block;
  @Input() required;
  constructor() { }

  ngOnInit() {
  
  }

}


@Injectable({
  providedIn: 'root'
})
export class SomeService {

  private _subject = new Subject<any>();

  newEvent(event) {
    this._subject.next(event);
  }

  get events$() {
    return this._subject.asObservable();
  }
}

