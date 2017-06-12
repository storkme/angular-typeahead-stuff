import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GithubCommit } from './lib/commit';
import { GithubApiService } from './shared/github-api.service';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/combineLatest';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const INITIAL_REPO = 'angular-typeahead-stuff';
const INITIAL_OWNER = 'storkme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  form: FormGroup;
  options: Observable<GithubCommit[]>;
  filteredOptions: Observable<GithubCommit[]>;
  // formMd: FormGroup;
  // filteredOptionsMd: Observable<GithubCommit[]>;

  constructor(private service: GithubApiService,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      commit: ['', Validators.required],
      owner: [INITIAL_OWNER, Validators.required],
      repo: [INITIAL_REPO, Validators.required],
    });

    this.options = Observable.combineLatest(
      this.form.controls.owner.valueChanges
        .startWith(INITIAL_OWNER),
      this.form.controls.repo.valueChanges
        .startWith(INITIAL_REPO)
    )
      .debounceTime(500)
      .switchMap(([owner, repo]) => this.service.commits('storkme', 'lightshow-web'))
      .share();

    this.filteredOptions = Observable.combineLatest(
      this.form.controls.commit.valueChanges.startWith(null),
      this.options
    )
      .map(([val, options]) => val ? this.filter(val, options) : options.slice());

    // this.formMd = this.fb.group({
    //   commit: ['', Validators.required]
    // });

    // this.filteredOptionsMd = Observable.combineLatest(
    //   this.formMd.controls.commit.valueChanges.startWith(null),
    //   this.options
    // )
    //   .map(([val, options]) => val ? this.filter(val, options) : options.slice());
  }

  onSubmit() {
    console.log(this.form.value);
  }

  displayFn(o) {
    return o && o.message;
  }

  private filter(value: string, options) {
    return options.filter(
      (option) => option.commit.message.includes(value)
    );
  }
}
