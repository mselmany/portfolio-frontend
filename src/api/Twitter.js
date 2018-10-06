import { ApiBase } from "./helpers";
import global from "@/global";

class Twitter extends ApiBase {
  constructor(axiosConfig) {
    super(axiosConfig);
  }

  async timeline({
    user_id,
    since_id,
    count,
    max_id,
    trim_user,
    exclude_replies,
    include_rts
  } = {}) {
    try {
      return await this.get("/timeline", {
        params: {
          ...(user_id && { user_id }),
          ...(since_id && { since_id }),
          ...(count && { count }),
          ...(max_id && { max_id }),
          ...(trim_user && { trim_user }),
          ...(exclude_replies && { exclude_replies }),
          ...(include_rts && { include_rts })
        }
      });
    } catch (err) {
      this.error(err);
    }
  }

  async likes({ user_id, since_id, count, max_id, include_rts } = {}) {
    try {
      return await this.get("/likes", {
        params: {
          ...(user_id && { user_id }),
          ...(since_id && { since_id }),
          ...(count && { count }),
          ...(max_id && { max_id }),
          ...(include_rts && { include_rts })
        }
      });
    } catch (err) {
      this.error(err);
    }
  }

  async _bucket() {
    try {
      let r = {
        timeline: this.timeline(),
        likes: this.likes()
      };
      return {
        timeline: await r.timeline,
        likes: await r.likes
      };
    } catch (err) {
      this.error(err);
    }
  }
}

export default new Twitter({ baseURL: `${global.apiBaseUrl}/twitter` });
