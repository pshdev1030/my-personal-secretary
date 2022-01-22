import axios from "axios";
import { EventLocalStateType } from "types/event";

export const eventFetcher = (url: string, token: string) =>
  axios
    .get(url, { headers: { Authorization: "Bearer " + token } })
    .then((res) => res.data);
export const eventLocalFetcher = (url: string): EventLocalStateType | null =>
  null;
