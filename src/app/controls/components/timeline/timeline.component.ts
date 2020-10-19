import { Component, OnInit, Input } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('200ms ease-in', style({ transform: 'translateY(0%)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateY(-100%)' }))
      ])
    ])
  ]
})
export class TimelineComponent implements OnInit {

  data = [{
    cr_date: "2020-02-27T04:57:51.743",
    cr_user_id: "Praphul Bhat",
    notes: "<p>hey</p>",
    status: 1,
    t_id: 13,
  },
  {
    cr_date: "2020-02-27T04:57:51.743",
    cr_user_id: "Praphul Bhat",
    notes: "<p>hey</p>",
    status: 1,
    t_id: 13,
  },
  {
    cr_date: "2020-02-27T04:57:51.743",
    cr_user_id: "Praphul Bhat",
    notes: "<p>hey</p>",
    status: 1,
    t_id: 13,
  },
  {
    cr_date: "2020-02-27T04:57:51.743",
    cr_user_id: "Praphul Bhat",
    notes: "<p>hey</p>",
    status: 1,
    t_id: 13,
  },
  {
    cr_date: "2020-02-27T04:57:51.743",
    cr_user_id: "Praphul Bhat",
    notes: "<p>hey</p>",
    status: 1,
    t_id: 13,
  },
  {
    cr_date: "2020-02-27T04:57:51.743",
    cr_user_id: "Praphul Bhat",
    notes: "<p>hey</p>",
    status: 1,
    t_id: 13,
  },
  {
    cr_date: "2020-02-27T04:57:51.743",
    cr_user_id: "Praphul Bhat",
    notes: "<p>hey</p>",
    status: 1,
    t_id: 13,
  },
  {
    cr_date: "2020-02-27T04:57:51.743",
    cr_user_id: "Praphul Bhat",
    notes: "<p>hey</p>",
    status: 1,
    t_id: 13,
  },
  {
    cr_date: "2020-02-27T04:57:51.743",
    cr_user_id: "Praphul Bhat",
    notes: "<p>hey</p>",
    status: 1,
    t_id: 13,
  },
  {
    cr_date: "2020-02-27T04:57:51.743",
    cr_user_id: "Praphul Bhat",
    notes: "<p>hey</p>",
    status: 1,
    t_id: 13,
  },
  {
    cr_date: "2020-02-27T04:57:51.743",
    cr_user_id: "Praphul Bhat",
    notes: "<p>hey</p>",
    status: 1,
    t_id: 13,
  },
  {
    cr_date: "2020-02-27T04:57:51.743",
    cr_user_id: "Praphul Bhat",
    notes: "<p>hey</p>",
    status: 1,
    t_id: 13,
  },
  {
    cr_date: "2020-02-27T04:57:51.743",
    cr_user_id: "Praphul Bhat",
    notes: "<p>hey</p>",
    status: 1,
    t_id: 13,
  },
  {
    cr_date: "2020-02-27T04:57:51.743",
    cr_user_id: "Praphul Bhat",
    notes: "<p>hey</p>",
    status: 1,
    t_id: 13,
  }
  ]
  @Input() timeline;
  @Input() title;

  @Input() req_history;
  constructor() { }

  ngOnInit() {
    // this.timeline = this.data;
    // this.title = "sam"
  }

}
