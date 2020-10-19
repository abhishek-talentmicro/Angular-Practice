
import { FormControl } from '@angular/forms';
import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, HostListener, Output, EventEmitter, OnChanges } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-tm-basic-select',
  templateUrl: './tm-basic-select.component.html',
  styleUrls: ['./tm-basic-select.component.scss']
})
export class TmBasicSelectComponent implements OnInit, OnChanges {
  @Input() options;
  @Input() form_group;
  @Input() label;
  @Input() form_control;
  @Input() title_property;
  @Input() id_property
  @Input() placeholder;
  @Input() selected_input;
  @Input() mandatory;
  @Input() float_label;
  @Input() disabled;
  @Input() is_required;
  @Input() data;
  @Input() edit_option;
  @Output() selected_obj = new EventEmitter<any>();
  @Output() edit_obj = new EventEmitter<any>();
  @Input() bckcolor = "white"
  @Input() style;
  @Input() enable_close;
  @Input() is_default_value;
  filtered_value;
  search_valid: boolean = false;
  filtered_input = [];
  @ViewChild('form', { static: true }) form;
  @ViewChild(CdkVirtualScrollViewport) view: CdkVirtualScrollViewport;
  @Input() inp_search;

  qwe = new FormControl();
  last_value;
  view_port: any;
  inner_height: number;
  top: number = 0;
  left: number = 0;
  filter_len: boolean = false;
  arrow_key_location = 0;
  select_height;
  last_search;
  clientY;
  back_hit: boolean = false;
  dimension;
  dimension_width;
  display_overlay = 0;

  constructor(
    private change_detector_ref: ChangeDetectorRef,
  ) {
  }
  ngOnInit() {

    this.qwe.reset();
    if (this.disabled) {
      this.form_group.get(this.form_control).disable();
      this.qwe.disable()
    }
    try {
      if (!this.form_group.get(this.form_control).value) {
        this.qwe.reset();
      }
    } catch (e) { }
    this.filtered_input = this.options;
    this.change_detector_ref.detectChanges();
  }


  ngOnChanges(ev) {
    if (ev && ev.options && ev.options.currentValue) {

      this.options = ev.options.currentValue;
      // this.ngOnInit();
      this.filtered_input = this.options;

      this.options.forEach(element => {
        if (element[this.id_property] == this.form_group.get(this.form_control).value) {
          this.last_value = element;
          if (this.form_group) {
            // this.selected_obj.emit(element);
            this.qwe.setValue(element[this.title_property]);


            // this.form_group.get(this.form_control).setValue(element[this.id_property]);
          }
        }
      });
      // this.emit = true;
    }
    if (ev && ev.disabled && ev.disabled.currentValue) {
      this.form_group.get(this.form_control).disable();
      this.qwe.disable()
    }
    else {
      if (this.form_group.get(this.form_control))
        this.form_group.get(this.form_control).enable();
      if (this.qwe)
        this.qwe.enable()
    }
    if (this.disabled) {
      this.form_group.get(this.form_control).disable();
      this.qwe.disable()
    }
    this.change_detector_ref.detectChanges();
    // this.ngOnInit();
    if (this.form_group && this.form_group.get(this.form_control)) {
      this.form_group.get(this.form_control).valueChanges.subscribe(val => {
        console.log(val, this.form_control);
        try {

          if ((this.form_group.get(this.form_control).markAsTouched() || this.form_group.get(this.form_control).markAsDirty()) && !this.form_group.get(this.form_control).valid) {
            this.qwe.markAsTouched();
            this.qwe.markAsDirty();
          }
          let ele_found;
          this.options.forEach(element => {
            if (element[this.id_property] == this.form_group.get(this.form_control).value) {
              this.last_value = element;
              ele_found = 1;
              if (this.form_group) {
                // this.selected_obj.emit(element);
                this.qwe.setValue(element[this.title_property]);


                // this.form_group.get(this.form_control).setValue(element[this.id_property]);
              }
            }
            if (!ele_found) {
              this.last_value = null;
            }
          });
        }
        catch (err) {

        }

        if (!this.form_group.get(this.form_control).value) {
          this.qwe.reset();
          if (this.form_group.get(this.form_control).markAsTouched() || this.form_group.get(this.form_control).markAsDirty()) {
            this.qwe.markAsTouched();
            this.qwe.markAsDirty();
            this.last_value = null;
          }
        }
      })
    }

    //  if (this.form_group.get(this.form_control).markAsTouched() || this.form_group.get(this.form_control).markAsDirty()) {
    this.qwe.markAsTouched();
    this.qwe.markAsDirty();
    // this.last_value = null;
    // }

  }

