import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GithubCommit } from './lib/commit';
import { GithubApiService } from './shared/github-api.service';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/combineLatest';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  form: FormGroup;
  formMd: FormGroup;
  options: Observable<GithubCommit[]>;
  filteredOptions: Observable<GithubCommit[]>;
  filteredOptionsMd: Observable<GithubCommit[]>;

  constructor(private service: GithubApiService,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      commit: ['', Validators.required, lol]
    });

    this.formMd = this.fb.group({
      commit: ['', Validators.required, lol]
    });

    this.options = this.service.commits('storkme', 'lightshow-web')
      .first()
      .publishReplay()
      .refCount();

    this.filteredOptionsMd = Observable.combineLatest(
      this.formMd.controls.commit.valueChanges.startWith(null),
      this.options
    )
      .map(([val, options]) => val ? this.filter(val, options) : options.slice());

    this.filteredOptions = Observable.combineLatest(
      this.form.controls.commit.valueChanges.startWith(null),
      this.options
    )
      .map(([val, options]) => val ? this.filter(val, options) : options.slice());
  }

  onSubmit() {
    console.log(this.form.value);
  }

  displayFn(o) {
    return o && o.commit.message;
  }

  private filter(value: string, options) {
    return options.filter(
      (option) => option.commit.message.includes(value)
    );
  }
}

function lol(f) {
  console.log(f.value);
  return Promise.resolve(typeof f.value === 'object' ? null : {nomatch: {valid: false}});
}
