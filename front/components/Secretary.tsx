import { ReactElement } from "react";
import { Form, DatePicker, Button } from "antd";
import moment from "moment";

interface SecretaryType {
  onSubmit: (data: any) => void;
}

const Secretary = ({ onSubmit }: SecretaryType): ReactElement => {
  return (
    <>
      <Form id="secretaryForm" onFinish={onSubmit}>
        <Form.Item label="기간" name="eventDate" required>
          <DatePicker.RangePicker />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          불러오기
        </Button>
      </Form>
    </>
  );
};
export default Secretary;
