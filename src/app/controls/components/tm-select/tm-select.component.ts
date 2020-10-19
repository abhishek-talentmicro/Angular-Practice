import { FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, Output, EventEmitter, OnChanges, ElementRef } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { HideOption, HTMLFormatter, stripHtmlTags } from '../dynamic-form/dynamic-form.component';
import { addMasters } from '../dynamic-section/functions/dynamic-section-functions';
import { MatDialog } from '@angular/material/dialog';
import { cloneArray } from 'src/app/functions/functions';

@Component({
  selector: 'tm-select',
  templateUrl: './tm-select.component.html',
  styleUrls: ['./tm-select.component.scss'],
  providers: [HideOption, HTMLFormatter]
})
export class TMSelectComponent implements OnInit, OnChanges {

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
  @Input() basic;
  @Input() master_obj;
  @Input() enable_virtual_scroll;
  @Output() fetchEntries = new EventEmitter<any>();
  @Output() selected_obj = new EventEmitter<any>();
  @Input() style;
  @Input() class_property;
  @Input() label_block;
  @Input() maxLength;
  @Input() minLength;
  @Input() maxValue;
  @Input() minValue;
  @Input() prefix_label;
  @Input() suffix_label;
  @Input() label_class;
  @Input() label_css;
  @Input() master_form_code;

  @Input() master_call_back;
  filtered_value;
  a = 'asdas'
  show_list: boolean = false;
  filtered_options = [];
  @ViewChild('form', { static: true }) form;
  @ViewChild(CdkVirtualScrollViewport) options_list_view: CdkVirtualScrollViewport;
  @ViewChild('hidden_input') hidden_input: ElementRef;
  filter_keyword_delay;

  skip;
  obj_take;
  take;
  total_count;
  masterCallbackRef

  search = new FormControl();
  selected_option;
  view_port: any;
  inner_height: number;
  top: number = 0;
  left: number = 0;
  arrow_key_location = 0;
  select_height;
  last_search;
  clientY;
  back_hit: boolean = false;
  dimension;
  dimension_width;
  display_overlay = 0;
  emit = true;
  delayed_keyword;
  random_id = 'tallint_select' + Math.floor((Math.random() * 10000) + 1) + Date.now();

  constructor(
    private change_detector_ref: ChangeDetectorRef,
    private dialog: MatDialog,
    private HideOption: HideOption,
    private HTMLFormatter: HTMLFormatter,
  ) {

  }

  init() {
    this.options = this.HideOption.transform(this.options);

    try {
      if (this.options && this.options.length) {
        for (let i = 0; i < this.options.length; i++) {
          if (this.options[i][this.title_property]) {
            this.options[i][this.title_property] = stripHtmlTags(this.HTMLFormatter.transform(this.options[i][this.title_property]));
          }
        }
      }
    }
    catch (err) {

    }
    this.masterCallbackRef = this.master_call_back ? this.master_call_back : this.openAddMasterModal.bind(this)
    if (!this.show_list) {
      this.search.reset();

      if (!this.form_group.get([this.form_control]).value) {
        this.search.reset();
      }
    }

    this.filtered_options = this.options;

    this.initializeValue();

    this.setVirtualScroll();

    if (this.disabled) {
      this.disable(this.disabled);
    }
  }

  calculatePosition() {
    let top = document.getElementById(this.random_id).getBoundingClientRect().top;
    let left = document.getElementById(this.random_id).getBoundingClientRect().left;
    if (top > window.innerHeight / 2) {
      this.top = top - 195;
    }
    else {
      this.top = document.getElementById(this.random_id).getBoundingClientRect().top + 45;
    }
    if (left + 300 > (window.innerWidth)) {
      this.left = window.innerWidth - 325;
    }
    else {
      this.left = left;
    }
  }


  ngOnInit() {

    this.init();
  }

  ngOnChanges(ev) {
    console.log(ev);
    if (ev.options && !ev.options.firstChange) {
      this.init();
    }
    if (ev.data && !ev.data.firstChange) {
      this.search.reset();
      this.selected_option = !(ev.data.currentValue) ? ev.data.currentValue : this.selected_option;
      this.initializeValue();
    }
    if (ev.disabled) {
      this.disable(ev.disabled.currentValue)
    }
    console.log(this.label_class);

  }

  ngOnDestroy() {
  }

  disable(disable_flag) {
    if (disable_flag) {
      // this.search.disable();
      // this.form_group.get(this.form_control).disable()
    }
    else {
      this.search.enable();
      this.form_group.get(this.form_control).enable()
    }
  }


  clearValue(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    this.setValue(null);
  }

  showList(event) {
    if (!this.disabled) {
      try {
        if (!this.show_list) {
          this.calculatePosition();
          this.display_overlay = 1;
          this.show_list = true;
          this.filtered_options = this.options;
          // this.filter();
          // setTimeout(() => {
          //   this.setClickListener();
          // }, 100)
          event.target.select();
          // this.hidden_input.nativeElement.focus();
        }
      } catch (error) {

      }
      return true;
    }
  }

  setClickListener() {
    document.onclick = (ev) => {
      this.hideList(ev);

    }
  }

  destroyClickListener() {
    document.onclick = null;
  }

  checkForTab(ev) {
    if (ev.key == 'Tab') {
      this.hideList();
    }
  }


  searchKeyPress(event) {
    switch (event.keyCode) {
      case 38: //up-arrow
        this.moveInList(-1);
        break;

      case 40: //down-arrow
        this.moveInList(1);
        break;

      case 13: //enter
        {
          if (this.show_list) {
            if (this.filtered_options && this.filtered_options[this.arrow_key_location]) {
              this.onSelect(this.filtered_options[this.arrow_key_location]);
            }
          }
        }
        break;

      case 9: //tab
        // this.hideList();
        break;

      case 27: //escape
        this.hideList();
        break;

      default: //other keys
        this.filter(event);
    }
  }

