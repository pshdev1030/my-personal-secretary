import { Row, Col, Menu } from "antd";
import Link from "next/link";
import { ReactElement, ReactNode, useCallback, useEffect } from "react";
import LoginForm from "./LoginForm";
import { toast, ToastContainer } from "react-toastify";
import UserInfo from "./UserInfo";
import useSWR from "swr";
import { loginFetcher } from "fetcher/user";
import axios from "axios";
import { LogInRequestType } from "types/user";

interface AppLayoutPropsType {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutPropsType): ReactElement => {
  const { data: user, mutate } = useSWR(
    "http://localhost:8000/user/login",
    loginFetcher
  );

  const onLogOut = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    mutate(null);
  }, []);

  const onSubmit = useCallback(async (data: LogInRequestType) => {
    const { logInEmail: email, logInPassword: password } = data;
    if (email.trim().length === 0 || password.trim().length === 0) {
      toast.error("모든 값을 입력해주세요");
      return;
    }
    const logInRequest = axios
      .post("http://localhost:8000/user/login", {
        email,
        password,
      })
      .then((r) => mutate(r.data));
    toast.promise(logInRequest, {
      pending: "곧 로그인 됩니다.",
      success: "로그인에 성공하였습니다.",
      error: {
        render({ data }: any) {
          return data.response.data;
        },
      },
    });
  }, []);

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
        {user && (
          <Menu.Item key="Schedule">
            <Link href="/schedule" passHref>
              <a>내 일정</a>
            </Link>
          </Menu.Item>
        )}
        {user && (
          <Menu.Item key="Secretary">
            <Link href="/secretary" passHref>
              <a>AI 비서</a>
            </Link>
          </Menu.Item>
        )}
      </Menu>
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {user ? (
            <UserInfo onLogOut={onLogOut} user={user} />
          ) : (
            <LoginForm onSubmit={onSubmit} />
          )}
        </Col>
        <Col xs={24} md={18}>
          {children}
        </Col>
      </Row>

      <ToastContainer
        position="top-right"
        autoClose={2000}
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
