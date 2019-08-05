import { ApiBase } from "./helpers";
import global from "@/global";

class Soundcloud extends ApiBase {
  constructor(axiosConfig) {
    super(axiosConfig);
  }

  async user({ limit, linked_partitioning } = {}) {
    try {
      return await this.get("/user", {
        params: {
          ...(limit && { limit }),
          ...(linked_partitioning && { linked_partitioning })
        }
      });
    } catch (err) {
      this.error(err);
    }
  }

  async playlists({ limit, linked_partitioning } = {}) {
    try {
      return await this.get("/playlists", {
        params: {
          ...(limit && { limit }),
          ...(linked_partitioning && { linked_partitioning })
        }
      });
    } catch (err) {
      this.error(err);
    }
  }

  async comments({ limit, linked_partitioning, offset } = {}) {
    try {
      return await this.get("/comments", {
        params: {
          ...(limit && { limit }),
          ...(linked_partitioning && { linked_partitioning }),
          ...(offset && { offset })
        }
      });
    } catch (err) {
      this.error(err);
    }
  }

  async favorites({ limit, linked_partitioning, cursor, page_size } = {}) {
    try {
      return await this.get("/favorites", {
        params: {
          ...(limit && { limit }),
          ...(linked_partitioning && { linked_partitioning }),
          ...(cursor && { cursor }),
          ...(page_size && { page_size })
        }
      });
    } catch (err) {
      this.error(err);
    }
  }

  async tracks({ limit, linked_partitioning } = {}) {
    try {
      return await this.get("/tracks", {
        params: {
          ...(limit && { limit }),
          ...(linked_partitioning && { linked_partitioning })
        }
      });
    } catch (err) {
      this.error(err);
    }
  }

  async track({ id } = {}) {
    try {
      this.required({ id });
      return await this.get(`/track/${id}`);
    } catch (err) {
      this.error(err);
    }
  }

  async _bucket() {
    try {
      let r = {
        user: this.user(),
        playlists: this.playlists(),
        comments: this.comments(),
        favorites: this.favorites(),
        tracks: this.tracks()
      };
      return {
        user: await r.user,
        playlists: await r.playlists,
        comments: await r.comments,
        favorites: await r.favorites,
        tracks: await r.tracks
      };
    } catch (err) {
      this.error(err);
    }
  }
}

export default new Soundcloud({ baseURL: `${global.apiBaseUrl}/soundcloud` });
