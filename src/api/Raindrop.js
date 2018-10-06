import { ApiBase } from "./helpers";
import global from "@/global";

class Raindrop extends ApiBase {
  constructor(axiosConfig) {
    super(axiosConfig);
  }

  async collection({ collection_id } = {}) {
    try {
      return await this.get("/collection", {
        params: {
          ...(collection_id && { collection_id })
        }
      });
    } catch (err) {
      this.error(err);
    }
  }

  async bookmarks({ collection_id, page, perpage, search, sort } = {}) {
    try {
      return await this.get("/bookmarks", {
        params: {
          ...(collection_id && { collection_id }),
          ...(page && { page }),
          ...(perpage && { perpage }),
          ...(search && { search }),
          ...(sort && { sort })
        }
      });
    } catch (err) {
      this.error(err);
    }
  }

  async bookmark({ id } = {}) {
    try {
      this.required({ id });
      return await this.get(`/bookmark/${id}`);
    } catch (err) {
      this.error(err);
    }
  }

  async _bucket() {
    try {
      let r = {
        collection: this.collection(),
        bookmarks: this.bookmarks()
      };
      return {
        collection: await r.collection,
        bookmarks: await r.bookmarks
      };
    } catch (err) {
      this.error(err);
    }
  }
}

export default new Raindrop({ baseURL: `${global.apiBaseUrl}/raindrop` });
