// 비디오 관련 로컬상태의 타입을 정의
export interface SecretaryStateType {
  videoLoading: boolean;
  progress: "waiting" | number;
  videoDone: boolean;
  videoError: boolean;
  videoURL: null | string;
  videoKey: null | string;
}
