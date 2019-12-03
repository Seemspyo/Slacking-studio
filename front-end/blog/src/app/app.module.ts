/** Native Modules */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/** Custom Modules */
import { AppRoutingModule } from './app-routing.module';
import { PageNotFoundModule } from './page-not-found/page-not-found.module';

/** Components */
import { AppComponent } from './app.component';
import { StickyBarComponent, StickyBarModule } from './services/util/sticky-bar.service';

/** Services */
import { HeaderInjectService } from './services/ajax/header-inject.service';
import { AuthService } from './services/ajax/auth.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PageNotFoundModule,
    HttpClientModule,
    BrowserAnimationsModule,
    StickyBarModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeaderInjectService,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (auth: AuthService) => (() => auth.initialAuth()),
      deps: [AuthService],
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    StickyBarComponent
  ]
})
export class AppModule { }
