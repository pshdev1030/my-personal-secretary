import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import { ReactElement, useRef } from "react";

const Calendar = (): ReactElement => {
  return (
    <div style={{ boxSizing: "border-box", width: "100%", maxHeight: "100%" }}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="ko"
        events={[
          {
            id: "1",
            title: "event 1",
            start: "2022-01-14T10:00:00",
            end: "2022-01-14T12:00:00",
          },
          {
            id: "2",
            title: "event 2",
            start: "2022-01-16T13:00:00",
            end: "2022-01-16T18:00:00",
          },
          {
            id: "3",
            title: "event 3",
            start: "2022-01-16T16:00:00",
            end: "2022-01-16T19:00:00",
          },
          {
            id: "3",
            title: "event 3",
            start: "2022-01-17",
            end: "2022-01-20",
          },
        ]}
        height="auto"
        editable
        dateClick={(date) => (date.dayEl.style.background = "black")}
        selectable
      />
    </div>
  );
};

export default Calendar;
