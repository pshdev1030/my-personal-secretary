export interface SignUpRequestType {
  signUpEmail: string;
  signUpPassword: string;
  username: string;
}

export interface LogInRequestType {
  logInEmail: string;
  logInPassword: string;
}

export interface UserType {
  email: string;
  username: string;
}
