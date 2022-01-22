import FullCalendar, { EventApi, EventClickArg } from "@fullcalendar/react";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import { ReactElement } from "react";
import { EventLocalStateType, EventType } from "types/event";

interface CalendarPropsTypes {
  events: EventApi;
  onClickEvent: (data: EventClickArg) => void;
  changeCurState: (date: EventLocalStateType) => void;
  onClickDate: (arg: DateClickArg) => void;
}

const Calendar = ({
  onClickEvent,
  onClickDate,
  events,
}: CalendarPropsTypes): ReactElement => {
  return (
    <div style={{ boxSizing: "border-box", width: "100%", maxHeight: "100%" }}>
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
    </div>
  );
};
// 라이브러리에 next prev 버튼 이벤트가 없어서 events에 데이터를 fetch하는 코드를 작성하였습니다.

export default Calendar;
