import React, { ReactElement, useCallback, useRef } from "react";
import { Input, Form, Button } from "antd";
import { toast } from "react-toastify";
import axios from "axios";
import { useSWRConfig } from "swr";

interface signUpRequestType {
  signUpEmail: string;
  signUpPassword: string;
  username: string;
}

const SignUpForm = (): ReactElement => {
  const { mutate } = useSWRConfig();
  const onSubmit = useCallback(async (data: signUpRequestType) => {
    const { signUpEmail: email, signUpPassword: password, username } = data;
    if (
      email.trim().length === 0 ||
      password.trim().length === 0 ||
      username.trim().length === 0
    ) {
      toast.error("모든 값을 입력해주세요");
    }
    const signUpRequest = axios
      .post("http://localhost:8000/user", {
        email,
        username,
        password,
      })
      .then((r) => mutate("http://localhost:8000/user/login", r.data));
    toast.promise(signUpRequest, {
      pending: "회원가입 중입니다.",
      success: "회원가입에 성공하였습니다. 곧 메인페이지로 이동합니다.",
      error: {
        render({ data }: any) {
          return data.response.data;
        },
      },
    });
  }, []);

  return (
    <Form onFinish={onSubmit}>
      <Form.Item label="email" name="signUpEmail">
        <Input type="email" />
      </Form.Item>
      <Form.Item label="username" name="username">
        <Input type="text" />
      </Form.Item>
      <Form.Item label="passowrd" name="signUpPassword">
        <Input type="password" />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        가입하기
      </Button>
    </Form>
  );
};
export default SignUpForm;
