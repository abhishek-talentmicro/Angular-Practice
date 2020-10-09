import { Component, Input, OnInit, Output ,EventEmitter } from '@angular/core';
import { Recipe } from '../../recipe.model';

@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent implements OnInit {
  // @Input('recipe-detail') recipe:{ name:string, description:string ,imagePath:string};
  @Input('recipe-detail') recipe:Recipe;
  @Output('recipe-item') selectedRecipe = new EventEmitter<void>();
  constructor() { }

  ngOnInit(): void {
  }
  recipeItem(){
    this.selectedRecipe.emit();
  }

}
