import getters from "./getters";
import actions from "./actions";
import mutations from "./mutations";

const initialState = {
  raw: {},
  list: [], // list's order is important, do not change (can mutate items)
  viewed: [],
  page: {
    count: 0
  }
};

export default {
  namespaced: true,
  state: { ...initialState },
  getters,
  actions,
  mutations
};
