export interface SecretaryStateType {
  videoLoading: boolean;
  progress: "waiting" | number;
  videoDone: boolean;
  videoError: boolean;
  videoURL: null | string;
  videoKey: null | string;
}

export interface TokenType {
  clientTokenUrl: string;
  appId: string;
  userKey: string;
  tokenUrl: string;
}
