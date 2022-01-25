//이벤트객체의 타입을 정의
export interface EventType {
  id?: string;
  title?: string;
  date?: moment.MomentInput;
  start?: moment.MomentInput;
  end?: moment.MomentInput;
  url?: string;
}

// 달력 페이지에서 사용될 로컬상태의 타입

export interface EventLocalStateType {
  event: EventType;
  type: "DATE" | "EVENT";
}
