// 회원가입 폼의 타입
export interface SignUpFormRequestType {
  signUpEmail: string;
  signUpPassword: string;
  username: string;
}

// 로그인 폼의 타입

export interface LogInFormRequestType {
  logInEmail: string;
  logInPassword: string;
}

// 사용자의 정보 타입

export interface UserType {
  email: string;
  username: string;
  accessToken: string;
  appId: string;
  userKey: string;
}

// 로그인 요청시 타입

export interface loginRequestInterface {
  url: string;
  email: string;
  password: string;
}

// 회원가입 요청시 타입

export interface signUpRequestInterface {
  url: string;
  email: string;
  username: string;
  password: string;
}
