import { Component, Input, OnChanges, OnInit, SimpleChanges, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy, ViewChild, ElementRef, ContentChild } from '@angular/core';

@Component({
  selector: 'app-server-element',
  templateUrl: './server-element.component.html',
  styleUrls: ['./server-element.component.css']
})
export class ServerElementComponent implements OnInit,OnChanges,DoCheck,AfterContentInit,AfterContentChecked,AfterViewInit,AfterViewChecked,OnDestroy{

  @Input('srvElement') element:{type:string,name:string,content:string};
  @Input('naming') name:string;
  @ViewChild('heading',{static:true}) header:ElementRef;
  @ContentChild('paragraphContent',{static:true}) para:ElementRef;
  constructor() { 
    console.log('constructor was called');
  }
  ngOnChanges(changes:SimpleChanges){
    console.log(changes);
    console.log('ngOnChanges called')
  }

  ngOnInit(): void {
    console.log('ngOnInit called');
    console.log('text in header is :'+this.header.nativeElement.textContent)
    console.log('text in content is :'+this.para.nativeElement.textContent)
  }
  ngDoCheck(){
    console.log('ngDoCheck called');
  }

  ngAfterContentInit(){
    console.log('ngAfterContentInit called');
    console.log('text in content is :'+this.para.nativeElement.textContent)
  }
  ngAfterContentChecked(){
    console.log('ngAfterContentChanged called');
  }
  ngAfterViewInit(){
    console.log('ngAfterViewInit called');
    console.log('text in header is :'+this.header.nativeElement.textContent)
  }
  ngAfterViewChecked(){
    console.log('ngAfterViewChecked called');
  }
  ngOnDestroy(){
    console.log('ngOnDestroy called');
  }
}
