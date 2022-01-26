import AppLayout from "components/AppLayout";
import Secretary from "components/Secretary";
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

  // 로컬상태, 현재 비디오를 받아오는 중인지 등등 관리
  // videoLoading: false, // 비디오를 불러오고 있는 중인지 나타내는 변수
  // progress: 0, // 진행률을 나타내는 변수
  // videoDone: false, // 비디오를 불러왔는지 나타내는 변수
  // videoError: false, // 비디오를 불러오는 중 에러가 발생했는지 나타내는 변수
  // videoURL: null, // 비디오의 url을 저장하는 변수
  // videoKey: null, // 비디오의 key(서버로 findProject 할 때 사용)

  const { data: localData, mutate: localMutate } = useSWR(
    user ? "SecretaryLocalData" : null,
    secretaryLocalFetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // 토큰을 기반으로 영상을 요청하는 함수
  // user가 undefined가 아닐 떄, 토큰에 접근할 수 있을 때 새로 갱신
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
        // 인사말과 마무리멘트를 추가한다.
        let templateArr =
          modifyEventRequest.length === 0
            ? [
                `${moment(start).format(
                  "YYYY년 M월 D일 dd요일 k시m분"
                )}부터 ${moment(start).format(
                  "YYYY년 M월 D일 dd요일 k시m분"
                )}까지는 일정이 없습니다.`,
              ]
            : modifyEventRequest.map((ele: EventType) => {
                if (ele.start === ele.end) {
                  // 요일을 받아오기 위해 format을 정해줌
                  const eventDate = moment(ele.date).format(
                    "YYYY년 M월 D일 dd요일 k시m분"
                  );
                  return `${eventDate}에는 ${ele.title}일정이 있습니다. `;
                }
                const eventStart = moment(ele.start).format(
                  "YYYY년 M월 D일 dd요일 k시m분"
                );
                const eventEnd = moment(ele.start).format(
                  "YYYY년 M월 D일 dd요일 k시m분"
                );
                return `${eventStart}부터 ${eventEnd}까지는 ${ele.title} 일정이 있습니다.`;
              });

        templateArr.unshift(`안녕하세요 ${user.username}님 AI비서입니다.`);
        templateArr.push(`오늘도 좋은 하루 되세요`);
        const template = templateArr.join("\n");

        // 비디오를 만듬
        // 상태가 꼬일것을 염려하여 모든 상태를 변경하도록 작성
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
      // 비디오가 만들어진 상태거나 유저나 토큰이 없을경우 아무 작업도 하지 않음
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
      // 클로저를 이용하여 타이머 관리
      // 6초마다 findProject를 호출하고 로컬상태의 progress를 업데이트함
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
      // 6초마다 호출
      timerId = setInterval(callback, 6000);

      // 언마운트시 clearInterval을 호출해줌
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
