import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GithubCommit } from '../lib/commit';
import { Http } from '@angular/http';
@Injectable()
export class GithubApiService {

  constructor(private http: Http) {
  }

  commits(owner: string, repo: string): Observable<GithubCommit[]> {
    return this.http.get(`https://api.github.com/repos/${owner}/${repo}/commits`)
      .map((response) => response.json());
  }
}
