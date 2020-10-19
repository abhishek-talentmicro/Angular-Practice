import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-file-viewer',
  templateUrl: './file-viewer.component.html',
  styleUrls: ['./file-viewer.component.scss']
})
export class FileViewerComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<FileViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public data

  ) { }

  @Input() all_files;
  @Input() file;
  @Input() index;
  negative_index;
  index_outof_bound;
  reset_embed_tag = true;
  reset_object_tag = true;


  ngOnInit() {
    this.all_files = this.previewCheck(this.all_files)
  }
  previousFile() {
    this.reset_embed_tag = false;
    this.reset_object_tag = false;
    if (this.index == 0) {
      this.index_outof_bound = false;
    }
    else {
      this.index--;
    }
    setTimeout(() => {
      this.reset_embed_tag = true;
      this.reset_object_tag = true;
    })
  }

  nextFile() {
    this.reset_embed_tag = false;
    this.reset_object_tag = false;
    if (this.index == this.all_files.length - 1) {
      this.index_outof_bound = true;
      this.index = this.all_files.length - 1;
    }

    else {
      this.index++;
      this.index_outof_bound = false;
    }

    setTimeout(() => {
      this.reset_embed_tag = true;
      this.reset_object_tag = true;
    })

  }
  close() {
    this.dialogRef.close();
  }

  previewCheck(file_arr) {
    let file_ext = ['jpeg', 'jpg', 'png','pdf']
    for (let index = 0; index < file_arr.length; index++) {
      let file = file_arr[index];
      if (file_ext.includes( (file.file_title).split('.').pop())) {
        file['is_preview'] = 1;
      }
    }
    return file_arr;
  }
}
