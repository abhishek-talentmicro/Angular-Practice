import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assign-thr',
  templateUrl: './assign-thr.component.html',
  styleUrls: ['./assign-thr.component.css']
})
export class AssignThrComponent implements OnInit {

  display:boolean=false;
  butons=[];
  stamp:number=0;
  // buton:number;
  constructor() { }
  onDisplayDetails(event:Event){
    this.display===false? this.display=true:this.display=false;
    this.butons.push(++this.stamp);
  }
  showOnDom(){
    return this.display;
  }
  // giveColor(){
  //   return this.buton>4? 'blue':'white';
  // }
  // addWhite(){
  //   return this.buton>4? true:false;
  // }

  ngOnInit(): void {
  }

}
