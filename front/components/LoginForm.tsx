import React, { ReactElement, useCallback } from "react";
import { Input, Form, Button } from "antd";
import Link from "next/link";
import { toast } from "react-toastify";
import axios from "axios";
import { useSWRConfig } from "swr";
import { LogInRequestType } from "types/user";

interface LogInFormType {
  onSubmit: (data: LogInRequestType) => void;
}

const LoginForm = ({ onSubmit }: LogInFormType): ReactElement => {
  return (
    <Form onFinish={onSubmit}>
      <Form.Item label="email" name="logInEmail" required initialValue="">
        <Input type="email" />
      </Form.Item>
      <Form.Item label="passowrd" name="logInPassword" required initialValue="">
        <Input type="password" />
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
