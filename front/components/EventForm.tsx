import { Form, Input, DatePicker, Select, FormInstance } from "antd";
import { ReactElement, useEffect, useRef, useState } from "react";
import moment from "moment";
import useSWR from "swr";
import { eventLocalFetcher } from "fetcher/event";
import { EventType } from "types/event";

interface EventFormPropsType {
  onSubmit: (data: EventType) => void;
  curEvent: EventType | undefined;
}

const EventForm = ({
  onSubmit,
  curEvent,
}: EventFormPropsType): ReactElement => {
  return (
    <Form
      onFinish={onSubmit}
      id="EventForm"
      initialValues={{
        eventTitle: curEvent?.title ? curEvent.title : "",
        eventDate: curEvent?.start
          ? [moment(curEvent?.start), moment(curEvent?.end)]
          : [moment(curEvent?.date), moment(curEvent?.date)],
        eventUrl: curEvent?.url ? curEvent?.url : "",
        eventId: curEvent?.id ? curEvent?.id : "",
      }}
    >
      <Form.Item label="title" name="eventTitle" required>
        <Input type="text" />
      </Form.Item>
      <Form.Item label="date" name="eventDate" required>
        <DatePicker.RangePicker
          format="YY/MM/DD HH:mm"
          showTime={{ format: "HH:mm" }}
        />
      </Form.Item>
      <Form.Item label="url" name="eventUrl">
        <Input type="url" />
      </Form.Item>
      <Form.Item label="id" name="eventId" hidden>
        <Input type="text" />
      </Form.Item>
    </Form>
  );
};

export default EventForm;
