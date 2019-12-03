/** Native Modules */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Components */
import { ArticleComponent } from './article.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { ArticleWriteComponent } from './article-write/article-write.component';
import { ArticleViewComponent } from './article-view/article-view.component';

/** Guards */
import { MasterGuard } from '../guards/master.guard';


const routes: Routes = [
  { path: '', component: ArticleComponent, children: [

    { path: '', component: ArticleListComponent },

    { path: 'write', component: ArticleWriteComponent, canActivate: [ MasterGuard ] },
    { path: 'write/:title', component: ArticleWriteComponent, canActivate: [ MasterGuard ] },

    { path: ':category', component: ArticleListComponent },
    { path: ':category/:title', component: ArticleViewComponent }

  ] }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule { }
