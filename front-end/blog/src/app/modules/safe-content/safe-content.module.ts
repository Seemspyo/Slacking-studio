/** Native Modules */
import { NgModule } from '@angular/core';

/** Pipes */
import { SafeContentPipe } from './safe-content.pipe';


@NgModule({
  declarations: [SafeContentPipe],
  exports: [SafeContentPipe]
})
export class SafeContentModule { }
