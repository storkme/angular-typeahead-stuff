import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
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
  countries$: Observable<any[]>;
  filteredCountries$: Observable<any[]>;
  country: FormControl;

  constructor(private http: Http) {
  }

  ngOnInit(): void {
    this.country = new FormControl();

    this.countries$ = this.http.get(`assets/countries.json`)
      .map((response) => response.json())
      .share();

    this.filteredCountries$ = Observable.combineLatest(
      this.country.valueChanges.startWith(null),
      this.countries$
    )
      .map(([val, options]) => val ? this.filter(val, options) : options.slice());
  }

  displayFn(o) {
    return o && o.name;
  }

  private filter(value: string, options) {
    return options.filter(
      (option) => option.name.toLowerCase().includes(value)
    );
  }
}
