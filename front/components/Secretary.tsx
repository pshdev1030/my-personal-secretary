import { ReactElement } from "react";
import { Form, DatePicker, Button } from "antd";
import moment from "moment";
import { SecretaryStateType } from "types/secretary";
import { UserType } from "types/user";
import ReactPlayer from "react-player";
import styled from "@emotion/styled";

interface SecretaryType {
  localData: SecretaryStateType | undefined;
  onSubmit: (data: any) => void;
}

// ai 비서 호출하는 컴포넌트

const Secretary = ({ onSubmit, localData }: SecretaryType): ReactElement => {
  return (
    <>
      {/* 비디오를 불러오고 있을 경우 퍼센테이지를 렌더링 */}
      {localData?.videoLoading && (
        <ProgressWrapper>{localData?.progress}% 완료...</ProgressWrapper>
      )}
      <Form id="secretaryForm" onFinish={onSubmit}>
        <Form.Item label="기간" name="eventDate" required>
          <DatePicker.RangePicker />
        </Form.Item>
      </Form>
      {/* 비디오를 불러오고 있지 않을 경우 불러오기 버튼을 렌더링 */}
      {!localData?.videoLoading && (
        <Button type="primary" htmlType="submit" form="secretaryForm">
          불러오기
        </Button>
      )}
      {/* 비디오 불러오기가 끝났고 videoURL이 있을 경우 비디오를 다 불러온 것이므로 비디오 컴포넌트를 렌더링 */}
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
