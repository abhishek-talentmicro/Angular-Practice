import { Component, ElementRef, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { Ingridient } from 'src/app/shared/ingridient.model';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {
  @ViewChild('shoppingItemName',{static:true}) nameData:ElementRef;
  @ViewChild('amountData',{static:true}) amountData:ElementRef;
  @Output() addIngridients =new EventEmitter<Ingridient>();

  constructor() { }

  ngOnInit(): void {
  }
  addItemAndAmount(){
    const itemName=this.nameData.nativeElement.value;
    const itemAmount=this.amountData.nativeElement.value;
    const newIngredients= new Ingridient(itemName,itemAmount);
    this.addIngridients.emit(newIngredients);
  }

}
