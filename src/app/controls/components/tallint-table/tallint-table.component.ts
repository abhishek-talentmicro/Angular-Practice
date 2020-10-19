import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Component, OnInit, Input, ChangeDetectorRef, OnChanges, Output, EventEmitter, ElementRef, ViewChild, Renderer2, AfterViewInit, Pipe, PipeTransform } from '@angular/core';
import { ColumnDetailsComponent } from './column-details/column-details.component';
import { DomSanitizer } from '@angular/platform-browser';
import { CdkVirtualScrollViewport, ScrollDispatcher } from '@angular/cdk/scrolling';
import * as moment from 'moment';
// import { TableFiltersComponent } from './table-filters/table-filters.component';
import { ExportExcelService } from 'src/app/services/vendor-management/workbench/export-excel/export-excel.service';
import { jsonParse, cloneArray } from 'src/app/functions/functions';


export const skip = 0;
export const take = 20;

@Component({
  selector: 'app-tallint-table',
  templateUrl: './tallint-table.component.html',
  styleUrls: ['./tallint-table.component.scss'],
  providers: [
    ExportExcelService
  ]
})

export class TallintTableComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() table_records = [];
  @Input() table_columns = [];
  @Input() total_count;
  @Input() multi_select;
  @Input() loading;
  @Input() edit;
  @Input() selected_entries;
  @Input() display_filter;
  @Output() fetchEntries = new EventEmitter();
  @Output() checkboxSelected = new EventEmitter();
  @Output() cellClicked = new EventEmitter();
  @Input() nested;
  @Input() fetching_entries;
  @Input() item_size;
  @Input() export;
  @Input() export_records;
  @Input() export_callback;
  @Input() export_ready;
  @Input() file_name;
  @Input() table_code;
  @Input() filter_template_list;
  @Input() grid_configuration;
  @Input() disable_virtual_scroll;

  @Input() form_masters;
  @Input() form_fields;
  @Input() formatted_table_records;

  @Input() enable_sort;

  @Input() table_configuration_flag;
  @Input() enable_summary = 1;
  @Input() summary;
  @Input() title;
  table_filter_obj;
  filter_obj = new TallintTableFilter();


  start: any = undefined;
  pressed: boolean = false;
  startX: any;
  startWidth: any;
  Math = Math;
  random_width = [];
  display_subrow = false;
  sort_flag = true;
  pointer = true;
  // fetchMultipleEntries: TableCheckedValues = new TableCheckedValues();

  // fetching_entries;
  // selected_entries = [];
  // selected_entries = [];

  skip;
  take;

  table_height;
  table_max_height;

  filter: Array<TallintTableColumnFilter>;
  sort: TallintTableColumnSort;

  select_all = false;

  tallint_table_columns = [];
  hide_table;

  parseInt = parseInt;

  @ViewChild("virtual_scroll") virtual_scroll: CdkVirtualScrollViewport;
  @ViewChild("tallint_table") tallint_table_ref: ElementRef;
  @ViewChild("virtual_scroll") cdk_view_port: CdkVirtualScrollViewport;
  table = document.getElementById('tableId');

  last_scroll_index = 0;

  footer_position;

  constructor(
    private change_detector: ChangeDetectorRef,
    private renderer: Renderer2,
    private export_excel_srv: ExportExcelService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private scrollDispatcher: ScrollDispatcher
  ) { }

  ngOnInit() {
    console.log(this.table_columns);
    console.log(this.summary);
    if (!this.selected_entries) {
      this.selected_entries = [];
    }

    // fromEvent(window, 'resize')
    // 	.pipe(
    // 		debounceTime(10),
    // 		takeUntil(this.destroy$),
    // 	)
    // 	.subscribe(() => this.viewportComponent.checkViewportSize())
    // ;
    this.table_configuration_flag = false;
    // this.filterEntries();
    if (this.loading == null || undefined) {
      this.loading = false;
    }
    for (let i = 0; i < 14; i++) {
      this.random_width[i] = [];
      for (let j = 0; j < 10; j++) {
        this.random_width[i][j] = this.randomNumber() + 'px';
      }
    }
    this.init();
    // this.change_detector.det


    // if (this.formatted_table_records && this.table_records && this.table_records.length) {
    //   for (let i = 0; i < this.table_records.length; i++) {
    //     this.table_records[i].data = this.formatted_table_records[i];
    //   }
    // }
  }

  ngAfterViewInit() {
    console.log(this.virtual_scroll['elementRef'].nativeElement.offsetHeight);
    this.footer_position = this.virtual_scroll['elementRef'].nativeElement.offsetHeight;

    // this.scrollDispatcher.scrolled().pipe(
    //   filter(event => this.virtual_scroll.getRenderedRange().end === this.virtual_scroll.getDataLength())
    // ).subscribe(event => {
    //   console.log(event);
    //   this.getNextBatch(event);
    //   //this.cd.detectChanges();
    // })

  }

  resizeTable(event, column) {
    this.start = event.target;
    this.pressed = true;
    setTimeout(() => {
      this.pointer = false;
    })

    this.startX = event.pageX;
    this.startWidth = this.start.clientWidth;
    this.renderer.listen('window', 'mousemove', (event) => {
      if (this.pressed) {
        let width = this.startWidth + (event.pageX - this.startX);
        // let index = this.start.cellIndex;
        if (column != null) {
          // if (column.width) {
          //   // column.width += width;
          // }
          // else {
          column.width = width;
          // }
        }
        event.preventDefault();
        this.change_detector.detectChanges();
      }
    });
    this.renderer.listen('window', 'mouseup', (event) => {
      column = null;
      if (this.pressed) {
        this.pressed = false;
        this.pointer = true;
      }
    });
  }

  init() {
    // this.virtual_scroll.nativeElement.scrollTop = 0;
    // if (this.virtual_scroll && this.virtual_scroll['elementRef'] && this.virtual_scroll['elementRef'].nativeElement) {
    //   this.virtual_scroll['elementRef'].nativeElement.scroll(0, 0);
    // }
    this.filter = this.filter ? this.filter : [];
    this.skip = skip;
    this.take = take;
    this.sort = new TallintTableColumnSort();

    this.table_height = this.total_count ? (this.total_count * 24.67) + 60 : 100;
    // this.table_max_height = (this.total_count * 25.33) + 60;
    if (this.multi_select) {
      try {
        if (this.selected_entries.length) {
          let flag = true;
          this.selected_entries.forEach(element => {
            if (this.table_records.indexOf(element) == -1) {
              flag = false;
            }
          });
          this.select_all = flag && this.selected_entries.length == this.table_records.length;
        }
        else {
          this.select_all = false;
        }
      } catch (err) {
        this.select_all = false;
      }
    }


    this.initializeColumns();
    this.change_detector.detectChanges();
  }

  ngOnChanges(ev) {
    if (ev.total_count || (ev.table_columns && ev.table_columns.length)) {
      this.init();
    }
    if (ev.table_records) {
      this.fetching_entries = 0;
      this.table_records = ev.table_records.currentValue || this.table_records; //getting lastest update data or update existing records
      this.change_detector.detectChanges();

    }
    // if (this.export_ready && this.export_records && this.export_records.length > 0) {
    //   let exp_data = [];
    //   let rows = {};
    //   this.table_records.forEach(row => {
    //     this.tallint_table_columns.forEach(col => {
    //       if (col['visible']) {
    //         let prop = col['property']
    //         let titles = col['title']
    //         rows[titles] = row[prop];
    //       }
    //     })
    //     if (rows)
    //       exp_data.push(rows);
    //     rows = {};
    //   })
    //   this.export_excel_srv.exportExcel(exp_data, this.file_name || 'Details');
    //   this.export_ready = false;
    //   this.export_records = [];
    //   this.change_detector.detectChanges();
    // }

  }

  exportToExcelParent() {
    if (this.export_records && this.export_records.length > 0) {
      let exp_data = [];
      let rows = {};
      this.export_records.forEach(row => {
        this.tallint_table_columns.forEach(col => {
          if (col['visible']) {
            let prop = col['property']
            let titles = col['title']
            rows[titles] = row[prop];
          }
        })
        if (rows)
          exp_data.push(rows);
        rows = {};
      })
      this.export_excel_srv.exportExcel(exp_data, this.file_name || 'Details');
      this.export_records = [];
      this.export_ready = false;
      this.change_detector.detectChanges();
    }
  }

  initializeColumns() {
    if (this.table_records && this.table_records.length) {
      if (!(this.table_columns && this.table_columns.length)) {
        let columns = Object.keys(this.table_records[0]);
        if (columns && columns.length) {
          this.tallint_table_columns = [];
          columns.forEach((column, index) => {
            let col = new TallintTableColumn();

            try {
              if (isNaN(this.table_records[0][column])) {
                var d = moment(this.table_records[0][column], moment.ISO_8601);
                if (d.isValid()) {
                  col.setData(column, column, 'date');
                }
                else {
                  col.setData(column, column);
                }

              }
              else {
                col.setData(column, column);
              }
              //&& isNaN(this.table_records[0][column]))
            } catch (error) {
              col.setData(column, column);
            }
            try {
              if (this.filter && this.filter[index] && this.filter[index].value) {
                this.filter[index] = new TallintTableColumnFilter(column, this.filter[index].operator, this.filter[index].value);
              }
              else {
                this.filter[index] = new TallintTableColumnFilter(column, null, null);
              }
            }
            catch (err) {
              this.filter[index] = new TallintTableColumnFilter(column, null, null);
            }
            col.visible = true;
            this.tallint_table_columns.push(col);
          })
        }
      }
      else if (this.table_columns && this.table_columns.length) {
        this.tallint_table_columns = [];
        if (typeof this.table_columns == 'object' && this.table_columns.length) {
          this.table_columns.forEach((column, index) => {
            try {
              if (this.filter && this.filter[index] && this.filter[index].value) {
                this.filter[index] = new TallintTableColumnFilter(column.property, this.filter[index].operator, this.filter[index].value);
              }
              else {
                this.filter[index] = new TallintTableColumnFilter(column.property, null, null);
              }
            }
            catch (err) {
              this.filter[index] = new TallintTableColumnFilter(column.property, null, null);
            }
            let col = new TallintTableColumn();
            col.setDataObj(column);
            this.tallint_table_columns.push(col);
          });
        }
        else {
          this.table_columns = jsonParse(this.table_columns);
          this.table_columns.forEach((column, index) => {
            try {
              if (this.filter && this.filter[index] && this.filter[index].value) {
                this.filter[index] = new TallintTableColumnFilter(column.property, this.filter[index].operator, this.filter[index].value);
              }
              else {
                this.filter[index] = new TallintTableColumnFilter(column.property, null, null);
              }
            }
            catch (err) {
              this.filter[index] = new TallintTableColumnFilter(column.property, null, null);
            }
            let col = new TallintTableColumn();
            col.setDataObj(column);
            this.tallint_table_columns.push(col);
          });
        }

        try {
          for (let i = 0; i < this.tallint_table_columns.length; i++) {
            for (let j = 0; j < this.tallint_table_columns.length - i - 1; j++) {
              if (this.tallint_table_columns[j].sequence > this.tallint_table_columns[j + 1].sequence) {
                let obj = Object.assign({}, this.tallint_table_columns[j]);
                this.tallint_table_columns[j] = Object.assign({}, this.tallint_table_columns[j + 1]);
                this.tallint_table_columns[j + 1] = obj;
              }
            }
          }
        } catch (err) { }
      }
    }
    this.change_detector.detectChanges();
  }

  filterEntries(flag) {
    let table_state = this.getTableState();
    if (flag || flag == 0) {
      table_state['flag'] = flag;
    }
    this.fetching_entries = 1;
    if (this.fetchEntries) {
      this.fetchEntries.emit(table_state);
    }

  }

  keyPressed(ev) {
  }

  rowSelected(obj) {
    if (!obj['row_selected']) {
      this.selected_entries.push(obj);
      obj['row_selected'] = true;
    }
    else {
      obj['row_selected'] = false;
      if (this.selected_entries.indexOf(obj) >= 0) {
        this.selected_entries.splice(this.selected_entries.indexOf(obj), 1);
      }
    }
    if (this.selected_entries.length === this.table_records.length) {
      this.select_all = true;
    }
    else {
      this.select_all = false;
    }
    if (this.checkboxSelected) {
      this.checkboxSelected.emit(this.selected_entries);

    }
  }

  selectAll(flag) {
    try {
      if (this.selected_entries.length === this.table_records.length) {
        this.select_all = true;
      }
      else {
        this.select_all = false;
      }
      if (flag) {
        // this.selected_entries = [];
        this.table_records.forEach(element => {
          element['row_selected'] = true;
          this.select_all = true;
          let index = this.selected_entries.indexOf(element);
          if (index == -1)
            this.selected_entries.push(element);
        })
      }
      else {
        this.table_records.forEach(element => {
          element['row_selected'] = false;
          this.select_all = false;
          let index = this.selected_entries.indexOf(element);
          if (index >= 0)
            this.selected_entries.splice(index, 1);
        })
      }

      if (this.checkboxSelected) {
        this.checkboxSelected.emit(this.selected_entries);
      }
      this.change_detector.detectChanges();
      // TableCheckedValues.setCheckedValues(this.selected_entries);
    }
    catch (err) {

    }
  }

  sortColumn(column: TallintTableColumn) {
    this.pointer = true;
    if (this.enable_sort) {
      this.skip = 0;
      this.take = take;
      this.sort_flag = false;
      if (column.sort == true) {
        this.sort.setDesc(false);
      }
      else if (column.sort == false) {
        this.sort.setDesc(true);
      }
      else {
        if (this.sort && this.sort.column) {
          this.sort.setDesc(null);
        }
        column.sort = true;
        this.sort.setData(column, true);
      }
      this.filterEntries(0);
    }
  }

  // getTableState() {
  //   let table_obj = new Object();

  //   table_obj['skip'] = this.skip;
  //   table_obj['take'] = take; //this.take;

  //   let filter = this.getTableFilter();

  //   if (filter && filter.length) {
  //     // table_obj['filter'] = JSON.stringify(filter);
  //     table_obj['filter'] = (filter);
  //   }

  //   let sort = this.getTableSort();

  //   if (sort && sort['selector']) {
  //     // table_obj['sort'] = JSON.stringify([sort]);
  //     table_obj['sort'] = [sort];
  //     table_obj['flag'] = 0;
  //   }

  //   // table_obj['totalSummary'] = JSON.stringify([{ "selector": "Id", "summaryType": "count" }]);
  //   table_obj['totalSummary'] = [{ "selector": "Id", "summaryType": "count" }];
  //   table_obj['requireTotalCount'] = true;
  //   return table_obj;
  // }

  // getTableFilter() {
  //   let filter_array = [];
  //   this.filter.forEach((element, index) => {
  //     element.operator = '=';
  //     if (element && element.property && element.value && element.operator && element.value != '') {
  //       filter_array.push([element.property, element.operator, element.value]);
  //     }
  //   });

  //   let filter_array_final = [];
  //   filter_array.forEach((element, index) => {
  //     filter_array_final.push(element);
  //     if (index < filter_array.length - 1) {
  //       filter_array_final.push('and');
  //     }
  //   })
  //   return filter_array_final;
  // }


  getTableState() {
    let table_obj = new Object();

    table_obj['skip'] = this.skip;
    table_obj['take'] = this.take;

    let filter = this.getTableFilter();

    let table_filter = this.getTableFilterObject();

    if (filter && filter.length) {
      table_obj['filter'] = (filter);
    }

    if (table_filter && table_filter.length) {
      table_obj['table_filter'] = (table_filter);
    }

    let sort = this.getTableSort();

    if (sort && sort['selector']) {
      table_obj['sort'] = [sort];
      table_obj['flag'] = 0;
    }
    table_obj['totalSummary'] = [{ "selector": "Id", "summaryType": "count" }];
    table_obj['requireTotalCount'] = true;
    return table_obj;
  }

  getTableFilter() {
    let filter_array = [];
    this.filter.forEach((element, index) => {
      element.operator = 'contains';
      if (element && element.property && element.value && element.operator && element.value != '') {
        // console.log(typeof element.value,this.filter);
        if (typeof element.value == 'object') {
          element.value = moment.parseZone(element.value).format('YYYY-MM-DD')
        }
        filter_array.push([element.property, element.operator, element.value]);
      }
    });

    let filter_array_final = [];
    filter_array.forEach((element, index) => {
      filter_array_final.push(element);
      if (index < filter_array.length - 1) {
        filter_array_final.push('and');
      }
    })
    return filter_array_final;
  }


  getTableSort() {
    if (this.sort) {
      let sort_obj = new Object();
      sort_obj['selector'] = this.sort.selector;
      sort_obj['desc'] = this.sort.desc;
      return sort_obj;
    }
    else {
      return null;
    }
  }

  getNextBatch(e) {
    console.log(e)
    if (this.fetchEntries && !this.disable_virtual_scroll) {
      if (e > 0 && e > this.last_scroll_index) {
        // e >= (this.table_records.length * 0.60) || 
        if (((e >= (this.virtual_scroll.getRenderedRange().end * 0.8)) || (this.virtual_scroll.getRenderedRange().end === this.virtual_scroll.getDataLength())) && !this.fetching_entries) {
          this.checkConditionAndFetch();
        }
      }
      this.last_scroll_index = e;
    }
  }

  checkConditionAndFetch() {
    if (this.take < this.total_count) {
      this.skip = this.take + 1;
      this.take += take;
      this.filterEntries(1);
    }
  }


  randomNumber() {
    return Math.floor(Math.random() * (100) + 80);
  }

  cellClick(func, data, column?) {
    this.cellClicked.emit({ func: func, data: data, col_details: column });
    if (func == 'display') {
      data.nested_flag = !data.nested_flag;
    }
  }

  exportDataToExcel() {
    this.export_callback()

  }

  openColumnDetails() {
    let ref = this.dialog.open(ColumnDetailsComponent, {
      width: '720px',
      data: {
        cols: this.table_columns || [],
        table_code: this.table_code,
        filter_temp_list: this.filter_template_list || []
      }
    })
    ref.afterClosed().subscribe(res => {
      if (res) {
        this.table_columns = res || [];
        this.initializeColumns();
      }
    })
  }

  triggerCellClick(func_name, row, col?) {
    this.cellClick(func_name, row, col)
  }

  calclateTop() {
    if (!this.cdk_view_port || !this.cdk_view_port["_renderedContentOffset"]) {
      return "-0px";
    }
    let offset = this.cdk_view_port["_renderedContentOffset"];
    return `-${offset}px`;
  }

  calclateTopSearch() {
    if (!this.cdk_view_port || !this.cdk_view_port["_renderedContentOffset"]) {
      return "23px";
    }
    let offset = this.cdk_view_port["_renderedContentOffset"];
    return `-${offset - 23}px`;
  }

  // filterModal(table_obj, operators_list) {
  //   const matDialogConfig = new MatDialogConfig();
  //   matDialogConfig.width = "60%";
  //   const dialog = this.dialog.open(TableFiltersComponent, matDialogConfig);
  //   if (table_obj.filter_data) {
  //     (dialog.componentInstance).filter_array = table_obj.filter_data;
  //   }
  //   (dialog.componentInstance).column_list = this.tallint_table_columns;
  //   (dialog.componentInstance).operators_list = operators_list;
  //   dialog.afterClosed().subscribe(res => {
  //     if (res) {

  //       if (res.backup) {
  //         table_obj.filter_data = cloneArray(res.backup);
  //         this.table_filter_obj = cloneArray(res.backup);
  //       }
  //       else {
  //         table_obj.filter_data = cloneArray(res);
  //         this.table_filter_obj = cloneArray(res);
  //         this.filterEntries(0);
  //       }

  //       // this.filterEntries(0);
  //       // this.fetchEntries.emit(this.getTableFilterObject(res))
  //     }
  //   })
  // }

  getTableFilterObject() {
    this.table_filter_obj = this.filter_obj.structureData(this.table_filter_obj);

    if (this.table_filter_obj && typeof this.table_filter_obj == 'object' && this.table_filter_obj.length) {
      return this.table_filter_obj;
    }

    return []
  }

  calclateBottom() {
    this.footer_position = this.virtual_scroll['elementRef'].nativeElement.offsetHeight;
    if (!this.footer_position) {
      return this.footer_position;
    }
    return `-${this.footer_position}px`;
  }

  hideTable() {
    this.hide_table = 1;
  }

  showTable() {
    this.hide_table = 0;
  }

}

