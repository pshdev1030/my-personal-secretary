import { ReactElement } from "react";
import { Form, DatePicker, Button } from "antd";
import moment from "moment";
import { SecretaryStateType, TokenType } from "types/secretary";
import { UserType } from "types/user";
import ReactPlayer from "react-player";
import styled from "@emotion/styled";

interface SecretaryType {
  localData: SecretaryStateType | undefined;
  onSubmit: (data: any) => void;
  token: TokenType;
  user: UserType | undefined;
}

const Secretary = ({
  onSubmit,
  localData,
  token,
  user,
}: SecretaryType): ReactElement => {
  return (
    <>
      {localData?.videoLoading && (
        <ProgressWrapper>{localData?.progress}% 완료...</ProgressWrapper>
      )}
      <Form id="secretaryForm" onFinish={onSubmit}>
        <Form.Item label="기간" name="eventDate" required>
          <DatePicker.RangePicker />
        </Form.Item>
      </Form>
      {!localData?.videoLoading && (
        <Button type="primary" htmlType="submit" form="secretaryForm">
          불러오기
        </Button>
      )}
      {localData?.videoDone && localData?.videoURL && (
        <ReactPlayer url={localData.videoURL} controls />
      )}
    </>
  );
};
export default Secretary;

const ProgressWrapper = styled.div`
  font-size: 3rem;
  text-align: center;
`;
