import { ApiBase } from "./helpers";
import global from "@/global";

class Medium extends ApiBase {
  constructor(axiosConfig) {
    super(axiosConfig);
  }

  async latest() {
    try {
      return await this.get("/latest");
    } catch (err) {
      this.error(err);
    }
  }

  async recommended() {
    try {
      return await this.get("/recommended");
    } catch (err) {
      this.error(err);
    }
  }

  async responses() {
    try {
      return await this.get("/responses");
    } catch (err) {
      this.error(err);
    }
  }

  async highlights() {
    try {
      return await this.get("/highlights");
    } catch (err) {
      this.error(err);
    }
  }

  async _bucket() {
    try {
      let r = {
        latest: this.latest(),
        recommended: this.recommended(),
        responses: this.responses(),
        highlights: this.highlights()
      };
      return {
        latest: await r.latest,
        recommended: await r.recommended,
        responses: await r.responses,
        highlights: await r.highlights
      };
    } catch (err) {
      this.error(err);
    }
  }
}

export default new Medium({ baseURL: `${global.apiBaseUrl}/medium` });
