import React, { ReactElement, useCallback } from "react";
import { Input, Form, Button } from "antd";
import { toast } from "react-toastify";
import useInput from "hooks/useInput";
import axios from "axios";
const SignUpForm = (): ReactElement => {
  const [email, onChangeEmail, setEmail] = useInput("");
  const [password, onChangePassword, setPassword] = useInput("");
  const [username, onChangeUserame, setUsername] = useInput("");

  const onSubmit = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (
        email.trim().length === 0 ||
        password.trim().length === 0 ||
        username.trim().length === 0
      ) {
        toast.error("모든 값을 입력해주세요");
      }
      try {
        const result = await axios.post("http://localhost:8000/user", {
          email,
          username: username,
          password,
        });
        setEmail("");
        setUsername("");
        setPassword("");
      } catch (err) {
        console.log(err);
      }
    },
    [email, password, username]
  );

  return (
    <Form onFinish={onSubmit}>
      <Form.Item label="email" name="signUpEmail">
        <Input type="email" value={email} onChange={onChangeEmail} />
      </Form.Item>
      <Form.Item label="username" name="username">
        <Input type="text" value={username} onChange={onChangeUserame} />
      </Form.Item>
      <Form.Item label="passowrd" name="signUpPassword">
        <Input type="password" value={password} onChange={onChangePassword} />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        가입하기
      </Button>
    </Form>
  );
};
export default SignUpForm;
