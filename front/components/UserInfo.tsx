import { ReactElement } from "react";
import { Avatar, Card, Button } from "antd";
import gravatar from "gravatar";
const UserInfo = (): ReactElement => {
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
      <Button>로그아웃</Button>
    </Card>
  );
};
export default UserInfo;
