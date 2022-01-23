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

export default Calendar;
