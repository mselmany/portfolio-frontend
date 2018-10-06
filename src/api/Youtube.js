import { ApiBase } from "./helpers";
import global from "@/global";

class Youtube extends ApiBase {
  constructor(axiosConfig) {
    super(axiosConfig);
  }

  async activities({ limit, pageToken, publishedBefore, publishedAfter } = {}) {
    try {
      return await this.get("/activities", {
        params: {
          ...(limit && { limit }),
          ...(pageToken && { pageToken }),
          ...(publishedBefore && { publishedBefore }),
          ...(publishedAfter && { publishedAfter })
        }
      });
    } catch (err) {
      this.error(err);
    }
  }

  async playlist({
    id,
    limit,
    pageToken,
    publishedBefore,
    publishedAfter
  } = {}) {
    try {
      this.required({ id });
      return await this.get(`/playlist/${id}`, {
        params: {
          ...(limit && { limit }),
          ...(pageToken && { pageToken }),
          ...(publishedBefore && { publishedBefore }),
          ...(publishedAfter && { publishedAfter })
        }
      });
    } catch (err) {
      this.error(err);
    }
  }

  async video({ id, videoCategoryId } = {}) {
    try {
      this.required({ id });
      return await this.get(`/video/${id}`, {
        params: {
          ...(videoCategoryId && { videoCategoryId })
        }
      });
    } catch (err) {
      this.error(err);
    }
  }

  async _bucket() {
    try {
      let r = { activities: this.activities() };
      return {
        activities: await r.activities
      };
    } catch (err) {
      this.error(err);
    }
  }
}

export default new Youtube({ baseURL: `${global.apiBaseUrl}/youtube` });
