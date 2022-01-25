import AppLayout from "@components/AppLayout";
import SignUpForm from "@components/SignUpForm";
import useSWR from "swr";
import type { NextPage } from "next";
import { loginFetcher } from "fetcher/user";
import { useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { SignUpFormRequestType, UserType } from "types/user";
import { dbUrl } from "constant/api";
import Router from "next/router";

const SignUpPage: NextPage = () => {
  const { data: user, mutate } = useSWR<UserType>(
    `${dbUrl}/user/login`,
    loginFetcher
  );

  if (user) {
    Router.push("/");
  }

  // 유효성검사와 회원가입을 하는 함수
  const onSubmit = useCallback(async (data: SignUpFormRequestType) => {
    const { signUpEmail: email, signUpPassword: password, username } = data;
    if (
      email.trim().length === 0 ||
      password.trim().length === 0 ||
      username.trim().length === 0
    ) {
      toast.error("모든 값을 입력해주세요");
      return;
    }

    if (email.length > 60 || email.length <= 1) {
      toast.error("이메일은 1 이상 60 이하여야 합니다.");
      return;
    }

    if (username.length > 60 || username.length <= 1) {
      toast.error("유저명은 1 이상 20 이하여야 합니다.");
      return;
    }

    if (password.length > 60 || password.length <= 1) {
      toast.error("비밀번호는 1 이상 30 이하여야 합니다.");
      return;
    }

    const signUpRequest = axios
      .post(`${dbUrl}/user`, {
        email,
        username,
        password,
      })
      .then((r) => mutate(r.data));
    toast.promise(signUpRequest, {
      pending: "회원가입 중입니다.",
      success: "회원가입에 성공하였습니다. 곧 메인페이지로 이동합니다.",
      error: {
        // 서버에서 보내준 메시지가 있을경우 그걸 출력, 없을경우 기본 메시지를 출력
        render({ data }: any) {
          return data.response.data
            ? data.response.data
            : "문제가 발생하였습니다.";
        },
      },
    });
  }, []);

  return (
    <div>
      <AppLayout>
        <SignUpForm onSubmit={onSubmit} />
      </AppLayout>
    </div>
  );
};

export default SignUpPage;
