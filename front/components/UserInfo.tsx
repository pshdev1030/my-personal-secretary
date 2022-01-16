import { ReactElement, useCallback } from "react";
import { Avatar, Card, Button } from "antd";
import gravatar from "gravatar";
import { mutate } from "swr";
const UserInfo = (): ReactElement => {
  const onLogOut = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    mutate("http://localhost:8000/user/login", null);
  }, []);

  return (
    <Card actions={[]}>
      <Card.Meta
        title="박성현"
        avatar={
          <Avatar
            size="large"
            src={gravatar.url("pshdev1030@gmail.com", {
              protocol: "https",
              d: "retro",
            })}
          />
        }
      />
      <Button onClick={onLogOut}>로그아웃</Button>
    </Card>
  );
};
export default UserInfo;
