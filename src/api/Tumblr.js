import { ApiBase } from "./helpers";
import global from "@/global";

class Tumblr extends ApiBase {
  constructor(axiosConfig) {
    super(axiosConfig);
  }

  async bloginfo({ blogname } = {}) {
    try {
      return await this.get("/bloginfo", {
        params: {
          ...(blogname && { blogname })
        }
      });
    } catch (err) {
      this.error(err);
    }
  }

  async likes({ blogname, limit, offset, before, after } = {}) {
    try {
      return await this.get("/likes", {
        params: {
          ...(blogname && { blogname }),
          ...(limit && { limit }),
          ...(offset && { offset }),
          ...(before && { before }),
          ...(after && { after })
        }
      });
    } catch (err) {
      this.error(err);
    }
  }

  async posts({
    blogname,
    type,
    id,
    tag,
    reblog_info,
    notes_info,
    filter,
    limit,
    offset,
    before
  } = {}) {
    try {
      return await this.get("/posts", {
        params: {
          ...(blogname && { blogname }),
          ...(type && { type }),
          ...(id && { id }),
          ...(tag && { tag }),
          ...(reblog_info && { reblog_info }),
          ...(notes_info && { notes_info }),
          ...(filter && { filter }),
          ...(limit && { limit }),
          ...(offset && { offset }),
          ...(before && { before })
        }
      });
    } catch (err) {
      this.error(err);
    }
  }

  async _bucket() {
    try {
      let r = {
        bloginfo: this.bloginfo(),
        likes: this.likes(),
        posts: this.posts()
      };
      return {
        bloginfo: await r.bloginfo,
        likes: await r.likes,
        posts: await r.posts
      };
    } catch (err) {
      this.error(err);
    }
  }
}

export default new Tumblr({ baseURL: `${global.apiBaseUrl}/tumblr` });
