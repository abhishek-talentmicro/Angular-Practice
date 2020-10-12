import { Directive, ElementRef, HostBinding, HostListener, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appNewYellowBackground]'
})
export class NewYellowBackgroundDirective implements OnInit{
  @Input()defaultColor:string='transparent';
  @Input('yellowColor')hoveredColor:string='yellow';
  @HostBinding('style.backgroundColor') bgColor:string;

  ngOnInit(){
    this.bgColor=this.defaultColor;
  }
  constructor(private element:ElementRef, private rendrer:Renderer2) { }
  @HostListener('mouseenter') mouseover(event:Event){
    // this.rendrer.setStyle(this.element.nativeElement, 'backgroundColor','yellow');
    this.bgColor=this.defaultColor;
  }
  @HostListener('mouseleave') mouseleave(event:Event){
    // this.rendrer.setStyle(this.element.nativeElement, 'backgroundColor','transparent');
    this.bgColor=this.hoveredColor;
  }

}
