import getters from "./getters";
import actions from "./actions";
import mutations from "./mutations";
import { sidebarmenu, notifications } from "@/configs";

const { loading } = notifications;

const initialState = {
  sidebarmenu: { ...sidebarmenu },
  notifications: {
    list: [],
    enabled: true
  },
  loading: {
    ...loading,
    queue: [],
    pending: false
  }
};

export default {
  namespaced: true,
  state: { ...initialState },
  getters,
  actions,
  mutations
};
