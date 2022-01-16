import AppLayout from "@components/AppLayout";
import SignUpForm from "@components/SignUpForm";
import Router from "next/router";
import useSWR from "swr";
import type { NextPage } from "next";
import { loginFetcher } from "fetcher/user";

const SignUpPage: NextPage = () => {
  const { data: user } = useSWR(
    "http://localhost:8000/user/login",
    loginFetcher
  );

  if (user) {
    Router.push("/");
  }

  return (
    <div>
      <AppLayout>
        <SignUpForm />
      </AppLayout>
    </div>
  );
};

export default SignUpPage;
