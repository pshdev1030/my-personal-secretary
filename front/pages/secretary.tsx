import AppLayout from "@components/AppLayout";
import Secretary from "@components/Secretary";
import axios from "axios";
import { secretaryFetcher } from "fetcher/secretary";
import { loginFetcher } from "fetcher/user";
import type { NextPage } from "next";
import { useCallback } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import { UserType } from "types/user";

const SecretaryPage: NextPage = () => {
  const { data: user } = useSWR<UserType>(
    "http://localhost:8000/user/login",
    loginFetcher
  );

  const { data: token } = useSWR(
    user
      ? [
          `/api/odin/generateClientToken`,
          user.appId,
          user.userKey,
          "/api/odin/generateToken",
        ]
      : null,
    secretaryFetcher
  );

  const onSubmit = useCallback(
    async (data) => {
      if (!user) {
        return;
      }
      if (data.eventDate.length < 2) {
        toast.error("모든 값을 입력하세요");
        return;
      }
      const start = data.eventDate[0]._d.valueOf();
      const end = data.eventDate[1]._d.valueOf();
      console.log(start, end);
      const modifyEventRequest = await axios.get(
        `http://localhost:8000/schedule/period?start=${start}&end=${end}`,
        {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      );
      console.log(modifyEventRequest);
    },
    [user === null]
  );

  return (
    <>
      <AppLayout>
        <Secretary onSubmit={onSubmit} />
      </AppLayout>
    </>
  );
};

export default SecretaryPage;
