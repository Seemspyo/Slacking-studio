/** Native Modules */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';

/** Custom Modules */
import { AdministratorRoutingModule } from './administrator-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PageNotFoundModule } from '../page-not-found/page-not-found.module';
import { InputModule } from '../modules/input/input.module';
import { NumberSymbolModule } from '../modules/number-symbol/number-symbol.module';

/** Components */
import { AdministratorComponent } from './administrator.component';
import { AdministratorArticleComponent } from './administrator-article/administrator-article.component';
import { AdministratorCommentComponent } from './administrator-comment/administrator-comment.component';
import { AdministratorUserComponent } from './administrator-user/administrator-user.component';
import { AdministratorNavigationComponent } from './administrator-navigation/administrator-navigation.component';
import { AdministratorHeaderComponent } from './administrator-header/administrator-header.component';
import { AdministratorDashboardComponent } from './administrator-dashboard/administrator-dashboard.component';


@NgModule({
  declarations: [
    AdministratorComponent,
    AdministratorArticleComponent,
    AdministratorCommentComponent,
    AdministratorUserComponent,
    AdministratorNavigationComponent,
    AdministratorHeaderComponent,
    AdministratorDashboardComponent
  ],
  imports: [
    CommonModule,
    AdministratorRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    PageNotFoundModule,
    MatRippleModule,
    MatDialogModule,
    InputModule,
    NumberSymbolModule
  ]
})
export class AdministratorModule { }
