export interface Credentials {
  email: String;
  password: String;
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
