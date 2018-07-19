import axios from "axios";
import messages from "@/messages";

export const twitter = {
  endpoint: "http://localhost:3001/api/twitter",
  async token() {
    return await axios.get(`${this.endpoint}/token`);
  },
  async timeline() {
    return await axios.get(`${this.endpoint}/timeline`);
  }
};
