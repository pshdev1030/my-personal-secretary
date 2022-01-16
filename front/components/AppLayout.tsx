import { Row, Col, Menu } from "antd";
import Link from "next/link";
import { ReactElement, ReactNode } from "react";
import LoginForm from "./LoginForm";
import { ToastContainer } from "react-toastify";
import UserInfo from "./UserInfo";
import useSWR from "swr";
import { loginFetcher } from "fetcher/user";

interface AppLayoutPropsType {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutPropsType): ReactElement => {
  const { data: user } = useSWR(
    "http://localhost:8000/user/login",
    loginFetcher
  );
  return (
    <>
      <Menu mode="horizontal">
        <Menu.Item key="Home">
          <Link href="/" passHref>
            <a>홈</a>
          </Link>
        </Menu.Item>
        {!user && (
          <Menu.Item key="Signup">
            <Link href="/signup" passHref>
              <a>회원가입</a>
            </Link>
          </Menu.Item>
        )}
        <Menu.Item key="Secretary">
          <Link href="/secretary" passHref>
            <a>AI 비서</a>
          </Link>
        </Menu.Item>
      </Menu>
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {user ? <UserInfo /> : <LoginForm />}
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
