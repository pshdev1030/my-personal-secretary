import React, { ReactElement } from "react";
import { Input, Form, Button } from "antd";
import { SignUpFormRequestType } from "types/user";

interface SignUpFormType {
  onSubmit: (data: SignUpFormRequestType) => void;
}

// 회원가입폼, antd를 이용한 유효성검사

const SignUpForm = ({ onSubmit }: SignUpFormType): ReactElement => {
  return (
    <Form onFinish={onSubmit}>
      <Form.Item label="email" name="signUpEmail" required initialValue="">
        <Input type="email" maxLength={60} min={1} />
      </Form.Item>
      <Form.Item label="username" name="username" required initialValue="">
        <Input type="text" maxLength={20} min={1} />
      </Form.Item>
      <Form.Item
        label="passowrd"
        name="signUpPassword"
        required
        initialValue=""
      >
        <Input type="password" maxLength={30} min={1} />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        가입하기
      </Button>
    </Form>
  );
};
export default SignUpForm;
