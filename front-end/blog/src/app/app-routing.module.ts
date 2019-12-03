/** Native Modules */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Components */
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

/** Guards */
import { MasterGuard } from './guards/master.guard';


const routes: Routes = [
  { path: 'account', loadChildren: () => import('./account/account.module').then(module => module.AccountModule) },
  { path: 'masters', loadChildren: () => import('./administrator/administrator.module').then(module => module.AdministratorModule), canLoad: [ MasterGuard ] },

  { path: '404', component: PageNotFoundComponent },
  { path: '', loadChildren: () => import('./article/article.module').then(module => module.ArticleModule) },

  { path: '**', component: PageNotFoundComponent }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
