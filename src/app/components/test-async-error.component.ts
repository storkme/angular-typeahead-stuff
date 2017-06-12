import { Subject } from 'rxjs/Subject';
import { Component, OnInit } from '@angular/core';

@Component({
  template: `
    <button type="button" (click)="next()">emit</button>
    <button type="button" (click)="error()">error</button>
    <button type="button" (click)="subject$.complete()">complete</button>
    <button type="button" (click)="resetSubject()">reset</button>
    <pre>{{(subject$ | async) | json}}</pre>
  `,
  styles: [`pre {
    background: lightgreen;
    padding: 10px;
  }`],
  selector: 'app-test-async-error'
})
export class TestAsyncErrorComponent implements OnInit {
  subject$: Subject<any>;
  array: any[] = [];

  ngOnInit(): void {
    this.resetSubject();
  }

  resetSubject() {
    this.subject$ = new Subject<any>();
  }

  next() {
    this.array = [...this.array, {msg: 'hilol'}];
    this.subject$.next(this.array);
  }

  error() {
    this.subject$.error(new Error('terror'));
  }
}
