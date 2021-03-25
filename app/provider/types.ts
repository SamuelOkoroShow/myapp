export interface Credentials {
  email: String;
  password: String;
}

export interface AppState {
  signedIn: Boolean;
  bookmarks: Graph[];
  searchResults: Graph[];
  setBookmarks: (value: Graph[]) => void;
  setSearchResults: (value: Graph[]) => void;
  validateSignIn: (cred: Credentials) => boolean;
}

export interface Error {
  active: Boolean;
  msg: String;
}

export interface Graph {
  id: number;
  stargazers_count: number;
  owner: {
    login: string;
  };
  name: String;
  html_url: string;
}
export interface SwipeList {
  item: Graph;
}
export interface SwipeAbleMap {
  [x: string]: {closeRow: () => void};
}
