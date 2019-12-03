/** Native Modules */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Components */
import { MainComponent } from './main/main.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RedirectComponent } from './redirect/redirect.component';


const routes: Routes = [
  { path: '', component: MainComponent, data: { id: 'gate' } },
  { path: 'blog', component: RedirectComponent, data: { id: 'blog' }, children: [
    { path: '**', component: RedirectComponent, data: { id: 'blog' } }
  ] },
  { path: 'playground', component: RedirectComponent, data: { id: 'playground' }, children: [
    { path: '**', component: RedirectComponent, data: { id: 'playground' } }
  ] },

  { path: '**', component: PageNotFoundComponent }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
