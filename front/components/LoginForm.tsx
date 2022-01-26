import React, { ReactElement } from "react";
import { Input, Form, Button } from "antd";
import Link from "next/link";
import { LogInFormRequestType } from "types/user";

interface LogInFormType {
  onSubmit: (data: LogInFormRequestType) => void;
}

// antd를 이용한 유효성 검사
const LoginForm = ({ onSubmit }: LogInFormType): ReactElement => {
  return (
    <Form onFinish={onSubmit}>
      <Form.Item label="email" name="logInEmail" required initialValue="">
        <Input type="email" maxLength={60} min={1} />
      </Form.Item>
      <Form.Item label="passowrd" name="logInPassword" required initialValue="">
        <Input type="password" maxLength={30} min={1} />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        로그인
      </Button>
      <Link href="/signup" passHref>
        <a>
          <Button>회원가입</Button>
        </a>
      </Link>
    </Form>
  );
};
// 길이 제한 두기
export default LoginForm;
