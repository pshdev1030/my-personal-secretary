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
  // 유저정보와 토큰을 저장
  const { data: user } = useSWR<UserType>(`${dbUrl}/user/login`, loginFetcher);

  const { data: token } = useSWR(
    user?.appId && user?.userKey
      ? [
          `/api/odin/generateClientToken`,
          user.appId,
          user.userKey,
          "/api/odin/generateToken",
        ]
      : null,
    secretaryFetcher
  );

  // 로컬상태, 현재 로딩중인지 아닌지 영상이 있는지 등의 데이터를 저장함

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
        // 유효성 검사
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

        // ai 비서 템플릿 생성

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

        // 비디오를 만듬
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

  // 다운중인 비디오가 있을 경우 6초마다 progress를 받아오는 요청을 보냄
  // return을 통해 언마운트시 없애줌

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
          <Secretary localData={localData} onSubmit={onSubmit} />
        ) : (
          <div>사용자 정보를 받아오는 중..</div>
        )}
      </AppLayout>
    </>
  );
};

export default SecretaryPage;
