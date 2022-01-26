import { ReactElement } from "react";
import { Avatar, Card, Button } from "antd";
import gravatar from "gravatar";
import { UserType } from "types/user";

interface UserInfoType {
  onLogOut: (e: React.MouseEvent<HTMLButtonElement>) => void;
  user: UserType;
}
// gravatar를 이용한 유저 정보
const UserInfo = ({ user, onLogOut }: UserInfoType): ReactElement => {
  return (
    <Card>
      <Card.Meta
        title={user.username}
        avatar={
          <Avatar
            size="large"
            // gravatar로 유저이미지 출력
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
