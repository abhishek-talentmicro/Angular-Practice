import { Component, OnInit, ComponentRef, ViewChild, ViewContainerRef, ComponentFactoryResolver, Inject, Injector, Input, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dynamic-dialog',
  templateUrl: './dynamic-dialog.component.html',
  styleUrls: ['./dynamic-dialog.component.scss']
})
export class DynamicDialogComponent implements OnInit, AfterViewInit {

  @Input() set component(component: any) {
    this.viewContainerRef.clear();
    if (component) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
      const componentRef = this.viewContainerRef.createComponent(componentFactory);
    }
  };
  componentRef: ComponentRef<any>;
  dialogRef;
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    private changeDetectorRef: ChangeDetectorRef,
    private injector: Injector
  ) {
    this.dialogRef = this.injector.get(MatDialogRef, null);
  }

  ngOnInit() {

    console.log(this.component)
  }

  ngAfterViewInit(): void {
    // const factory = this.resolver.resolveComponentFactory(this.component);
    // this.componentRef = this.vcRef.createComponent(factory);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }


}
