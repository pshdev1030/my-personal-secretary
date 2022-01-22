export interface EventType {
  id?: string;
  title?: string;
  date?: moment.MomentInput;
  start?: moment.MomentInput;
  end?: moment.MomentInput;
  url?: string;
}

export interface EventLocalStateType {
  event: EventType;
  type: "DATE" | "EVENT";
}
