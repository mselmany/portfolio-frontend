import axios from "axios";
import messages from "@/messages";
import global from "@/global";
import { error, required } from "@/helpers";

class Api {
  constructor({ baseURL }) {
    this.messages = messages;
    this.perpage = 10;
    this.baseURL = baseURL;
    this.client = axios.create({ baseURL });
  }

  async get(endpoint, config = {}) {
    try {
      return await this.client.get(endpoint, config);
    } catch (err) {
      this.error(err);
    }
  }

  error(err) {
    error(err);
  }

  required(needed) {
    required(needed);
  }
}

export default new Api({ baseURL: global.apiBaseUrl });
