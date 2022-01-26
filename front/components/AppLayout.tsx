import { Row, Col, Menu } from "antd";
import Link from "next/link";
import { ReactElement, ReactNode, useCallback } from "react";
import LoginForm from "./LoginForm";
import { toast, ToastContainer } from "react-toastify";
import UserInfo from "./UserInfo";
import useSWR from "swr";
import { loginFetcher } from "fetcher/user";
import axios from "axios";
import { LogInFormRequestType } from "types/user";
import { dbUrl } from "constant/api";

interface AppLayoutPropsType {
  children: ReactNode;
}

// 공통 레이아웃을 정의

const AppLayout = ({ children }: AppLayoutPropsType): ReactElement => {
  // 로그인이 유무에 따라 다른 레이아웃을 보여주기 위함
  const { data: user, mutate } = useSWR(`${dbUrl}/user/login`, loginFetcher);

  // 로그아웃 함수, 로컬데이터를 없앰
  const onLogOut = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    mutate(null);
  }, []);

  // 로그인 폼 제출하는 함수
  const onSubmit = useCallback(async (data: LogInFormRequestType) => {
    const { logInEmail: email, logInPassword: password } = data;
    if (email.trim().length === 0 || password.trim().length === 0) {
      toast.error("모든 값을 입력해주세요");
      return;
    }

    if (email.length > 60 || email.length <= 1) {
      toast.error("이메일은 1 이상 60 이하여야 합니다.");
      return;
    }

    if (password.length > 60 || password.length <= 1) {
      toast.error("비밀번호는 1 이상 30 이하여야 합니다.");
      return;
    }
    // 로그인 성공후 로컬 상태를 업데이트(갱신 포함)
    const logInRequest = axios
      .post(`${dbUrl}/user/login`, {
        email,
        password,
      })
      .then((r) => mutate(r.data));
    toast.promise(logInRequest, {
      pending: "곧 로그인 됩니다.",
      success: "로그인에 성공하였습니다.",
      error: {
        // 서버에서 status와 내려준 에러일경우 출력, 아닐경우 문제가 발생하여습니다 출력
        render({ data }: any) {
          return data.response.data
            ? data.response.data
            : "문제가 발생하였습니다.";
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
          <Menu.Item key="Secretary">
            <Link href="/secretary" passHref>
              <a>AI 비서</a>
            </Link>
          </Menu.Item>
        )}
      </Menu>
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {/* 로그인 되어있을 경우 유저 정보를 렌더링함 */}
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

      {/* Toast를 띄우기 위해 공통 레이아웃 컴포넌트에 ToastContainer 선언 */}
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
