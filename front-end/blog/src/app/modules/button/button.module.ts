/** Native Modules */
import { NgModule } from '@angular/core';

/** Directives */
import { ButtonDirective } from './button.directive';


@NgModule({
  declarations: [
    ButtonDirective
  ],
  exports: [
    ButtonDirective
  ]
})
export class ButtonModule { }