@Component({
  selector: '[table-row]',
  templateUrl: './tallint-table-row.html',
  styleUrls: ['./tallint-table.component.scss']
})
export class TallintTableRowComponent {
  @Input() row;
  @Input() rowSelected;
  @Input() cellClick;
  @Input() tallint_table_columns;
  @Input() multi_select;
  @Input() edit;
  @Input() nested;
  @Input() index;
  @Input() column;
  @Input() padding_exp;
  @Input() style;

  @Input() form_fields;
  @Input() form_masters;
  @Input() formatted_row;

  display_row;

  close = '</tr>'
  constructor(
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (this.formatted_row) {
      this.display_row = this.row.processed_data;
      ;

    }
    else {
      this.display_row = this.row;
    }
  }

  triggerCellClick(func_name, col?) {
    this.cellClick(func_name, this.row, col)
  }

}

export class TallintTableColumn {
  title: string;
  property: string;
  sort: boolean;
  visible: boolean;
  width: string;
  cell_filter: string;
  data_type: string;
  cell_class: string;
  cell_template: string;
  description: string;
  ascending: number;
  grouping: number;
  form_code: string;
  status: number;
  function_name: string;
  label_code: string;

  sub_module_code: string;
  module_code: string;

  conditions: any;
  sequence: number;