  filter(event?) {
    this.showList(event);
    let filter = this.search && this.search.value ? this.search.value.toLowerCase() : '';
    this.delayed_keyword = filter;

    if (this.enable_virtual_scroll) {
      if (!this.filter_keyword_delay) {
        this.getMasters(0, 1000, filter);
      }
      // this.getMasters(0, 0, filter);
    }
    else {
      if (filter) {
        this.filtered_options = [];
        if (this.options)
          for (let i = 0; i < this.options.length; i++) {
            let option = this.options[i];
            if (option && option[this.title_property]) {
              if (option[this.title_property].toLowerCase().indexOf(filter) > -1) {
                this.filtered_options.push(option);
              }
            }
          }
      }
      else {
        this.filtered_options = this.options;
      }
    }
  }

  moveInList(val) {
    this.arrow_key_location = this.arrow_key_location + val;

    if (this.arrow_key_location >= this.filtered_options.length) {
      this.arrow_key_location = this.filtered_options.length - 1;
    }
    else if (this.arrow_key_location <= 0) {
      this.arrow_key_location = 0;
    }
    if (this.options_list_view) {
      this.options_list_view.scrollToIndex(this.arrow_key_location);
    }
  }

  hideList(ev?) {
    if (this.show_list && !ev || !(ev && document.getElementById(this.random_id) && (document.getElementById(this.random_id).contains(ev['relatedTarget']) || document.getElementById(this.random_id).contains(ev['target'])))) {
      this.show_list = false;
      if (this.selected_option) {
        this.search.setValue(this.selected_option[this.title_property])
      }
      else {
        this.search.reset();
        // this.form_group.get(this.form_control).reset();
        // this.search.markAsTouched();
        // this.search.markAsDirty();
        // this.form_group.get(this.form_control).markAsDirty();
        // this.form_group.get(this.form_control).markAsTouched();
      }
      this.display_overlay = 0;
      this.form_group.get([this.form_control]).markAsTouched();

      this.destroyClickListener();
      this.change_detector_ref.detectChanges();
    }
  }

  onSelect(selected_option) {
    if (this.filtered_options) {
      this.setValue(selected_option);

      //hide list after selection of an option
      this.hideList();
    }
  }

  setValue(selected_option) {
    if (selected_option != this.selected_option) {
      this.selected_option = selected_option;
      if (selected_option) {
        this.form_group.get(this.form_control).setValue(selected_option[this.id_property]);
        this.search.setValue(selected_option[this.title_property]);
      }
      else {
        this.form_group.get(this.form_control).setValue(null);
        this.search.setValue(null);
      }
      this.selected_obj.emit(selected_option);
    }
  }

  initializeValue() {
    // this.search.reset();
    // this.selected_option = null;
    let found = 0;
    if (this.filtered_options && this.form_group.get([this.form_control]).value) {
      for (let index = 0; index < this.filtered_options.length; index++) {
        let element = this.filtered_options[index];
        if (element[this.id_property] == this.form_group.get([this.form_control]).value) {
          this.search.setValue(element[this.title_property]);
          this.setValue(element);
          this.selected_option = element;
          found = 1;
          break;
        }
      }
    }
    // if (!found) {
    //   this.setValue(null);
    // }
  }

  onSelectNone(ev) {
    this.show_list = false;
  }

  getMasters(skip, take, search) {
    search = search ? search : '';
    // search = search ? search : '';
    this.filter_keyword_delay = true;
    setTimeout(() => {
      this.fetchEntries.emit({ 'skip': skip, 'take': take, 'search': this.delayed_keyword || '' });
      this.filter_keyword_delay = false;
    }, 900);
    setTimeout(() => {
      this.emit = true;
    }, 1000)

  }

  getNextBatch(e) {
    ////console.loge);
    if (this.enable_virtual_scroll) {
      if (e > 0) {
        if (this.emit && this.options) {
          if (e >= Math.floor(this.options.length * 0.99)) {
            if (this.take <= this.total_count) {
              this.skip = this.take + 1;
              this.getMasters(this.skip, this.master_obj.take, this.search.value);
              this.take += this.master_obj.take;
              this.emit = false;
            }
          }
        }
      }
    }
  }

  setVirtualScroll() {
    if (this.enable_virtual_scroll) {
      if (this.master_obj && this.master_obj.take) {
        const obj_take = this.master_obj.take;
        this.take = obj_take;
        this.total_count = this.master_obj.totalcount;
      }
      else {
        this.take = 100;
      }
    }
  }
  openAddMasterModal() {
    let setOptionRef = this.setOptions.bind(this)
    addMasters(this.dialog, this.id_property, this.title_property, setOptionRef, this.master_form_code);
  }

  setOptions(res) {
    let val;
    try {
      if (res && res.length) {
        val = cloneArray[res]
        for (let i = 0; i < res.length; i++) {
          const ele = res[i];
          if (this.options)
            for (let j = 0; j < this.options.length; j++) {
              const opt = this.options[j]
              if (ele[this.id_property] == opt[this.id_property]) {
                this.options[j] = res[i];
                res.splice(i, 1)
              }
            }

        }
        let arr = cloneArray(this.options);
        this.options = [];
        this.options.push(...arr, ...res);
        this.filtered_options = this.options;
        this.form_group.get([this.form_control]).patchValue(val[val.length - 1][this.id_property]);
        // res.forEach(res=>{
        //   this.options
        // })
      }
    } catch (error) {
      console.log(error)
    }
  }

}



