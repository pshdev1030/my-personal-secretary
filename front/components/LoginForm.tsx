import { Form, Input, Button } from 'antd';
import Link from 'next/link';
import React, { ReactElement } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

interface loginInfo {
  email: string;
  password: string;
}

const LoginForm = (): ReactElement => {
  const onSubmit = async (userData: loginInfo) => {
    try {
      const { email, password } = userData;
      if (email.trim().length === 0 || password.trim().length === 0)
        toast('모든 항목을 입력해주세요');
      const data = await axios.post('/user/login', { email, password, username: 'asdf' });
      console.log(data);
    } catch (err) {
      console.log(err);
    }

    return;
  };
  return (
    <Form layout="horizontal" onFinish={onSubmit}>
      <Form.Item name="email" label="email" required>
        <Input type="email" />
      </Form.Item>
      <Form.Item name="password" label="password" required>
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

export default LoginForm;
