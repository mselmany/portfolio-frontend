import axios from "axios";
import { required } from "@/helpers";

export class ApiBase {
  constructor({ baseURL, token, withCredentials }) {
    required({ baseURL });
    this.perpage = 10;
    this.client = axios.create({
      baseURL,
      headers: { ...(token && { Authorization: token }) },
      withCredentials: !!withCredentials
    });
  }
}