  child_columns = [];

  constructor() { }

  setData(title, property, data_type?) {
    this.title = title;
    this.property = property;
    this.data_type = data_type === 'date' ? data_type : 'string';
  }

  setDataObj(obj) {
    this.label_code = obj.label_code;

    this.sub_module_code = obj.sub_module_code;
    this.module_code = obj.module_code;
    this.title = obj.title;
    this.property = obj.property;
    this.sort = obj.sort;
    this.visible = obj.visible;
    this.width = obj.width;
    this.cell_filter = obj.cell_filter;
    this.data_type = obj.data_type;
    this.cell_class = obj.cell_class;
    this.cell_template = obj.cell_template;
    this.description = obj.description;
    this.ascending = obj.ascending;
    this.grouping = obj.grouping;
    this.form_code = obj.form_code;
    this.status = obj.status;
    this.function_name = obj.field_name;
    this.label_code = obj.label_code;
    this.conditions = obj.conditions;
    this.sequence = obj.sequence;
    this.child_columns = [];

    obj.child_columns = jsonParse(obj.child_columns);

    try {
      if (obj.child_columns && obj.child_columns.length && typeof obj.child_columns == 'object') {
        obj.child_columns.forEach(item => {
          let a = new TallintTableColumn();
          a.setDataObj(item);
          this.child_columns.push(a);
        });
      }
    } catch (error) {
      
    }

    console.log(this.child_columns);
  }
}

