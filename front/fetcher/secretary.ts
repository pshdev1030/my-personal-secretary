import axios from "axios";
import { SecretaryStateType } from "types/secretary";
import { string } from "yup";

// user 정보에 appId와 userKey가 들어있다고 가정하고 만든 token을 받아오는 fetcher
// swr에 사용됨
// user정보가 있을경우 조건부로 데이터를 불러와야함
export const secretaryFetcher = async (
  clientTokenUrl: string,
  appId: string,
  userKey: string,
  tokenUrl: string
) => {
  const clientToken = await axios
    .get(`${clientTokenUrl}?appId=${appId}&userKey=${userKey}`)
    .then((res) => ({
      appId: res.data.appId,
      token: res.data.token,
      platform: res.data.platform,
    }));

  const token = await axios(tokenUrl, {
    method: "post",
    data: {
      ...clientToken,
      isClientToken: true,
      uuid: userKey,
      sdk_v: "1.0",
      clientHostname: appId,
    },
  }).then((res) => res.data);

  return token;
};

// 비디오 관련해서 사용할 로컬 상태

export const secretaryLocalFetcher = (url: string): SecretaryStateType => ({
  videoLoading: false, // 비디오를 불러오고 있는 중인지 나타내는 변수
  progress: 0, // 진행률을 나타내는 변수
  videoDone: false, // 비디오를 불러왔는지 나타내는 변수
  videoError: false, // 비디오를 불러오는 중 에러가 발생했는지 나타내는 변수
  videoURL: null, // 비디오의 url을 저장하는 변수
  videoKey: null, // 비디오의 key(서버로 findProject 할 때 사용)
});
