/** Native Modules */
import { NgModule } from '@angular/core';

/** Pipes */
import { NumberSymbolPipe } from './number-symbol.pipe';



@NgModule({
  declarations: [NumberSymbolPipe],
  exports: [NumberSymbolPipe]
})
export class NumberSymbolModule { }
