/** Native Modules */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Components */
import { AccountComponent } from './account.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { VerifyComponent } from './verify/verify.component';

/** Guards */
import { UserGuard } from '../guards/user.guard';


const routes: Routes = [
  { path: '', component: AccountComponent, children: [
    { path: 'sign-in', component: SignInComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: 'my-account', component: MyAccountComponent, canActivate: [ UserGuard ] },
    { path: 'verify', component: VerifyComponent }
  ] },

  { path: '**', component: PageNotFoundComponent }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
