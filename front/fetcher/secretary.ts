import axios from "axios";
import { SecretaryStateType } from "types/secretary";
import { string } from "yup";
export const secretaryFetcher = async (
  clientTokenUrl: string,
  appId: string,
  userKey: string,
  tokenUrl: string
) => {
  console.log(clientTokenUrl, appId, userKey, tokenUrl);
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

export const secretaryLocalFetcher = (url: string): SecretaryStateType => ({
  videoLoading: false,
  progress: 0,
  videoDone: false,
  videoError: false,
  videoURL: null,
  videoKey: null,
});
