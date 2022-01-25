import axios from "axios";
import { loginRequestInterface } from "types/user";

//로그인 시 사용할 fetcher

export const loginFetcher = ({ url, email, password }: loginRequestInterface) =>
  axios.post(url, { email, password }).then((res) => res.data);
