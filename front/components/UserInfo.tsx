import { ReactElement, useCallback } from "react";
import { Avatar, Card, Button } from "antd";
import gravatar from "gravatar";
import { mutate } from "swr";
import { UserType } from "types/user";

interface UserInfoType {
  onLogOut: (e: React.MouseEvent<HTMLButtonElement>) => void;
  user: UserType;
}
const UserInfo = ({ user, onLogOut }: UserInfoType): ReactElement => {
  return (
    <Card>
      <Card.Meta
        title={user.username}
        avatar={
          <Avatar
            size="large"
            src={gravatar.url(user.email, {
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
