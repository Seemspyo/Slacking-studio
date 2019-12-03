/** Native Modules */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/** Custom Modules */
import { AppRoutingModule } from './app-routing.module';

/** Components */
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { RedirectComponent } from './redirect/redirect.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

/** Directives */
import { SlideDirective } from './directives/slide.directive';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    PageNotFoundComponent,
    SlideDirective,
    RedirectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
