import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assign',
  templateUrl: './assign.component.html',
  styleUrls: ['./assign.component.css']
})
export class AssignComponent implements OnInit {
  username:string="default-user";
  constructor() { 
  }
  onEmpty(){
    this.username='';
  }
  ngOnInit(): void {
  }
  activation():boolean{
    if(this.username==''){
      return true;
    }
    else{
      false
    }
  }

}
