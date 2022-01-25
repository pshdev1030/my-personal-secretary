export interface SecretaryStateType {
  videoLoading: boolean;
  progress: "waiting" | number;
  videoDone: boolean;
  videoError: boolean;
  videoURL: null | string;
  videoKey: null | string;
}
