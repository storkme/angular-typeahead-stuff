import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AsyncErrorPipe } from './components/async-error.pipe';
import { TestAsyncErrorComponent } from './components/test-async-error.component';
import { TypeaheadInputDirective } from './components/typeahead-input.directive';
import { TypeaheadOptionComponent } from './components/typeahead-option.component';
import { TypeaheadComponent } from './components/typeahead.component';

@NgModule({
  declarations: [
    AppComponent,
    TypeaheadComponent,
    TypeaheadInputDirective,
    TypeaheadOptionComponent,
    TestAsyncErrorComponent,
    AsyncErrorPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
