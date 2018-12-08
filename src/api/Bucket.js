import { ApiBase } from "./helpers";
import global from "@/global";
import list from "@/mock/list.json";

class Bucket extends ApiBase {
  constructor(axiosConfig) {
    super(axiosConfig);
  }

  async list({ filter } = {}) {
    try {
      if (process.env.NODE_ENV === "development") {
        return await Promise.resolve(list);
      }
      return this.get("/list", {
        params: {
          ...(filter && { filter })
        }
      });
    } catch (err) {
      this.error(err);
    }
  }

  async status() {
    try {
      return await this.get("/status");
    } catch (err) {
      this.error(err);
    }
  }
}

export default new Bucket({ baseURL: `${global.apiBaseUrl}/bucket` });
