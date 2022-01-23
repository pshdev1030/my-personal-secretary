export interface SignUpFormRequestType {
  signUpEmail: string;
  signUpPassword: string;
  username: string;
}

export interface LogInFormRequestType {
  logInEmail: string;
  logInPassword: string;
}

export interface UserType {
  email: string;
  username: string;
}

export interface loginRequestInterface {
  url: string;
  email: string;
  password: string;
}

export interface signUpRequestInterface {
  url: string;
  email: string;
  username: string;
  password: string;
}
