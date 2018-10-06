import { ApiBase } from "./helpers";
import global from "@/global";

class Instagram extends ApiBase {
  constructor(axiosConfig) {
    super(axiosConfig);
  }

  async user() {
    try {
      return await this.get("/user");
    } catch (err) {
      this.error(err);
    }
  }

  async media({ min_id, max_id, count } = {}) {
    try {
      return await this.get("/media", {
        params: {
          ...(min_id && { min_id }),
          ...(max_id && { max_id }),
          ...(count && { count })
        }
      });
    } catch (err) {
      this.error(err);
    }
  }

  async _bucket() {
    try {
      let r = { user: this.user(), media: this.media() };
      return { user: await r.user, media: await r.media };
    } catch (err) {
      this.error(err);
    }
  }
}

export default new Instagram({ baseURL: `${global.apiBaseUrl}/instagram` });
