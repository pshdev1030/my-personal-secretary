import axios, { AxiosResponse, ResponseType } from "axios";

interface loginRequestInterface {
  url: string;
  email: string;
  password: string;
}

export const loginFetcher = ({ url, email, password }: loginRequestInterface) =>
  axios.post(url, { email, password }).then((res) => res.data);

interface signUpRequestInterface {
  url: string;
  email: string;
  username: string;
  password: string;
}

export const signUpFetcher = ({
  url,
  email,
  password,
  username,
}: signUpRequestInterface) =>
  axios.post(url, { email, password, username }).then((res) => res.data);
