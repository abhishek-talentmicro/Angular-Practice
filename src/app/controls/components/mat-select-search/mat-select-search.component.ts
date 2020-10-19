import { FormControl, FormGroup } from "@angular/forms";
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ChangeDetectorRef,
  AfterViewInit,
  OnChanges,
  HostListener,
  OnDestroy,
  Output
} from "@angular/core";
import { Observable } from "rxjs";
import { map, startWith, switchMap } from "rxjs/operators";
import { Directive, ElementRef, Renderer2 } from "@angular/core";
import { EventEmitter } from 'events';
@Component({
  selector: "app-mat-select-search",
  templateUrl: "./mat-select-search.component.html",
  styleUrls: ["./mat-select-search.component.scss"]
})
export class MatSelectSearchComponent
  implements OnChanges {
  @Input() input_list;
  @Input() form_group;
  @Input() form_control_name;
  @Input() title_property_name;
  @Input() id_property_name;
  @Input() place_holder_name;
  @Input() selected_input;
  @Input() is_required;

  @Output() change_event = new EventEmitter()

  filtered_value;
  search_valid: boolean = false;
  filtered_input: Observable<string[]>;
  auto_id: string;
  @ViewChild("form", { static: true }) form;
  list_copy = [];
  last_value;
  view_port: any;
  inner_height: number;
  top: number;
  left: number;
  filter_len: boolean = false;
  arrow_key_location = 0;
  option_copy = [];
  select_height;
  last_search;
  back_hit: boolean = false;

  constructor(
    private change_detector_ref: ChangeDetectorRef,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnChanges() {
    this.change_detector_ref.detectChanges();
    try {
      this.input_list.forEach(element => {
        if (this.form_group.value[this.id_property_name]) {
          if (element[this.id_property_name] == this.form_group.value[this.id_property_name]) {
            this.last_value = element[this.title_property_name];
            if (this.form_group) {
              this.form_group.controls[this.form_control_name].setValue(
                element[this.title_property_name]
              );
            }
          }
        }
      });
    }
    catch (e) {

    }

    if (this.form != undefined) {
      if (this.view_port >= this.inner_height / 2) {
        // this.top = window.scrollX - 197;  //the height of virtualscrollbar
        // this.left = window.scrollY + 15;
        document.body.scrollIntoView(true);
      } else {
        this.top = window.scrollX + 50; //the height of virtualscrollbar
        this.left = window.scrollY + 15;
      }
    }
  }
  ngAfterViewInit() {
    if (this.form != undefined) {
      // this.dimension = (this.form.nativeElement.getBoundingClientRect());
      if (this.view_port >= this.inner_height / 2) {
        //  this.top = window.scrollX - 197;  //the height of virtualscrollbar
        // this.left = window.scrollY + 15;
        document.body.scrollTop;
      } else {
        this.top = window.scrollX + 50; //the height of virtualscrollbar
        this.left = window.scrollY + 15;
      }
    }
  }
  ngOnInit() {
    this.filtered_input = null;
    this.inner_height = document.body.scrollHeight;
    this.auto_id = Math.random() * Math.floor(100000) + "_" + Date.now();
    document.onclick = ev => {
      this.hideList(ev, 0);
    };
    this.list_copy = Object.assign([], this.input_list || []);
  }
  showList() {
    this.search_valid = true;
    this.arrow_key_location = 0;
    if (this.last_value && !this.back_hit) {
      this.form_group.controls[this.form_control_name].setValue(
        this.last_value
      );
    }
    //  this.search_valid = !this.search_valid;
    this.filtered_input = this.form_group
      .get(this.form_control_name)
      .valueChanges.pipe(
        startWith(""),
        map(value => this.filter(value ? value.toString() : ""))
      );
    // this.ngAfterViewInit();
    // this.form_group.get(this.form_control_name).valueChanges.subscribe(res => {
    //   this.filtered_input = res.pipe(
    //     startWith(""),
    //     map(value => this.filter(value ? value.toString() : ""))
    //   );

    //   //  if (this.input_list.filter(option => option[this.title_property_name].toLowerCase().includes(res)).length > 0) {
    //   //   this.filter(res);

    //   //  // this.search_valid = true;
    //   // }
    //   // }
    // });
  }
  filter(value: string | any) {

    // this.search_valid =true;

    let filterValue = "";
    if (value) {
      this.filter_len = false;
      filterValue =
        typeof value === "string"
          ? value.toLowerCase()
          : value[this.title_property_name].toLowerCase();
      this.option_copy = this.input_list.filter(option =>
        option[this.title_property_name].toLowerCase().includes(filterValue)
      );
      //console.log(this.input_list.filter(option => option[this.title_property_name].toLowerCase().includes(filterValue))) ;
      // this.search_valid = true;
      this.arrow_key_location = 0;
      if (
        this.input_list.filter(option =>
          option[this.title_property_name].toLowerCase().includes(filterValue)
        ).length > 0 &&
        this.last_value != value
      ) {
        this.search_valid = true;
      } else {
        this.search_valid = false;
      }

      return this.input_list.filter(option =>
        option[this.title_property_name].toLowerCase().includes(filterValue)
      );
    } else {
      return this.input_list;
    }
  }
  hideList(ev, keyboard_flag) {
    //console.log(this.form.nativeElement)


    if (!keyboard_flag && !this.form.nativeElement.contains(ev["target"])) {
      this.search_valid = false;

      this.filter_len = false;
      this.form_group.controls[this.form_control_name].setValue(
        this.last_value
      );

    } else if (
      keyboard_flag &&
      ev["relatedTarget"] &&
      !this.form.nativeElement.contains(ev["relatedTarget"])
    ) {
      this.search_valid = false;
      this.filter_len = false;
    }
  }
  sendCountryDetails(ev, selectedOption) {
    


    // this.form_group.controls[this.form_control_name].setValue(
    //   selectedOption[this.id_property_name]
    // );
    this.search_valid = false;
    this.last_value = selectedOption[this.title_property_name];

    this.form_group.controls[this.form_control_name].setValue(selectedOption);
    this.change_event.emit(selectedOption);
  }
  @HostListener("window: resize", ["$event"])
  onResize(event) {
    this.inner_height = window.innerHeight;
  }

  @HostListener("click", ["$event"])
  onScroll(event) {

    this.view_port = event["y"];
    this.filter_len = !this.filter_len;
    this.ngAfterViewInit();
  }
  downArrow(event) {
    if (this.form_group && this.form_group.value && this.form_group.value.id) {
      //this.filter(this.last_search);

    }


    switch (event.keyCode) {
      case 38:
        this.arrow_key_location--;
        break;
      case 40:
        this.arrow_key_location++;
        break;
      case 8:
        if (
          this.form_group &&
          this.form_group.value &&
          this.form_group.value.id
        ) {
          this.filter(this.form_group.value.id);
          this.back_hit = true;
          this.showList();
          // this.filtered_value = this.filter(this.mat_search_form.value.id);
        }
        break;
      case 13:
        {
          let i = 0;
          this.option_copy.forEach(element => {
            //for Enter press on filtered value listner
            if (i == this.arrow_key_location) {

              this.form_group.controls[this.form_control_name].setValue(
                element[this.title_property_name]
              );
              this.form_group.controls[this.form_control_name].setValue(
                element[this.id_property_name]
              );
              this.filtered_value = element;
              this.search_valid = false;
              this.last_value = element[this.title_property_name];
            }
            i++;
          });
        }
        break;
      case 9:
        this.form_group.controls[this.form_control_name].setValue(
          this.last_value
        );
        break;
    }
  }

  change(ev) {

  }
}
