import React, { ReactElement, useCallback } from "react";
import { Input, Form, Button } from "antd";
import { toast } from "react-toastify";
import useInput from "hooks/useInput";
const SignUpForm = (): ReactElement => {
  const [email, onChangeEmail] = useInput("");
  const [password, onChangePassword] = useInput("");
  const [userName, onChangeUserName] = useInput("");

  const onSubmit = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (
        email.trim().length === 0 ||
        password.trim().length === 0 ||
        userName.trim().length === 0
      ) {
        toast.error("모든 값을 입력해주세요");
      }
      console.log(email, password, userName);
    },
    [email, password, userName]
  );

  return (
    <Form onFinish={onSubmit}>
      <Form.Item label="email" name="loginEmail">
        <Input type="email" value={email} onChange={onChangeEmail} />
      </Form.Item>
      <Form.Item label="username" name="userName">
        <Input type="text" value={userName} onChange={onChangeUserName} />
      </Form.Item>
      <Form.Item label="passowrd" name="loginPassword">
        <Input type="password" value={password} onChange={onChangePassword} />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        가입하기
      </Button>
    </Form>
  );
};
export default SignUpForm;
