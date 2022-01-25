import axios from "axios";
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
