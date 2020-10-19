import { TallintTableColumn } from 'src/app/controls/components/tallint-table/tallint-table.component';
import { cloneArray, jsonParse } from 'src/app/functions/functions';

export class ApplicantAttachments {
  attachments;
  notes: string;

  setData(obj = {
    attachments: null,
    notes: null

  }) {
    this.attachments = obj.attachments || null;
    this.notes = obj.notes || null;
  }

  getData() {
    return {
      attachments: this.attachments,
      notes: this.notes
    }
  }
}


export class Questionaries {
  stage_code;
  status_code;
  reason_ids;
  notes;
  questionaries;

  setStageStatus(obj) {
    this.reason_ids = [];
    this.stage_code = obj.stage_code;
    this.status_code = obj.status_code;
    this.notes = obj.notes;
    if (obj.reason_ids) {
      this.reason_ids.push(obj.reason_ids);
    }

  }

  setQuestionaries(obj) {
    this.questionaries = obj;
  }

  getQuestionaries() {
    return {
      stage_code: this.stage_code || 0,
      status_code: this.status_code || 0,
      notes: this.notes || '',
      reason_ids: this.reason_ids || [],
      questionaries: this.questionaries
    }
  }
}


export function setExportKeys(report, grid) {

  report  = cloneArray(report);
  grid = jsonParse(grid);
  let tallint_table_columns = [];
  if (!(grid && grid.length)) {
    let columns = Object.keys(report[0]);
    if (columns && columns.length) {

      columns.forEach((column, index) => {
        let col = new TallintTableColumn();

        try {
          if (isNaN(report[0][column])) {
            new Date(report[0][column]).toISOString();
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
        tallint_table_columns.push(col);
      })
    }
  }
  else if (grid && grid.length) {
    tallint_table_columns = [];
    if (typeof grid == 'object' && grid.length) {
      grid.forEach((column, index) => {
        // this.filter[index] = new TallintTableColumnFilter(column.property, null, null);
        let col = new TallintTableColumn();
        col.setDataObj(column);
        tallint_table_columns.push(col);
      });
    }
    else {
      grid = jsonParse(grid);
      grid.forEach((column, index) => {
        // this.filter[index] = new TallintTableColumnFilter(column.property, null, null);
        let col = new TallintTableColumn();
        col.setDataObj(column);
        tallint_table_columns.push(col);
      });
    }
  }
  let exp_data = [];
  let rows = {};
  report.forEach(row => {
    tallint_table_columns.forEach(col => {
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

  return exp_data || report
}