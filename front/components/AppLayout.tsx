import { Row, Col, Menu } from 'antd';
import React, { ReactElement } from 'react';
import Link from 'next/link';
import LoginForm from './LoginForm';

type Props = {
  children?: React.ReactNode;
};

const AppLayout = ({ children }: Props): ReactElement => {
  return (
    <>
      <Menu mode="horizontal">
        <Menu.Item key="Home">
          <Link href="/" passHref>
            <a>홈</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="Signup">
          <Link href="/signup" passHref>
            <a>회원가입</a>
          </Link>
        </Menu.Item>
      </Menu>
      <Row gutter={8}>
        <Col xs={24} md={6}>
          <LoginForm />
        </Col>
        <Col xs={24} md={18}>
          {children}
        </Col>
      </Row>
    </>
  );
};

export default AppLayout;