export class TallintTableColumnFilter {
  property: string;
  operator: string;
  value: string;


  constructor(
    property = null,
    operator = null,
    value = null
  ) {
    this.property = property;
    this.operator = operator;
    this.value = value;
  }
}

export class TallintTableColumnSort {
  selector: string;
  desc: boolean;
  column: TallintTableColumn;

  constructor() {
  }

  setData(column = null, desc = null) {
    if (column) {
      this.selector = column.property;
      this.desc = desc;
      this.column = column;
    }
  }
  setDesc(desc) {
    this.desc = desc;
    this.column.sort = desc;
  }
}


@Pipe({
  name: 'TableRowCSS'
})
export class TableRowCSS implements PipeTransform {
  transform(input: any, row): any {
    let css_class = '';
    if (input.req_res_id == 15880) {
      css_class += 'red';
    }

  }
}

@Pipe({
  name: 'CheckGridConditions'
})
export class CheckGridConditions implements PipeTransform {
  transform(input: any, data: any): any {
    let status = true;
    try {
      if (input && input.length) {
        status = eval(input)
      }
    }
    catch (err) {
      console.log(err);
    }
    return status;
  }
}

@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe {

  constructor(private sanitizer: DomSanitizer) {

  }

  transform(style) {
    return this.sanitizer.bypassSecurityTrustStyle(style);
  }
}



export class TallintTableFilter {
  or_flag: number;
  column: string;
  value1: string;
  value2: string;
  operator_code: number;



  structureData(obj) {
    let out_arr = [];
    if (obj && typeof obj == "object" && obj.length) {
      obj.forEach(ele => {
        this.setData(ele);
        out_arr.push(this.getData())
      })
    }


    return out_arr || [];
  }

  setData(obj = {
    or_flag: null,
    column: null,
    value1: null,
    value2: null,
    operator_code: null
  }) {
    this.or_flag = (obj.or_flag ? 1 : 0);
    this.column = obj.column || 0;
    this.value1 = obj.value1 || '';
    this.value2 = obj.value2 || '';
    this.operator_code = obj.operator_code || 0;
  }


  getData() {
    return {
      or_flag: this.or_flag,
      column: this.column,
      value1: this.value1,
      value2: this.value2,
      operator_code: this.operator_code

    }
  }
}