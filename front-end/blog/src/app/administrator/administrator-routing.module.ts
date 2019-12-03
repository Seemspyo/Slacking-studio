/** Native Modules */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Components */
import { AdministratorComponent } from './administrator.component';
import { AdministratorDashboardComponent } from './administrator-dashboard/administrator-dashboard.component';
import { AdministratorUserComponent } from './administrator-user/administrator-user.component';
import { AdministratorArticleComponent } from './administrator-article/administrator-article.component';
import { AdministratorCommentComponent } from './administrator-comment/administrator-comment.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';

/** Guards */
import { SuperGuard } from '../guards/super.guard';


const routes: Routes = [
  { path: '', component: AdministratorComponent, children: [
    { path: '', component: AdministratorDashboardComponent },
    { path: 'users', component: AdministratorUserComponent, canActivate: [ SuperGuard ] },
    { path: 'articles', component: AdministratorArticleComponent },
    { path: 'comments', component: AdministratorCommentComponent }
  ] },

  { path: '**', component: PageNotFoundComponent }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministratorRoutingModule { }
