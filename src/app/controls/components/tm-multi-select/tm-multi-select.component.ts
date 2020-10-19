
import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, EventEmitter, Output, HostListener, Pipe, PipeTransform, OnChanges } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { FormControl } from '@angular/forms';
import { special_keys, HideOption, HTMLFormatter, stripHtmlTags } from '../dynamic-form/dynamic-form.component';
import { addMasters } from '../dynamic-section/functions/dynamic-section-functions';
import { MatDialog } from '@angular/material/dialog';
import { jsonParse, cloneArray } from 'src/app/functions/functions';

@Component({
  selector: 'tm-multi-select',
  templateUrl: './tm-multi-select.component.html',
  styleUrls: ['./tm-multi-select.component.scss'],
  providers: [HideOption, HTMLFormatter]
})
export class TmMultiSelectComponent implements OnInit {
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
  @Input() master_obj;
  @Input() enable_virtual_scroll;
  @Input() data;
  @Input() label_block;
  @Input() master_form_code;

  @Output() selected_obj = new EventEmitter<any>();
  @Output() fetchEntries = new EventEmitter<any>();

  @ViewChild('form', { static: true }) form;
  @ViewChild(CdkVirtualScrollViewport) options_list_view: CdkVirtualScrollViewport;
  @ViewChild('search_input') search_input;

  show_list: boolean = false;
  filtered_options = [];

  search = new FormControl();
  last_value;
  view_port: any;
  inner_height: number;
  top: number = 0;
  left: number = 0;
  filter_len: boolean = false;
  arrow_key_location = 0;
  filter_keyword_delay: boolean = false;
  delayed_keyword;
  code = [];
  select_all;
  display_overlay = 0;

  selected_options = [];
  selected_options_title = [];
  selected_options_code = [];

  emit = true;
  skip: number = 0;
  take: number = 0;
  total_count;

  random_id = 'tallint_multi_select' + Math.floor((Math.random() * 10000) + 1) + Date.now();


  constructor(
    private change_detector_ref: ChangeDetectorRef,
    private HideOption: HideOption,
    private dialog: MatDialog,
    private HTMLFormatter: HTMLFormatter
  ) {
  }

  init() {
    this.data = jsonParse(this.data);
    console.log(this.master_obj);
    this.options = jsonParse(this.options);
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

    if (!this.show_list) {
      this.search.reset();

      if (!this.form_group.get([this.form_control]).value) {
        this.search.reset();
      }
    }
    // if (this.form_group.get([this.form_control]).value) {
    //   // this.search.reset();
    //   this.form_group.get([this.form_control]).value = jsonParse(this.form_group.get([this.form_control]).value);
    // }

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
    if (ev.options && !ev.options.firstChange) {
      this.init();
    }
    if (ev.data && !ev.data.firstChange) {
      this.initializeValue();
    }
    if (ev.disabled) {
      this.disable(ev.disabled.currentValue)
    }

    if (ev.data && !ev.data.firstChange && ev.data.previousValue && ev.data.previousValue.length && !(ev.data.currentValue && ev.data.currentValue.length)) {
      if (this.selected_options) {
        for (let index = 0; index < this.selected_options.length; index++) {
          this.selected_options[index].option_selected = false;
        }
      }

      this.selected_options_code = [];
      this.selected_options = [];
      this.selected_options_title = [];
    }
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
      }
      catch (err) {

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
      this.search.reset();

      this.display_overlay = 0;
      this.form_group.get([this.form_control]).markAsTouched();

      this.destroyClickListener();
      this.change_detector_ref.detectChanges()
    }
  }

  onSelect(selected_option) {
    if (this.filtered_options) {
      this.setValue(selected_option, 1);
      this.setValueToFormControl();

      //hide list after selection of an option
      // this.hideList();
      this.search_input.nativeElement.focus();
    }
  }

  setValueToFormControl() {
    this.form_group.get([this.form_control]).setValue(this.selected_options_code);
  }

  setValue(selected_option, flag?) {
    if (selected_option) {
      if (selected_option.option_selected && flag) {
        this.clearValue(null, this.selected_options_code.indexOf(selected_option[this.id_property]));
      }
      else {
        if (this.selected_options_code.indexOf(selected_option[this.id_property]) == -1) {
          this.selected_options_code.push(selected_option[this.id_property]);
          this.selected_options_title.push(selected_option[this.title_property]);
          this.selected_options.push(selected_option);
          this.selected_obj.emit(this.selected_options);
        }
        selected_option.option_selected = true;
      }
    }
    else {
      this.clearAll(null);
    }
  }

  clearValue(ev, index) {
    if (this.selected_options && this.selected_options[index]) {
      this.selected_options[index].option_selected = false;
      this.selected_options_code.splice(index, 1);
      this.selected_options_title.splice(index, 1);
      this.selected_options.splice(index, 1);
      this.selected_obj.emit(this.selected_options);

      this.setValueToFormControl();
    }
  }


  initializeValue() {
    let value = this.form_group.get([this.form_control]).value;
    if (typeof value == 'string') {
      value = jsonParse(value);
    }
    if (value && typeof value != 'object') {
      value = [value];
    }
    if (!value || (typeof value == 'object' && value.length >= 0)) {
      this.form_group.get([this.form_control]).value = value;
      let found = 0;
      if (this.filtered_options && value && value.length) {
        for (let index = 0; index < this.filtered_options.length; index++) {
          let element = this.filtered_options[index];
          if (value.indexOf(element[this.id_property]) > -1) {
            this.setValue(element);
            if (this.selected_options.length == value.length) {
              found = 1;
              break;
            }
          }
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
    //console.loge);
    if (this.enable_virtual_scroll) {
      if (e > 0) {
        if (this.emit && this.options) {
          if (e >= Math.floor(this.options.length * 0.90)) {
            console.log(this.take, this.total_count)
            if (this.skip <= this.total_count) {
              // this.skip = this.take + 1;
              this.skip += this.take;
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
        this.total_count = this.master_obj.total_count || this.master_obj.totalcount;
      }
      else {
        this.take = 100;
      }
    }
  }

  clearAll(ev) {
    if (this.selected_options) {
      for (let index = 0; index < this.selected_options.length; index++) {
        this.selected_options[index].option_selected = false;
      }
    }

    this.selected_options_code = [];
    this.selected_options = [];
    this.selected_options_title = [];
    this.selected_obj.emit(this.selected_options);
    this.setValueToFormControl();
  }

  openAddMasterModal() {
    let setOptionRef = this.setOptions.bind(this)
    addMasters(this.dialog, this.id_property, this.title_property, setOptionRef, this.master_form_code);
  }

  setOptions(res) {
    let value;
    try {
      if (res && res.length) {
        value = cloneArray(res)
        for (let i = 0; i < res.length; i++) {
          const ele = res[i];
          if (this.options)
            for (let j = 0; j < this.options.length; j++) {
              const opt = this.options[j]
              if (ele[this.id_property] == opt[this.id_property]) {
                this.options[j] = res[i];
                res.splice(i, 1)
                break;
              }
            }
        }
        let a = [];
        if (this.form_group.get([this.form_control]).value && (this.form_group.get([this.form_control]).value).length) {
          a.push(...(this.form_group.get([this.form_control]).value))

        }
        this.clearAll(null);
        this.search.reset();

        let arr = cloneArray(this.options);
        this.options = [];
        this.options.push(...arr, ...res);
        this.filtered_options = this.options;

        for (let i = 0; i < value.length; i++) {
          a.push(value[i].code)
        }
        let final_value = []
        a.filter((item, index) => {
          if (a.indexOf(item) === index) {
            final_value.push(item)
          }
        });
        this.form_group.get([this.form_control]).patchValue(final_value);
        this.init()
        // res.forEach(res=>{
        //   this.options
        // })
      }
    } catch (error) {
      console.log(error)
    }
  }
}


// @Pipe({
//   name: 'SelectComponentPipe'
// })
// export class SelectComponentPipe implements PipeTransform {
//   transform(code: any, options: any[]): string {
//     let out_str;
//     if (typeof code != 'object') {

//       options.forEach(opt => {
//         if (opt.code && code == opt.code) {
//           out_str = opt.title || '';
//           return;
//         }
//       })
//       return out_str || '';
//     }
//   }
// }

