import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
    selector: "[yellow-directive]",
})
export class CustomDirective implements OnInit{
   constructor(private element:ElementRef){ 
   } 
   ngOnInit(){     //best practice to use ngOnInit to  write initialization code, below code can also be written inside constructor
    this.element.nativeElement.style.backgroundColor= 'yellow';
   }
}