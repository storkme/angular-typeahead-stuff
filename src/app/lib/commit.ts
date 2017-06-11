export interface GithubCommit extends GithubCommitRef {
  author: Identifier,
  committer: Identifier,
  parents: GithubCommitRef[];
  commit: {
    message: string,
  }
}

export interface Identifier {
  name: string,
  email: string,
  date: string
}

export interface GithubCommitRef {
  sha: string;
  url: string;
  html_url: string;
}
