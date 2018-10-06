import { ApiBase } from "./helpers";
import global from "@/global";

class Bucket extends ApiBase {
  constructor(axiosConfig) {
    super(axiosConfig);
  }

  async list({ filter } = {}) {
    try {
      return await this.get("/list", {
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
