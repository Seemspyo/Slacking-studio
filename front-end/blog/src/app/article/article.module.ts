/** Native Modules */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/** Custom Modules */
import { ArticleRoutingModule } from './article-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EditorModule } from '@tinymce/tinymce-angular';
import { InputModule } from '../modules/input/input.module';
import { ButtonModule } from '../modules/button/button.module';
import { SafeContentModule } from '../modules/safe-content/safe-content.module';
import { StickyBarModule } from '../services/util/sticky-bar.service';

/** Components */
import { ArticleComponent } from './article.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleWriteComponent } from './article-write/article-write.component';
import { ArticleViewComponent } from './article-view/article-view.component';
import { ArticleHeaderComponent } from './article-header/article-header.component';
import { ArticleNavigationComponent } from './article-navigation/article-navigation.component';
import { ArticleCommentComponent } from './article-comment/article-comment.component';


@NgModule({
  declarations: [
    ArticleComponent,
    ArticleListComponent,
    ArticleWriteComponent,
    ArticleViewComponent,
    ArticleHeaderComponent,
    ArticleNavigationComponent,
    ArticleCommentComponent
  ],
  imports: [
    CommonModule,
    ArticleRoutingModule,
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    InputModule,
    ButtonModule,
    EditorModule,
    SafeContentModule,
    StickyBarModule
  ]
})
export class ArticleModule { }
