import axios from "axios";
import { EventLocalStateType } from "types/event";

//event 정보를 fetch하는 fetcher, swr에 사용됨
// accesstoken을 받아서 headers에 전달해줌
//즉 user정보를 받아오기 전에는 fetch하지 않는 조건부 데이터 불러오기가 필요함

export const eventFetcher = (url: string, token: string) =>
  axios
    .get(url, { headers: { Authorization: "Bearer " + token } })
    .then((res) => res.data);

// event 로컬에서 사용될 상태 정의

export const eventLocalFetcher = (url: string): EventLocalStateType | null =>
  null;