  ngAfterViewInit() {
    // this.qwe.reset();
    this.qwe.reset();
    this.dimension = (this.form.nativeElement.getBoundingClientRect());
    if (!this.display_overlay) {
      this.top = this.dimension.top + 23;  //the height of virtualscrollbar
      this.left = this.dimension.left;
    }
    else {
      if (this.dimension) {
        let center = 0;
        if (this.dimension.width < 200) {
          this.dimension_width = 200;
          center = this.dimension_width - this.dimension.width;
        }
        else {
          this.dimension_width = this.dimension.width
        }

        if (this.inner_height / 2 >= this.dimension.top) {
          this.top = this.dimension.top + 23;
          this.left = this.dimension.left;
        }
        else {
          this.top = this.dimension.top - 380;
          this.left = this.dimension.left - 350;
        }
      }
    }
    if (this.options)
      this.options.forEach(option => {
        if (option[this.id_property] == this.form_group.get(this.form_control).value) {
          this.qwe.setValue(option[this.title_property]);
        }
      });
  }

  showList() {

    if (!this.search_valid) {
      if (document.getElementsByClassName('cdk-overlay-backdrop-showing').length) {
        // this.display_overlay = 1;
        this.change_detector_ref.detectChanges();
      }
      this.search_valid = !this.search_valid;
      // this.arrow_key_location = 0;
      if (this.last_value && !this.back_hit) {
        // this.selected_obj.emit(this.last_value);
        this.qwe.setValue(this.last_value[this.title_property])
        this.form_group.get(this.form_control).setValue(this.last_value[this.id_property]);
      }
      this.ngAfterViewInit();
    }
    return true;
  }

  filter(event) {
    this.showList();
    if (event && event.target && event.target.value) {
      let filter = event.target.value.toLowerCase();
      this.filtered_input = [];
      // this.arrow_key_location = 0;
      for (let i = 0; i < this.options.length; i++) {
        let option = this.options[i];
        if (option[this.title_property].toLowerCase().includes(filter)) {
          this.filtered_input.push(option);
        }
      }
    }
    else {
      this.filtered_input = this.options;
    }
  }

  hideList(ev, keyboard_flag) {
    if (!keyboard_flag && !this.form.nativeElement.contains(ev['target']) && this.search_valid) {
      this.search_valid = false;
      this.filter_len = false;
      if (this.last_value) {
        // this.selected_obj.emit(this.last_value);
        this.qwe.setValue(this.last_value[this.title_property])
        this.form_group.get(this.form_control).setValue(this.last_value[this.id_property]);
      }

      else {
        this.qwe.reset();
        this.form_group.get(this.form_control).reset();
      }
    }
    // else if (keyboard_flag && ev['relatedTarget'] && !this.form.nativeElement.contains(ev['relatedTarget'])) {
    //   if (this.last_value && !this.back_hit && this.form_group) {
    //     this.selected_obj.emit(this.last_value);
    //     this.qwe.setValue(this.last_value[this.title_property])
    //     this.form_group.get(this.form_control).setValue(this.last_value[this.id_property]);
    //   }
    //   this.search_valid = false;
    //   this.filter_len = false;
    // }

    if (this.display_overlay && ev['target'].id == "overlay_mat_select_search") {
      this.search_valid = false;
      if (this.last_value && !this.back_hit && this.form_group) {
        // this.selected_obj.emit(this.last_value);
        this.qwe.setValue(this.last_value[this.id_property]);
        this.form_group.get(this.form_control).setValue(this.last_value[this.id_property]);
      }
      else {
        this.qwe.reset();
        this.form_group.get(this.form_control).reset();
      }
      this.display_overlay = 0;
    }
    setTimeout(() => {
      if (keyboard_flag == 1) {
        this.search_valid = false;

      }
    }, 200)
    this.change_detector_ref.detectChanges()
  }

  onSelect(ev, selectedOption) {




    this.display_overlay = 0;
    this.change_detector_ref.detectChanges();
    if (selectedOption) {
      this.qwe.setValue(selectedOption[this.title_property]);
      this.form_group.get(this.form_control).setValue(selectedOption[this.id_property]);
      this.search_valid = false;
      this.last_value = selectedOption;
      this.form_group.get(this.form_control).setValue(selectedOption[this.id_property]);
    } else {
      this.qwe.setValue('');
      this.form_group.get(this.form_control).setValue('');
      this.search_valid = false;
      this.last_value = selectedOption;
      this.form_group.get(this.form_control).setValue('');
    }
    this.selected_obj.emit(selectedOption);


  }
  onEdit(ev, selectedOption) {

    this.display_overlay = 0;
    this.change_detector_ref.detectChanges();
    this.edit_obj.emit(selectedOption);

  }

