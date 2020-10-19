import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.css']
})
export class TextareaComponent implements OnInit, OnChanges {

  @Input() placeholder;
  @Input() type;
  @Input() value;
  @Input() id;
  @Input() style;
  @Input() class;
  @Input() label;
  @Input() hint;
  @Input() control_type;
  @Input() required;
  @Input() error_msg;
  @Input() form: FormGroup;
  @Input() controlName;
  @Input() label_block;
  @Input() context_menu_listner;
  @Input() on_change_listner;
  @Input() font_size;
  @Input() disabled;

  @Output() getValue = new EventEmitter();
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: false,
    height: 'auto',
    minHeight: 'auto',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'no',
    enableToolbar: true,
    showToolbar: false,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['fontName',
        'insertImage',
        'insertVideo',]
    ]
  };
  constructor() { }

  ngOnInit() {
    this.editorConfig.placeholder = this.placeholder || 'Enter text here';
    this.editorConfig.defaultFontSize = ''

  }

  ngOnChanges(ev) {

  }

  clickListner(ev: Event) {
    if (this.context_menu_listner) {
      ev.preventDefault();
      this.context_menu_listner(ev);
    }
    console.log(ev)
  }
  onChangeListner(ev) {
    if (this.on_change_listner) {
      this.on_change_listner(ev);
    }
  }

  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.getEditableElement(),
      editor.ui.getEditableElement(),

    );
  }
}
