import AppLayout from "@components/AppLayout";
import Secretary from "@components/Secretary";
import axios from "axios";
import { dbUrl } from "constant/api";
import { secretaryFetcher, secretaryLocalFetcher } from "fetcher/secretary";
import { loginFetcher } from "fetcher/user";
import moment from "moment";
import type { NextPage } from "next";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import { EventType } from "types/event";
import { UserType } from "types/user";

const SecretaryPage: NextPage = () => {
  const { data: user } = useSWR<UserType>(`${dbUrl}/user/login`, loginFetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const timerRef = useRef();

  const { data: token } = useSWR(
    user
      ? [
          `/api/odin/generateClientToken`,
          user.appId,
          user.userKey,
          "/api/odin/generateToken",
        ]
      : null,
    secretaryFetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const { data: localData, mutate: localMutate } = useSWR(
    user ? "SecretaryLocalData" : null,
    secretaryLocalFetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const onSubmit = useCallback(
    async (data) => {
      try {
        if (!user || !token) {
          toast.error(
            "유저정보가 없거나 토큰의 유효기간이 만료되었습니다. 잠시 후 다시 시도해주세요"
          );
          return;
        }
        if (data.eventDate.length < 2) {
          toast.error("모든 값을 입력하세요");
          return;
        }
        const start = data.eventDate[0]._d.valueOf();
        const end = data.eventDate[1]._d.valueOf();
        const modifyEventRequest = await axios
          .get(`${dbUrl}/schedule/period?start=${start}&end=${end}`, {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          })
          .then((res) => res.data);

        const templateArr = modifyEventRequest.map((ele: EventType) => {
          if (ele.start === ele.end) {
            const eventDate = moment(ele.date).format(
              "YYYY년 MM월 DD일 dd요일 HH시mm분"
            );
            return `${eventDate}에는 ${ele.title}일정이 있습니다. `;
          }
          const eventStart = moment(ele.start).format(
            "YYYY년 MM월 DD일 dd요일 HH시mm분"
          );
          const eventEnd = moment(ele.start).format(
            "YYYY년 MM월 DD일 dd요일 HH시mm분"
          );
          return `${eventStart}부터 ${eventEnd}까지는 ${ele.title} 일정이 있습니다.`;
        });

        templateArr.unshift(`안녕하세요 ${user.username}님 AI비서입니다.`);
        templateArr.push(`오늘도 좋은 하루 되세요`);
        const template = templateArr.join("\n");

        const video = await axios
          .post("/api/odin/makeVideo", {
            appId: user.appId,
            clientHostname: user.appId,
            clothes: "2",
            isClientToken: true,
            language: "ko",
            model: "ysy",
            platform: "web",
            sdk_v: "1.0",
            text: template,
            token: token.token,
            uuid: user.userKey,
          })
          .then((res) => res.data);

        localMutate(
          {
            ...localData,
            videoLoading: true,
            progress: 0,
            videoKey: video.data.key,
            videoDone: false,
            videoError: false,
            videoURL: null,
          },
          false
        );
      } catch (error) {
        toast.error("문제가 발생하였습니다.");
        localMutate(
          {
            ...localData,
            videoLoading: false,
            progress: 0,
            videoKey: null,
            videoDone: false,
            videoError: true,
            videoURL: null,
          },
          false
        );
        console.error(error);
      }
    },
    [user === null, token]
  );

  const getProcess = useCallback(async () => {
    try {
      if (!user || !token || !localData?.videoKey) {
        toast.error(
          "유저정보가 없거나 토큰의 유효기간이 만료되었습니다. 잠시 후 다시 시도해주세요"
        );
        return;
      }
      const data = await axios
        .post("/api/odin/findProject", {
          appId: user.appId,
          platform: "web",
          isClientToken: true,
          token: token.token,
          uuid: user.userKey,
          sdk_v: "1.0",
          clientHostname: user.appId,
          key: localData.videoKey,
        })
        .then((res) => res.data);

      if (data.data.progress !== 100) {
        localMutate(
          {
            ...localData,
            progress: data.data.progress,
          },
          false
        );
      } else if (data.data.progress === 100) {
        localMutate(
          {
            ...localData,
            videoLoading: false,
            progress: 100,
            videoKey: null,
            videoDone: true,
            videoError: false,
            videoURL: data.data.video,
          },
          false
        );
      }
    } catch (error) {
      console.error(error);
    }
  }, [user === null, token, localData, localData?.videoKey !== null]);

  useEffect(() => {
    try {
      if (
        !user ||
        !token ||
        !localData ||
        !localData?.videoKey ||
        localData?.videoDone ||
        localData?.progress === 100
      ) {
        return;
      }
      let timerId: NodeJS.Timer;
      const callback = async () => {
        const data = await axios
          .post("/api/odin/findProject", {
            appId: user.appId,
            platform: "web",
            isClientToken: true,
            token: token.token,
            uuid: user.userKey,
            sdk_v: "1.0",
            clientHostname: user.appId,
            key: localData.videoKey,
          })
          .then((res) => res.data);

        if (data.data.progress !== 100) {
          localMutate(
            {
              ...localData,
              progress: data.data.progress,
            },
            false
          );
        } else if (data.data.progress === 100) {
          clearInterval(timerId);
          localMutate(
            {
              ...localData,
              videoLoading: false,
              progress: 100,
              videoKey: null,
              videoDone: true,
              videoError: false,
              videoURL: data.data.video,
            },
            false
          );
        }
      };

      timerId = setInterval(callback, 6000);

      return () => clearInterval(timerId);
    } catch (error) {
      console.log(error);
    }
  }, [user === null, localData?.videoLoading]);

  return (
    <>
      <AppLayout>
        {token && user ? (
          <Secretary
            localData={localData}
            onSubmit={onSubmit}
            token={token}
            user={user}
          />
        ) : (
          <div>사용자 정보를 받아오는 중..</div>
        )}
      </AppLayout>
    </>
  );
};

export default SecretaryPage;
