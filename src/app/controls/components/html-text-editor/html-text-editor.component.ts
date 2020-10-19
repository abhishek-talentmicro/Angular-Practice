import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
@Component({
  selector: 'app-html-text-editor',
  templateUrl: './html-text-editor.component.html',
  styleUrls: ['./html-text-editor.component.css']
})
export class HTMLTextEditorComponent implements OnInit, OnChanges {

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
  @Input() ngModel;
  @Output() getValue = new EventEmitter();
  asdf;
  @Input() label_block;
  @Input() context_menu_listner;
  @Input() on_change_listner;
  @Input() html_decode;
  @Input() disabled;
  @Output() contextmenu = new EventEmitter()
  @Output() change = new EventEmitter()
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: false,
    height: 'auto',
    minHeight: '250',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'no',
    enableToolbar: true,
    showToolbar: true,
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
  random_id;
  form_group = new FormGroup({
    control_name: new FormControl(null)
  })

  constructor() {
    this.random_id = 'tm_editor' + Math.floor((Math.random() * 10000) + 1) + Date.now();
  }

  ngOnInit() {
    console.log(this.placeholder)
    if (this.form.controls[this.controlName].value) {
      try {
        this.form_group.controls['control_name'].patchValue(decodeURIComponent(this.form.controls[this.controlName].value))
      }
      catch (err) {
        console.log(err)
        this.form_group.controls['control_name'].patchValue(this.form.controls[this.controlName].value)

      }
      // this.form_group.controls['control_name'].patchValue(decodeURIComponent(this.form.controls[this.controlName].value))
    }
    this.editorConfig.placeholder = this.placeholder || 'Enter text here';
    this.form_group.controls['control_name'].valueChanges.subscribe(res => {
      console.log(res)
      let encoded_val;
      try {
        encoded_val = encodeURIComponent(res);
        console.log(encoded_val, decodeURIComponent(encoded_val))
      }
      catch (err) {
        console.log(err)
        encoded_val = (res);

      }
      // console.log(encoded_val, decodeURIComponent(encoded_val));
      this.form.controls[this.controlName].patchValue(encoded_val);
      console.log(this.form.value[this.controlName])
    })
  }

  ngOnChanges(ev) {
    console.log(ev)
    console.log(this.placeholder)
    if (this.placeholder)
      this.editorConfig.placeholder = this.placeholder || 'Enter text here'
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

  }
  clickListner(ev: Event) {
    if (this.context_menu_listner) {
      ev.preventDefault();
      this.context_menu_listner(ev);
      this.contextmenu.emit(ev);
    }
    console.log(ev)
  }
  onChangeListner(ev) {
    console.log(ev, this.form_group.value)
    if (this.on_change_listner) {
      this.on_change_listner(ev);
      this.change.emit(ev);
    }
  }

  //ckeditor  used for  Long Signature
  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }
}
