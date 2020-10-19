import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-requirement-status',
  templateUrl: './requirement-status.component.html',
  styleUrls: ['./requirement-status.component.scss']
})
export class RequirementStatusComponent implements OnInit {

  @Input() req_status = [];
  @Input() current_status;

  req_status_form = new FormGroup({
    'status': new FormControl(null, [Validators.required]),
    'reason': new FormControl(null),
    'notes': new FormControl(null)
  });

  constructor() { }

  ngOnInit() {
  }

}
