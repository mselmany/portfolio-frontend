import axios from "axios";
import messages from "@/messages";
import { error, required } from "@/helpers/utils";

export class ApiBase {
  constructor(axiosConfig = {}) {
    required({ baseURL: axiosConfig.baseURL });

    this.baseURL = axiosConfig.baseURL;
    this.messages = messages;
    this.client = axios.create(axiosConfig);
  }

  async get(endpoint, config = {}) {
    try {
      this.required({ endpoint: endpoint || undefined });
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
