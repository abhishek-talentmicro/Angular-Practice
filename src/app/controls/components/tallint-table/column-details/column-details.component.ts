import { GetMastersService } from './../../../services/get-master/get-masters.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { moveItemInArray, CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { cloneArray } from 'src/app/functions/functions';

@Component({
  selector: 'app-column-details',
  templateUrl: './column-details.component.html',
  styleUrls: ['./column-details.component.scss'],
  providers: [
    GetMastersService
  ]
})
export class ColumnDetailsComponent implements OnInit {

  backup_cols = [];
  visible_cols = [];
  filter_template_list = [];
  table_code;
  sequence;

  hidden_cols = [];
  constructor(
    private dialog_ref: MatDialogRef<ColumnDetailsComponent>,
    private master_srv: GetMastersService,
    @Inject(MAT_DIALOG_DATA) public tallint_table_column
  ) { }

  ngOnInit() {
    this.hidden_cols = [];
    this.visible_cols = [];
    if (this.tallint_table_column) {
      this.backup_cols = cloneArray(this.tallint_table_column['cols']);
      // this.visible_cols = cloneArray(this.tallint_table_column['cols']);
      if (this.tallint_table_column['table_code']) {
        this.table_code = this.tallint_table_column['table_code'];
      }
      this.filter_template_list = this.tallint_table_column['filter_temp_list'] || [];
    }
    if (this.backup_cols) {
      for (let i = 0; i < this.backup_cols.length; i++) {
        let ele = this.backup_cols[i];
        if (!ele.visible) {
          this.hidden_cols.push(ele)
        }
        else {
          this.visible_cols.push(ele)
        }
      }
    }

    this.visible_cols = this.setSequence(this.visible_cols,'sequence')
  }

  close() {
    this.dialog_ref.close(false);
  }
  setVisible(item) {
    if (item) {
      item['visible'] = 1;
    }
  }
  removeVisible(item) {
    if (item) {
      item['visible'] = 0;
    }
  }
  saveColumnDetails() {
    this.backup_cols = [];
    this.backup_cols.push(...this.hidden_cols, ...this.visible_cols)
    this.backup_cols.forEach(col => {
      if (col['visible'] === true) {
        col['visible'] = 1;
      }
      if (col['visible'] === false) {
        col['visible'] = 0;
      }
    })
    this.master_srv.saveGridCols({
      table_code: this.table_code,
      'grid_columns': this.backup_cols
    }).subscribe(res => {

      if (res && res['status']) {
        this.dialog_ref.close(this.backup_cols);
      }

    })
  }

  dropToVisible(event) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.visible_cols = this.setSequence(this.visible_cols,'sequence')
    }
    else {
      event.previousContainer.data[event.previousIndex].visible = true;
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
        this.visible_cols = this.setSequence(this.visible_cols,'sequence')
    }
  }

  dropToHide(event) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.visible_cols = this.setSequence(this.visible_cols,'sequence')
    }
    else {
      event.previousContainer.data[event.previousIndex].visible = false;
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
        this.visible_cols = this.setSequence(this.visible_cols,'sequence')
    }
  }

  setSequence(array, key) {
    array.forEach((ele, i) => {
      ele[key] = i + 1;
    })

    return array;
  }
}
