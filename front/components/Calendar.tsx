import FullCalendar, { EventApi, EventClickArg } from "@fullcalendar/react";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import { ReactElement } from "react";
import { EventLocalStateType, EventType } from "types/event";
import styled from "@emotion/styled";

interface CalendarPropsTypes {
  events: EventApi;
  onClickEvent: (data: EventClickArg) => void;
  changeCurState: (date: EventLocalStateType) => void;
  onClickDate: (arg: DateClickArg) => void;
}

// 달력 컴포넌트

const Calendar = ({
  onClickEvent,
  onClickDate,
  events,
}: CalendarPropsTypes): ReactElement => {
  return (
    <CalendarWrapper>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="ko"
        eventClick={onClickEvent}
        events={events}
        dateClick={onClickDate}
        height="auto"
        editable
        selectable
      />
    </CalendarWrapper>
  );
};

const CalendarWrapper = styled.div`
  box-sizing: "border-box";
  width: "100%";
  max-height: "100%";
`;

export default Calendar;
