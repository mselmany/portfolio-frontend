import { ApiBase } from "./helpers";
import { required } from "@/helpers";

const USER_ID = "10812846";
const CLIENT_ID = "?client_id=d01accc030bfaa3bb48783eb7f2db5e6";
const API_URL = "https://api.soundcloud.com";

class Soundcloud extends ApiBase {
  constructor(user_id, client_id) {
    required({ user_id, client_id });
    super({ baseURL: API_URL });
    this.user_id = user_id;
    this.client_id = client_id;
    this.client.interceptors.request.use(
      config => {
        config.url += this.client_id;
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
  }

  async user({ limit = this.perpage, linked_partitioning = 1 } = {}) {
    try {
      return await this.client.get(`/users/${this.user_id}`, {
        params: {
          ...(limit && { limit }),
          ...(linked_partitioning && { linked_partitioning })
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  async playlists({ limit = this.perpage, linked_partitioning = 1 } = {}) {
    try {
      return await this.client.get(`/users/${this.user_id}/playlists`, {
        params: {
          ...(limit && { limit }),
          ...(linked_partitioning && { linked_partitioning })
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  async comments({ limit = this.perpage, linked_partitioning = 1 } = {}) {
    try {
      return await this.client.get(`/users/${this.user_id}/comments`, {
        params: {
          ...(limit && { limit }),
          ...(linked_partitioning && { linked_partitioning })
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  async favorites({ limit = this.perpage, linked_partitioning = 1 } = {}) {
    try {
      return await this.client.get(`/users/${this.user_id}/favorites`, {
        params: {
          ...(limit && { limit }),
          ...(linked_partitioning && { linked_partitioning })
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  async tracks({ limit = this.perpage, linked_partitioning = 1 } = {}) {
    try {
      return await this.client.get(`/users/${this.user_id}/tracks`, {
        params: {
          ...(limit && { limit }),
          ...(linked_partitioning && { linked_partitioning })
        }
      });
    } catch (err) {
      console.error(err);
    }
  }

  async track({ id }) {
    try {
      required({ id });
      return await this.client.get(`/tracks/${id}`);
    } catch (err) {
      console.error(err);
    }
  }
}

export default new Soundcloud(USER_ID, CLIENT_ID);
