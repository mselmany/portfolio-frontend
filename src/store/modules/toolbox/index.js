import getters from "./getters";
import actions from "./actions";
import mutations from "./mutations";
import { toolbox } from "@/configs";

const initialState = { ...toolbox };

// add id each button item by its index and "active: false" key by default
[initialState.routes, initialState.buttons].map(item => item.map(modify));

initialState.buttons.map(button => {
  if (
    !button.icon.hasOwnProperty("active") ||
    !button.label.hasOwnProperty("active")
  ) {
    delete button.active;
    button.notoggle = true;
  }
  return button;
});

export default {
  namespaced: true,
  state: { ...initialState },
  getters,
  actions,
  mutations
};

function modify(item, index) {
  if (!item.hasOwnProperty("active")) item.active = false;
  item.id = index;
  return item;
}
