import { ApiBase } from "./helpers";
import { required } from "@/helpers";

const COLLECTION_ID = "332791";
const API_URL = "https://raindrop.io/v1";

class Raindrop extends ApiBase {
  constructor(collection_id) {
    required({ collection_id });
    super({ baseURL: API_URL, withCredentials: true });
    this.collection_id = collection_id;
  }

  async collection() {
    try {
      return await this.client.get(`/collection/${this.collection_id}`);
    } catch (err) {
      console.error(err);
    }
  }

  async bookmarks({ page, perpage = this.perpage, search, sort } = {}) {
    try {
      return await this.client.get(`/bookmarks/${this.collection_id}`, {
        params: {
          ...(page && { page }),
          ...(perpage && { perpage }),
          ...(search && { search }),
          ...(sort && { sort })
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  async bookmark({ id }) {
    try {
      required({ id });
      return await this.client.get(`/bookmark/${id}`);
    } catch (err) {
      console.error(err);
    }
  }
}

export default new Raindrop(COLLECTION_ID);
