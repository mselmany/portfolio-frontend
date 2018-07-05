import getters from "./getters";
import actions from "./actions";
import mutations from "./mutations";
import { filterlist } from "@/configs";

const initialState = { ...filterlist };

// select at least one if there is none selected
// TODO@2: eğer hiç öğesi yoksa olanı varsayılan olarak göster
if (initialState.lists.filter(s => s.selected === true).length < 1) {
  initialState.lists[0].selected = true;
}

export default {
  namespaced: true,
  state: { ...initialState },
  getters,
  actions,
  mutations
};
