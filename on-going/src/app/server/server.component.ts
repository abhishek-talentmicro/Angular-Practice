import { Component } from '@angular/core';

@Component({
    selector: 'server-component',
    templateUrl: './server.component.html',
    styleUrls: ['./server.component.css']
})
export class ServerComponent{
    serverId :Number= 10;
    status :String='offline';
    constructor(){
        this.status= Math.random()>0.5? 'online':'offline';
    }
    serverStatus(){
        return this.status;
    }
    serverColor(){
        if(this.status==='offline'){
            return 'red';
        }
        else{
            return 'green';
        }
    }
    addingClass(){
        return this.status==='online'? true:false;
    }
}
