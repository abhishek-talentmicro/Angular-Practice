import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CustomDirective } from './yellow-background/yellow-background.directive';
import { NewYellowBackgroundDirective } from './new-yellow-background/new-yellow-background.directive';
import { NotIfDirective } from './notIf.directive';

@NgModule({
  declarations: [
    AppComponent,
    CustomDirective,
    NewYellowBackgroundDirective,
    NotIfDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
