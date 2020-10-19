import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  @Input() contact_details
  @Output() cellClicked = new EventEmitter();
  // contact_details={
  //   first_name:'Dibya Jyothi',
  //   last_name:'Jena',
  //   dob:'Jan 12 2019',
  //   phone_no:'989898989',
  //   email_id:'dibyatony@gmail.com',
  //   city:'Bengaluru, India'

  // }
  constructor() { }

  ngOnInit() {
    console.log(this.contact_details);
  }

  edit() {
    this.cellClicked.emit({ func: 'edit', data: this.contact_details });
  }
}