  onSelectNone(ev) {
    this.search_valid = false;

    this.form_group.get(this.form_control).reset();

    this.onSelect(null, null)

  }

  downArrow(event) {

    switch (event.keyCode) {
      case 38: //up-arrow
        this.arrow_key_location--;
        if (this.arrow_key_location < 0) {
          this.arrow_key_location = 0;
        }


        if (this.view) {
          this.view.scrollToIndex(this.arrow_key_location);
        }
        break;
      case 40: //down-arrow
        ++this.arrow_key_location;
        for (let i = 0; i < this.filtered_input.length; i++) {
          this.arrow_key_location == i ? this.view.scrollToIndex(this.arrow_key_location) : this.view.scrollToIndex(0);
        }
        this.view.scrollToIndex(this.arrow_key_location);
        if (this.view && (this.filtered_input.length - 1 <= this.arrow_key_location && this.filtered_input.length != 0 && !this.back_hit)) {
          this.arrow_key_location = this.filtered_input.length - 1;
        }
        break;
      case 8: //backspace
        if (this.form_group && this.form_group.value && this.form_group.value[this.form_control]) {
          this.filter(this.form_group.value[this.form_control]);
          this.back_hit = true;
          this.showList();
        }

        break;
      case 13: //enter
        {

          if (this.filtered_input.length > 0 && this.search_valid) {
            let i = 0;

            this.filtered_input.forEach(element => { //for Enter press on filtered value listner
              if (i == this.arrow_key_location) {
                // this.selected_obj.emit(element);
                this.qwe.setValue(element[this.title_property])
                this.form_group.get(this.form_control).setValue(element[this.id_property]);
                this.filtered_value = element;
                // this.mobile_num_len.emit(element[this.mnum_property_name]);
                this.search_valid = false;
                this.last_value = element;
              }
              i++;
            });
          }
          else if (this.search_valid) {
            let i = 0;
            this.filtered_input.forEach(element => { //for Enter press on filtered value listner
              if (i == this.arrow_key_location) {
                // this.selected_obj.emit(element);
                this.qwe.setValue(element[this.title_property]);
                this.form_group.get(this.form_control).setValue(element[this.id_property])
                this.filtered_value = element;
                this.search_valid = false;
                this.last_value = element;
              }
              i++;
            });
          }
        }
        break;
      case 9: //tab

        if (this.last_value) {
          // this.selected_obj.emit(this.last_value);
          this.qwe.setValue(this.last_value[this.title_property])
          this.form_group.get(this.form_control).setValue(this.last_value[this.id_property]);
        } else {
          this.qwe.reset();
          this.form_group.get(this.form_control).reset();
        }
        this.search_valid = false;
        this.change_detector_ref.detectChanges();
        break;

      case 27: //escape
        this.search_valid = false;
        if (this.last_value) {
          // this.selected_obj.emit(this.last_value);
          this.qwe.setValue(this.last_value[this.title_property])
          this.form_group.get(this.form_control).setValue(this.last_value[this.id_property]);
        } else {
          this.qwe.reset();
          this.form_group.get(this.form_control).reset();
        }
        break;

    }
  }

  @HostListener('document : click', ['$event'])
  onDocumentClick(event) {

    this.clientY = event.clientY;
    this.back_hit = false;
    this.hideList(event, 0);

  }
  @HostListener('window: resize', ['$event'])
  onResize(event) {
    this.inner_height = window.innerHeight;
    this.getPosition();
  }

  @HostListener('document: scroll', ['$event'])
  onScroll(event) {
    this.getPosition();
  }

  getPosition() {
    this.dimension = (this.form.nativeElement.getBoundingClientRect());
    if (!this.display_overlay) {
      this.top = this.dimension.top + 23;  //the height of virtualscrollbar
      this.left = this.dimension.left;
    }
    else {
      if (this.dimension) {
        let center = 0;
        if (this.dimension.width < 200) {
          this.dimension_width = 200;
          center = this.dimension_width - this.dimension.width;
        }
        else {
          this.dimension_width = this.dimension.width
        }
        if (this.inner_height / 2 >= this.dimension.top) {
          this.top = this.dimension.top + 23;
          this.left = this.dimension.left;
        }
        else {
          this.top = this.dimension.top - 200;


          this.left = this.dimension.left;
        }
      }
    }
  }
  close() {
    this.search_valid = false;
  }
}




