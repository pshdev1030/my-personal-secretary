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
  const { data: user } = useSWR<UserType>(`${dbUrl}/user/login`, loginFetcher);

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

  const { data: curState, mutate: localMutate } = useSWR(
    "EventFormLocalState",
    eventLocalFetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const [isOpenedModal, setIsOpenedModal] = useState<boolean>(false);

  const changeCurState = useCallback((data: EventLocalStateType) => {
    localMutate(data, false);
    setIsOpenedModal(true);
  }, []);

  // 이벤트를 클릭할 경우 로컬상태에 이벤트를 등록
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

  const onCloseModal = useCallback(() => {
    setIsOpenedModal(false);
  }, []);

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

        const newEventRequest = axios
          .post(
            `${dbUrl}/schedule`,
            { newEvent },
            {
              headers: { Authorization: `Bearer ${user.accessToken}` },
            }
          )
          .then(() => eventsMutate());

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

        const modifyEventRequest = axios
          .put(
            `${dbUrl}/schedule`,
            { newEvent },
            {
              headers: { Authorization: `Bearer ${user.accessToken}` },
            }
          )
          .then(() => eventsMutate());

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

  const onRemoveEvent = useCallback(
    async (data) => {
      try {
        if (!user) {
          return;
        }
        const removeEventRequest = axios
          .delete(`${dbUrl}/schedule`, {
            headers: { Authorization: `Bearer ${user.accessToken}` },
            data: { scheduleId: curState?.event.id },
          })
          .then(() => eventsMutate());

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

// 상수화 할 수 있는 컴포넌트는 부모와 같은 레벨에 선언해 렌더링 최적화

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
