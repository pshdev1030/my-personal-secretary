import AppLayout from "@components/AppLayout";
import Secretary from "@components/Secretary";
import { loginFetcher } from "fetcher/user";
import type { NextPage } from "next";
import useSWR from "swr";
import { UserType } from "types/user";

const SecretaryPage: NextPage = () => {
  const { data: user, mutate } = useSWR<UserType>(
    "http://localhost:8000/user/login",
    loginFetcher
  );
  return (
    <>
      <AppLayout>
        <Secretary />
      </AppLayout>
    </>
  );
};

export default SecretaryPage;
