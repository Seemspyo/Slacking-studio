/** Native Modules */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/** Custom Modules */
import { AccountRoutingModule } from './account-routing.module';
import { PageNotFoundModule } from '../page-not-found/page-not-found.module';
import { InputModule } from '../modules/input/input.module';
import { ButtonModule } from '../modules/button/button.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StickyBarModule } from '../services/util/sticky-bar.service';

/** Components */
import { AccountComponent } from './account.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { VerifyComponent } from './verify/verify.component';


@NgModule({
  declarations: [
    AccountComponent,
    SignInComponent,
    SignUpComponent,
    MyAccountComponent,
    VerifyComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    PageNotFoundModule,
    InputModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    StickyBarModule
  ]
})
export class AccountModule { }
