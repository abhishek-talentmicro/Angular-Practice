import { Component, OnInit } from '@angular/core';

@Component({
  // selector: 'app-servers'
  // selector:'[app-servers]'
  selector: '.app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.css']
})
export class ServersComponent implements OnInit {
  keyForActivation: boolean=false;
  servername:string='Test Server';
  addInDom:boolean=false;
  servers=['server 1','server 2'];
  constructor() {
    setTimeout(()=>{
      this.keyForActivation=true;
    },2000)
   }
   onServerCreate(){
     this.addInDom=true;
     this.servers.push(this.servername);
   }
  //  onInput(event:Event){
  //   this.servername= (<HTMLInputElement>event.target).value;
  //  }

  ngOnInit(): void {
  }

}
