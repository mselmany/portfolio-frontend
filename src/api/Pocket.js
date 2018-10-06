import { ApiBase } from "./helpers";
import global from "@/global";

class Pocket extends ApiBase {
  constructor(axiosConfig) {
    super(axiosConfig);
  }

  async bookmarks({ detailType, since, offset, count } = {}) {
    try {
      return await this.get("/bookmarks", {
        params: {
          ...(detailType && { detailType }),
          ...(since && { since }),
          ...(offset && { offset }),
          ...(count && { count })
        }
      });
    } catch (err) {
      this.error(err);
    }
  }

  async _bucket() {
    try {
      let r = { bookmarks: this.bookmarks() };
      return { bookmarks: await r.bookmarks };
    } catch (err) {
      this.error(err);
    }
  }
}

export default new Pocket({ baseURL: `${global.apiBaseUrl}/pocket` });
