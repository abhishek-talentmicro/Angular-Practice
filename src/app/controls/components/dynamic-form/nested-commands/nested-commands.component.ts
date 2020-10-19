import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { jsonParse } from 'src/app/app.component';

@Component({
  selector: 'app-nested-commands',
  templateUrl: './nested-commands.component.html',
  styleUrls: ['./nested-commands.component.scss']
})
export class NestedCommandsComponent implements OnInit {

  @Input() child_commands;
  @ViewChild('subMenu') public subMenu;
  @Input() section;
  @Input() dynamic_form;
  @Input() parent_functions;
  @Input() evalFunctionRef;
  @Input() t_id;
  @Input() row_data;
  @Input() i;
  @Input() parent_form;

  constructor() { }

  ngOnInit(): void {
    this.child_commands = jsonParse(this.child_commands)
    console.log(this.child_commands)
  }
  evalFunction(section, dynamic_form, click_func_name, parent_form, command, parent_functions) {
    this.evalFunctionRef(section, dynamic_form, click_func_name, parent_form, command, parent_functions)
  }

}
