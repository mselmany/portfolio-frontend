import { TOGGLE, TOGGLE_ALL } from "./types";
import { INIT } from "@/store/modules/common/types";
import { error } from "@/helpers/utils";

export default {
  [INIT](state, { data = error("'data' is missing!") }) {
    const types = Object.entries(data)
      .filter(([k, v]) => v)
      .map(([k, v]) => k.toLowerCase());
    state.lists = state.lists.filter(item => types.includes(item.type));
  },
  [TOGGLE](state, { type = error("'type' is missing!"), enabled = null }) {
    const item = state.lists.find(s => s.type === type);
    const selectedOneOrMore =
      state.lists.filter(s => s.selected === true).length > 1;

    if (!selectedOneOrMore && item.selected) return;

    item.selected = enabled !== null ? enabled : !item.selected;
  },
  [TOGGLE_ALL](state) {
    const listLength = state.lists.length;
    const selectedLength = state.lists.filter(s => s.selected === true).length;
    let willSelect;

    selectedLength === listLength ? (willSelect = false) : (willSelect = true);

    state.lists.map((s, i) => {
      if (willSelect === false && i === 0) {
        s.selected = true;
      } else {
        s.selected = willSelect;
      }
      return s;
    });
  }
};
