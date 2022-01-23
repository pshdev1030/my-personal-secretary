import React, { ReactElement, useCallback, useRef } from "react";
import { Input, Form, Button } from "antd";
import { useSWRConfig } from "swr";
import { SignUpFormRequestType } from "types/user";

interface SignUpFormType {
  onSubmit: (data: SignUpFormRequestType) => void;
}

const SignUpForm = ({ onSubmit }: SignUpFormType): ReactElement => {
  return (
    <Form onFinish={onSubmit}>
      <Form.Item label="email" name="signUpEmail" required initialValue="">
        <Input type="email" />
      </Form.Item>
      <Form.Item label="username" name="username" required initialValue="">
        <Input type="text" />
      </Form.Item>
      <Form.Item
        label="passowrd"
        name="signUpPassword"
        required
        initialValue=""
      >
        <Input type="password" />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        가입하기
      </Button>
    </Form>
  );
};
export default SignUpForm;
