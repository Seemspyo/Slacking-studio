/** Native Modules */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/** Components */
import { PageNotFoundComponent } from './page-not-found.component';

/** Custom Modules */
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    PageNotFoundComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule
  ],
  exports: [
    PageNotFoundComponent
  ]
})
export class PageNotFoundModule { }
