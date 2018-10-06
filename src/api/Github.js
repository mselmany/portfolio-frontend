import { ApiBase } from "./helpers";
import global from "@/global";

class Github extends ApiBase {
  constructor(axiosConfig) {
    super(axiosConfig);
  }

  async events({ page, per_page } = {}) {
    try {
      return await this.get("/events", {
        params: {
          ...(page && { page }),
          ...(per_page && { per_page })
        }
      });
    } catch (err) {
      this.error(err);
    }
  }

  async watchers({ page, per_page } = {}) {
    try {
      return await this.get("/watchers", {
        params: {
          ...(page && { page }),
          ...(per_page && { per_page })
        }
      });
    } catch (err) {
      this.error(err);
    }
  }

  async stars({ page, per_page } = {}) {
    try {
      return await this.get("/stars", {
        params: {
          ...(page && { page }),
          ...(per_page && { per_page })
        }
      });
    } catch (err) {
      this.error(err);
    }
  }

  async gists({ page, per_page } = {}) {
    try {
      return await this.get("/gists", {
        params: {
          ...(page && { page }),
          ...(per_page && { per_page })
        }
      });
    } catch (err) {
      this.error(err);
    }
  }

  async _bucket() {
    try {
      let r = {
        events: this.events(),
        watchers: this.watchers(),
        stars: this.stars(),
        gists: this.gists()
      };
      return {
        events: await r.events,
        watchers: await r.watchers,
        stars: await r.stars,
        gists: await r.gists
      };
    } catch (err) {
      this.error(err);
    }
  }
}

export default new Github({ baseURL: `${global.apiBaseUrl}/github` });
