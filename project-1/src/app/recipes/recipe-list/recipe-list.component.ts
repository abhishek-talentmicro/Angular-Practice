import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [
    new Recipe('Samosa', 'Indian Dish','https://www.samosa-recipe.com/wp-content/uploads/2018/05/chicken-samosa-600x400.jpg'),
    new Recipe('Dosa', 'South Indian Dish','https://www.recipeselected.com/wp-content/uploads/2019/03/Recipes-Selected-Indian-Dosa.jpg')
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
