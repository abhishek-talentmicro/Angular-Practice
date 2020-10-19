import { Component, OnInit, OnDestroy, ElementRef, Self, Optional, Input, ViewChild, ViewChildren } from '@angular/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { ControlValueAccessor, FormGroup, Validators, NgControl, AbstractControl, FormControl } from '@angular/forms';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Subject } from 'rxjs';
import { special_keys } from '../../dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-custom-control',
  templateUrl: './custom-control.component.html',
  styleUrls: ['./custom-control.component.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: CustomControlComponent }],
  host: {
    '[class.example-floating]': 'shouldLabelFloat',
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy'
  }

})
export class CustomControlComponent implements ControlValueAccessor, MatFormFieldControl<Array<any>>, OnDestroy {
  static nextId = 0;
  parts: FormGroup = new FormGroup({});
  stateChanges = new Subject<void>();
  focused = false;
  errorState = false;
  controlType = 'example-tel-input';
  id = `example-tel-input-${CustomControlComponent.nextId++}`;
  describedBy = '';
  display_placeholder = true;
  onChange = (_: any) => { };
  onTouched = () => { };

  //Need to change variable names
  @ViewChildren('splitsRef') splitsRef;
  @Input() max_length;
  @Input() splits;
  @Input() inp_pattern;
  @Input() disabled_flag;
  get empty() {
    return null;
  }

  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  private _placeholder: string;

  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _required = false;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.parts.disable() : this.parts.enable();
    this.stateChanges.next();
  }
  private _disabled = false;

  @Input()
  get value() {
    // if (this.parts.valid) {
      return this.parts.value
    // }
    // return null;
  }
  set value(tel) {
    if (tel) {
      this.parts = new FormGroup({});
      for (let i = 0; i < (this.splits).length; i++) {
        this.parts.addControl('control' + i, new FormControl('', [Validators.required, Validators.minLength(this.splits[i])]));
      }
      this.parts.setValue(tel);
    }
    else {
      this.parts = new FormGroup({});
      for (let i = 0; i < (this.splits).length; i++) {
        this.parts.addControl('control' + i, new FormControl('', [Validators.required, Validators.minLength(this.splits[i])]));
      }
    }
    this.displayPlaceholder();
    this.stateChanges.next();
  }

  constructor(
    private _focusMonitor: FocusMonitor,
    private _elementRef: ElementRef<HTMLElement>,
    @Optional() @Self() public ngControl: NgControl
  ) {
    _focusMonitor.monitor(_elementRef, true).subscribe(origin => {
      if (this.focused && !origin) {
        this.onTouched();
      }
      this.focused = !!origin;
      this.stateChanges.next();
    });

    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }
  autoFocusNext(control: AbstractControl, nextElement?: HTMLInputElement): void {
    if (!control.errors && nextElement) {
      this._focusMonitor.focusVia(nextElement, 'program');
    }
  }

  autoFocusPrev(control: AbstractControl, i): void {
    let prevElement: HTMLInputElement;
    this.displayPlaceholder();
    prevElement = this.splitsRef && this.splitsRef._results && this.splitsRef._results.length && this.splitsRef._results[i - 1] ? this.splitsRef._results[i - 1] : null
    if (control.value.length < 1 && prevElement) {
      this._focusMonitor.focusVia(prevElement, 'program');
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  ngAfterViewInit(): void {
    this.displayPlaceholder();
    console.log(this.splitsRef)
    console.log(this.parts)
    try {
      setTimeout(() => {
        this._focusMonitor.focusVia(this.getElement(0), 'program');
      })
    }
    catch (err) {

    }
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  regexCheck(event: KeyboardEvent) {
    let regex = new RegExp(this.inp_pattern);
    if (this.inp_pattern && this.inp_pattern != '' && (special_keys.indexOf(event.keyCode) == -1 && special_keys.indexOf(event.which) == -1) && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      let char = event.key;
      try {
        if (regex.test(char)) {
          // event.target['value'] += event.key;
        }
        else {
          event.preventDefault();
        }
      }
      catch (err) {
        return true;
      }
    }
    else if ((event.ctrlKey || event.shiftKey || event.altKey) && (special_keys.indexOf(event.keyCode) == -1 && special_keys.indexOf(event.which) == -1)) {
      if (!regex.test(event.key)) {
        event.preventDefault();
      }
    }
    return true;
  }

  displayPlaceholder() {
    for (let i = 0; i < this.splits.length; i++) {
      if (this.parts.controls[this.getControlName(i)].value) {
        this.display_placeholder = false;
        break;
      }
      else {
        this.display_placeholder = true;
      }
    }
  }


  onContainerClick(event: MouseEvent) {
    if (this.parts.controls && this.parts.controls) {
      for (let i = 0; i < this.splits.length; i++) {
        if (this.parts.controls[this.getControlName(i)].invalid) {
          this._focusMonitor.focusVia(this.getElement(i), 'program');
          break;
        }
      }
    }
  }

  getElement(i) {
    return this.splitsRef && this.splitsRef._results && this.splitsRef._results.length && this.splitsRef._results[i] ? this.splitsRef._results[i] : null
  }
  getControlName(i) {
    return "control" + i
  }

  writeValue(tel): void {
    this.value = tel;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  _handleInput(control: AbstractControl, i): void {
    let nextElement: HTMLInputElement;
    nextElement = this.splitsRef && this.splitsRef._results && this.splitsRef._results.length && this.splitsRef._results[i + 1] ? this.splitsRef._results[i + 1] : null;
    this.displayPlaceholder();
    this.autoFocusNext(control, nextElement);
    this.onChange(this.value);
  }

  static ngAcceptInputType_disabled: boolean | string | null | undefined;
  static ngAcceptInputType_required: boolean | string | null | undefined;
}





