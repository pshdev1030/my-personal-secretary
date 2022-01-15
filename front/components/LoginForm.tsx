import React, { ReactElement, useCallback } from "react";
import { Input, Form, Button } from "antd";
import Link from "next/link";
import { toast } from "react-toastify";
import useInput from "hooks/useInput";
import axios from "axios";

const LoginForm = (): ReactElement => {
  const [email, onChangeEmail] = useInput("");
  const [password, onChangePassword] = useInput("");
  const onSubmit = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (email.trim().length === 0 || password.trim().length === 0) {
        toast.error("모든 값을 입력해주세요");
      }
      try {
        const result = await axios.post("http://localhost:8000/user/login", {
          email,
          password,
        });
      } catch (err) {
        console.log(err);
      }
    },
    [email, password]
  );

  return (
    <Form onFinish={onSubmit}>
      <Form.Item label="email" name="loginEmail">
        <Input type="email" value={email} onChange={onChangeEmail} />
      </Form.Item>
      <Form.Item label="passowrd" name="loginPassword">
        <Input type="password" value={password} onChange={onChangePassword} />
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
