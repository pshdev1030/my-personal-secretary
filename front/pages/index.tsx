import AppLayout from "@components/AppLayout";
import Calendar from "@components/Calendar";
import type { NextPage } from "next";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import { eventFetcher, eventLocalFetcher } from "fetcher/event";
import EventForm from "@components/EventForm";
import Modal from "@components/Modal";
import { Button } from "antd";
import axios from "axios";
import { loginFetcher } from "fetcher/user";
import { EventLocalStateType, EventType } from "types/event";
import { EventClickArg } from "@fullcalendar/react";
import { DateClickArg } from "@fullcalendar/interaction";
import { UserType } from "types/user";
import { dbUrl } from "constant/api";

// 기본 페이지

const Home: NextPage = () => {
  // user만 주기적으로 갱신
  const { data: user } = useSWR<UserType>(`${dbUrl}/user/login`, loginFetcher);

  // user정보가 존재하지 않을 경우 acesstoken이 없으므로 event를 불러오지 않는다.
  const { data: events, mutate: eventsMutate } = useSWR(
    user ? [`${dbUrl}/schedule`, user.accessToken] : null,
    eventFetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // 로컬 상태
  // 마지막으로 클릭된 것이 기존에 존재하는 이벤트인지 날짜인지 구분하기 위해 사용한다.
  //  event: EventType;
  //  type: "DATE" | "EVENT";
  const { data: curState, mutate: localMutate } = useSWR(
    "EventFormLocalState",
    eventLocalFetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // 모달의 열고 닫히고를 관리하는 state
  const [isOpenedModal, setIsOpenedModal] = useState<boolean>(false);

  // 마지막으로 클릭된 것이 기존에 존재하는 이벤트인지 날짜인지 바꾸는 함수
  const changeCurState = useCallback((data: EventLocalStateType) => {
    localMutate(data, false);
    setIsOpenedModal(true);
  }, []);

  // 이벤트를 클릭할 경우 로컬상태에 이벤트를 등록
  // start가 end와 같을 떄 end가 누락되는 현상이 있어 이런 경우 저장을 다르게 해줌

  const onClickEvent = useCallback((el: EventClickArg) => {
    const obj: EventType = {
      id: el.event._def.publicId,
      title: el.event._def.title,
      date: el.event.end ? el.event.end?.valueOf() : el.event.start?.valueOf(),
      start: el.event.start?.valueOf(),
      end: el.event.end ? el.event.end?.valueOf() : el.event.start?.valueOf(),
      url: el.event._def.url,
    };
    changeCurState({ event: obj, type: "EVENT" });
  }, []);

  // 날짜를 클릭할 경우 날짜를 로컬상태에 등록
  const onClickDate = useCallback(
    (date: DateClickArg) =>
      changeCurState({
        event: { date: date.dateStr },
        type: "DATE",
      }),
    []
  );

  // 모달을 닫는 함수
  // 모달 컴포넌트에 내려주어 버튼에 이벤트를 등록한다.
  const onCloseModal = useCallback(() => {
    setIsOpenedModal(false);
  }, []);

  // 이벤트를 등록하는 함수
  // optimistic ui를 적용하려 하였으나 로컬에서 작성한 이벤트에는 id값이 존재하지 않는다.
  // 따라서 데이터를 fetch한 후 로컬 상태를 업데이트 하는 로직으로 작성
  // 의존성 배열엔 user===undefined를 넣어주어 토큰에 접근할 수 있게 될 때 새로 만듬(이후로는 새로 만들지 않음)
  const onAddEvent = useCallback(
    async (data) => {
      if (!user) {
        return;
      }
      try {
        const { eventDate: date, eventTitle: title, eventUrl: url } = data;
        if (title.trim().length === 0 || date.length === 0) {
          toast.error("모든 값을 입력해주세요");
          return;
        }
        // start와 end가 같을경우 null이 누락되는 현상이 있어 다르게 값을 넣음
        const newEvent = {
          date: date.length !== 2 ? date[1].valueOf() : date[0].valueOf(),
          start: date[0].valueOf(),
          end: date.length === 2 ? date[1].valueOf() : date[0].valueOf(),
          url,
          title,
        };
        // data를 받아오고 로컬상태를 업데이트
        const newEventRequest = axios
          .post(
            `${dbUrl}/schedule`,
            { newEvent },
            {
              headers: { Authorization: `Bearer ${user.accessToken}` },
            }
          )
          .then(() => eventsMutate());

        // 서버에서 data에 넣어준 메시지가 있을경우 출력
        // 없을경우 기본 메시지 출력
        toast.promise(newEventRequest, {
          pending: "이벤트를 등록 중입니다.",
          success: "이벤트를 등록하였습니다.",
          error: {
            render({ data }: any) {
              return data.response.data
                ? data.response.data
                : "문제가 발생하였습니다.";
            },
          },
        });

        setIsOpenedModal(false);
      } catch (e) {
        console.error(e);
      }
    },
    [user === undefined]
  );

  // 이벤트를 수정하는 함수
  // optimistic ui를 적용하려 하였으나 로컬에서 작성한 이벤트에는 id값이 존재하지 않는다.
  // 따라서 데이터를 fetch한 후 로컬 상태를 업데이트 하는 로직으로 작성
  // 의존성 배열엔 user===undefined를 넣어주어 토큰에 접근할 수 있게 될 때 새로 만듬(이후로는 새로 만들지 않음)
  const onModifyEvent = useCallback(
    async (data) => {
      if (!user) {
        return;
      }
      try {
        const {
          eventDate: date,
          eventTitle: title,
          eventUrl: url,
          eventId: id,
        } = data;
        if (title.trim().length === 0 || date.length === 0) {
          toast.error("모든 값을 입력해주세요");
          return;
        }
        const newEvent = {
          date: date.length !== 2 ? date[1].valueOf() : date[0].valueOf(),
          start: date[0].valueOf(),
          end: date.length === 2 ? date[1].valueOf() : date[0].valueOf(),
          url,
          title,
          id,
        };
        //add함수와 같음
        const modifyEventRequest = axios
          .put(
            `${dbUrl}/schedule`,
            { newEvent },
            {
              headers: { Authorization: `Bearer ${user.accessToken}` },
            }
          )
          .then(() => eventsMutate());
        //add함수와 같음
        toast.promise(modifyEventRequest, {
          pending: "이벤트를 수정 중입니다.",
          success: "이벤트를 수정하였습니다.",
          error: {
            render({ data }: any) {
              return data.response.data
                ? data.response.data
                : "문제가 발생하였습니다.";
            },
          },
        });

        setIsOpenedModal(false);
      } catch (e) {
        console.error(e);
      }
    },
    [user === undefined]
  );

  // 이벤트를 삭제하는 함수
  // 이벤트의 id에 접근해야 하므로 curState의 event가 바뀔떄만 재생성
  const onRemoveEvent = useCallback(
    async (data) => {
      try {
        if (!user) {
          return;
        }
        // add,modify와 같음
        const removeEventRequest = axios
          .delete(`${dbUrl}/schedule`, {
            headers: { Authorization: `Bearer ${user.accessToken}` },
            data: { scheduleId: curState?.event.id },
          })
          .then(() => eventsMutate());
        // add,modify와 같음
        toast.promise(removeEventRequest, {
          pending: "이벤트를 삭제 중입니다.",
          success: "이벤트를 삭제하였습니다.",
          error: {
            render({ data }: any) {
              return data.response.data
                ? data.response.data
                : "문제가 발생하였습니다.";
            },
          },
        });

        setIsOpenedModal(false);
        return;
      } catch (e) {
        console.error(e);
      }
    },
    [curState?.event]
  );

  return (
    <>
      <AppLayout>
        {user && events ? (
          <Calendar
            events={events}
            changeCurState={changeCurState}
            onClickEvent={onClickEvent}
            onClickDate={onClickDate}
          />
        ) : (
          <div>로그인하여 일정을 확인하세요.</div>
        )}
      </AppLayout>
      {/* 이벤트인지 날짜인지에 따라 다른 모달 렌더링 */}
      {/* 이벤트일 경우 수정하기로 Form의 default값을 이벤트의 값으로 함 */}
      {curState?.type === "EVENT" ? (
        <Modal
          title="이벤트 수정하기"
          onCloseModal={onCloseModal}
          visible={isOpenedModal}
          footer={[
            <ChangeButton key="changeEventButton" />,
            <RemoveButton
              onRemoveEvent={onRemoveEvent}
              key="deleteEventButton"
            />,
          ]}
        >
          <EventForm
            curEvent={curState?.event}
            formId="eventEditForm"
            onSubmit={onModifyEvent}
          />
        </Modal>
      ) : (
        // 현재 상태가 날짜(date)일 경우 default값을 빈 칸으로 하고 폼의 submit에도 등록 이벤트를 넣는다.
        <Modal
          title="이벤트 작성하기"
          onCloseModal={onCloseModal}
          visible={isOpenedModal}
          footer={[<SubmitButton key="submitnewEventButton" />]}
        >
          <EventForm
            formId="newEventForm"
            curEvent={curState?.event}
            onSubmit={onAddEvent}
          />
        </Modal>
      )}
    </>
  );
};

// 버튼과 같이 상수화 할 수 있는 컴포넌트는 부모와 같은 레벨에 선언한다.
// 리액트 렌더링 알고리즘을 이용하여 최적화

const SubmitButton = () => {
  return (
    <Button htmlType="submit" type="primary" form="newEventForm">
      등록
    </Button>
  );
};

const ChangeButton = () => {
  return (
    <Button htmlType="submit" type="primary" form="eventEditForm">
      수정
    </Button>
  );
};
interface RemoveButtonType {
  onRemoveEvent: (data: any) => Promise<void>;
}

const RemoveButton = ({ onRemoveEvent }: RemoveButtonType) => {
  return (
    <Button danger onClick={onRemoveEvent}>
      삭제
    </Button>
  );
};

export default Home;
