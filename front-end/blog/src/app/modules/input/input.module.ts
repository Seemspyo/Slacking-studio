/** Native Modules */
import { NgModule } from '@angular/core';

/** Directives */
import { InputDirective } from './input.directive';
import { FileInputDirective } from './file-input.directive';


@NgModule({
  declarations: [
    InputDirective,
    FileInputDirective
  ],
  exports: [
    InputDirective,
    FileInputDirective
  ]
})
export class InputModule { }
