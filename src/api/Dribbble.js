import { ApiBase } from "./helpers";
import global from "@/global";

class Dribbble extends ApiBase {
  constructor(axiosConfig) {
    super(axiosConfig);
  }

  async shots({ page, perpage } = {}) {
    try {
      return await this.get("/shots", {
        params: {
          ...(page && { page }),
          ...(perpage && { perpage })
        }
      });
    } catch (err) {
      this.error(err);
    }
  }

  async _bucket() {
    try {
      let r = { shots: this.shots() };
      return { shots: await r.shots };
    } catch (err) {
      this.error(err);
    }
  }
}

export default new Dribbble({ baseURL: `${global.apiBaseUrl}/dribbble` });
