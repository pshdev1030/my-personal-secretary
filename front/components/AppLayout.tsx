import { Row, Col, Menu } from "antd";
import Link from "next/link";
import { ReactElement, ReactNode } from "react";
import LoginForm from "./LoginForm";
import { ToastContainer } from "react-toastify";
import UserInfo from "./UserInfo";

interface AppLayoutPropsType {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutPropsType): ReactElement => {
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
        <Menu.Item key="Secretary">
          <Link href="/secretary" passHref>
            <a>AI 비서</a>
          </Link>
        </Menu.Item>
      </Menu>
      <Row gutter={8}>
        <Col xs={24} md={6}>
          <LoginForm />
          {/* <UserInfo /> */}
        </Col>
        <Col xs={24} md={18}>
          {children}
        </Col>
      </Row>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default AppLayout;
