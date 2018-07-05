import getters from "./getters";
import actions from "./actions";
import mutations from "./mutations";

const initialState = {
  list: []
};

export default {
  namespaced: true,
  state: { ...initialState },
  getters,
  actions,
  mutations
};
