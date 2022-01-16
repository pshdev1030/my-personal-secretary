import React, { ReactElement, useCallback } from "react";
import { Input, Form, Button } from "antd";
import Link from "next/link";
import { toast } from "react-toastify";
import axios from "axios";
import { useSWRConfig } from "swr";

interface logInRequestType {
  logInEmail: string;
  logInPassword: string;
}

const LoginForm = (): ReactElement => {
  const { mutate } = useSWRConfig();
  const onSubmit = async (data: logInRequestType) => {
    const { logInEmail: email, logInPassword: password } = data;
    if (email.trim().length === 0 || password.trim().length === 0) {
      toast.error("모든 값을 입력해주세요");
    }
    const logInRequest = axios
      .post("http://localhost:8000/user/login", {
        email,
        password,
      })
      .then((r) => mutate("http://localhost:8000/user/login", r));
    toast.promise(logInRequest, {
      pending: "곧 로그인 됩니다.",
      success: "로그인에 성공하였습니다.",
      error: {
        render({ data }: any) {
          return data.response.data.message;
        },
      },
    });
  };

  return (
    <Form onFinish={onSubmit}>
      <Form.Item label="email" name="logInEmail">
        <Input type="email" />
      </Form.Item>
      <Form.Item label="passowrd" name="logInPassword">
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
