import axios from "axios";
import { loginRequestInterface, signUpRequestInterface } from "types/user";

export const loginFetcher = ({ url, email, password }: loginRequestInterface) =>
  axios.post(url, { email, password }).then((res) => res.data);

export const signUpFetcher = ({
  url,
  email,
  password,
  username,
}: signUpRequestInterface) =>
  axios.post(url, { email, password, username }).then((res) => res.data);
