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
import { FormControl } from '@angular/forms';
import { Http } from '@angular/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  options: Observable<GithubCommit[]>;
  filteredOptions: Observable<GithubCommit[]>;
  commit: FormControl;

  constructor(private http: Http) {
  }

  ngOnInit(): void {
    this.commit = new FormControl();

    this.options = this.http.get(`https://api.github.com/repos/storkme/angular-typeahead-stuff/commits`)
      .map((response) => response.json())
      .share();

    this.filteredOptions = Observable.combineLatest(
      this.commit.valueChanges.startWith(null),
      this.options
    )
      .map(([val, options]) => val ? this.filter(val, options) : options.slice());
  }

  displayFn(o) {
    return o && o.commit.message;
  }

  private filter(value: string, options) {
    return options.filter(
      (option) => option.commit.message.includes(value)
    );
  }

  shortSha(sha: string) {
    return sha.substring(0, 8);
  }
}
