import global from "@/global";
import { ApiBase } from "./helpers";

export const api = new ApiBase({ baseURL: global.apiBaseUrl });
