import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TypeaheadComponent } from './components/typeahead.component';
import { TypeaheadInputDirective } from './components/typeahead-input.directive';
import { TypeaheadOptionComponent } from './components/typeahead-option.component';
import { HttpModule } from '@angular/http';
import { GithubApiService } from './shared/github-api.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    TypeaheadComponent,
    TypeaheadInputDirective,
    TypeaheadOptionComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpModule
  ],
  providers: [GithubApiService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
