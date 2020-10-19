import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TallintTableColumn } from '../tallint-table/tallint-table.component';
import { jsonParse } from 'src/app/app.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  constructor() { }

  @Input() grid_layout;
  @Input() table_records;
  @Output() cellClicked = new EventEmitter();
  tallint_table_columns = [];

  ngOnInit() {
    this.initializeColumns()
  }

  initializeColumns() {
    if (this.table_records && this.table_records.length) {
      if (!(this.grid_layout && this.grid_layout.length)) {
        let columns = Object.keys(this.table_records[0]);
        if (columns && columns.length) {
          this.tallint_table_columns = [];
          columns.forEach((column, index) => {
            let col = new TallintTableColumn();

            try {
              if (isNaN(this.table_records[0][column])) {
                new Date(this.table_records[0][column]).toISOString();
                col.setData(column, column, 'date');
              }
              else {
                col.setData(column, column);
              }
              //&& isNaN(this.table_records[0][column]))
            } catch (error) {
              col.setData(column, column);
            }
            // this.filter[index] = new TallintTableColumnFilter(column, null, null);
            this.tallint_table_columns.push(col);
          })
        }
      }
      else if (this.grid_layout && this.grid_layout.length) {
        this.tallint_table_columns = [];
        if (typeof this.grid_layout == 'object' && this.grid_layout.length) {
          this.grid_layout.forEach((column, index) => {
            let col = new TallintTableColumn();
            col.setDataObj(column);
            this.tallint_table_columns.push(col);
          });
        }
        else {
          this.grid_layout = jsonParse(this.grid_layout);
          this.grid_layout.forEach((column, index) => {
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
    console.log(this.tallint_table_columns)
  }

  triggerCellClick(func_name, row, col?) {
    if (func_name && func_name != '') {
      this.cellClick(func_name, row, col)
    }
  }


  cellClick(func, data, column?) {
    this.cellClicked.emit({ func: func, data: data, col_details: column });
  }
}
