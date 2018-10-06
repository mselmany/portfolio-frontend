import { ApiBase } from "./helpers";
import global from "@/global";

class Unsplash extends ApiBase {
  constructor(axiosConfig) {
    super(axiosConfig);
  }

  async profile({ page, per_page } = {}) {
    try {
      return await this.get("/profile", {
        params: {
          ...(page && { page }),
          ...(per_page && { per_page })
        }
      });
    } catch (err) {
      this.error(err);
    }
  }

  async photos({ order_by, stats, resolution, quantity, page, per_page } = {}) {
    try {
      return await this.get("/photos", {
        params: {
          ...(order_by && { order_by }),
          ...(stats && { stats }),
          ...(resolution && { resolution }),
          ...(quantity && { quantity }),
          ...(page && { page }),
          ...(per_page && { per_page })
        }
      });
    } catch (err) {
      this.error(err);
    }
  }

  async likes({ order_by, page, per_page } = {}) {
    try {
      return await this.get("/likes", {
        params: {
          ...(order_by && { order_by }),
          ...(page && { page }),
          ...(per_page && { per_page })
        }
      });
    } catch (err) {
      this.error(err);
    }
  }

  async collections({ page, per_page } = {}) {
    try {
      return await this.get("/collections", {
        params: {
          ...(page && { page }),
          ...(per_page && { per_page })
        }
      });
    } catch (err) {
      this.error(err);
    }
  }

  async statistics({ resolution, quantity } = {}) {
    try {
      return await this.get("/statistics", {
        params: {
          ...(resolution && { resolution }),
          ...(quantity && { quantity })
        }
      });
    } catch (err) {
      this.error(err);
    }
  }

  async _bucket() {
    try {
      let r = {
        profile: this.profile(),
        photos: this.photos(),
        likes: this.likes(),
        collections: this.collections(),
        statistics: this.statistics()
      };
      return {
        profile: await r.profile,
        photos: await r.photos,
        likes: await r.likes,
        collections: await r.collections,
        statistics: await r.statistics
      };
    } catch (err) {
      this.error(err);
    }
  }
}

export default new Unsplash({ baseURL: `${global.apiBaseUrl}/unsplash` });
