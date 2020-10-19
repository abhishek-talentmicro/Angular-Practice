import { Directive, OnInit, OnDestroy, Input, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
    selector: '[DestoryDirective]',
    exportAs: 'DestoryDirective',
})
export class DestoryDirective implements OnInit, OnDestroy {
    @Input() init;
    @Input() destory;

    ngOnInit(): void {
        this.init()
    }

    ngOnDestroy(): void {
        this.destory();
    }
}


@Directive({
    selector: '[ContextMenu]'
})
export class ContextMenuDirective {

    @Input() closeContextMenuRef;
    @Input() openContextMenuRef;
    @Input() tabDetails;
    opened = 0;

    constructor(private elementRef: ElementRef) { }

    @HostListener('document:click', ['$event'])
    onClick(event) {
        let targetElement = event.target as HTMLElement;
        if (targetElement && !this.elementRef.nativeElement.contains(targetElement)) {
            this.opened = 0;
            this.closeContextMenuRef();
        }
        else {
            if (targetElement && this.elementRef.nativeElement.contains(targetElement) && !this.opened) {
                this.opened = 1;
                this.openContextMenuRef();
            }
        }

    }
}
