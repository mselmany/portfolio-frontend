import { TOGGLE, TOGGLE_ALL } from "./types";
import { INIT } from "@/store/modules/common/types";
import { error } from "@/helpers/utils";

export default {
  [INIT](state, { data = error("'data' is missing!") }) {
    const types = Object.values(data)
      .filter(({ success }) => success)
      .map(({ source: { name } }) => name);
    state.lists = state.lists.filter(({ type }) => types.includes(type));
  },
  [TOGGLE](state, { type = error("'type' is missing!"), enabled = null }) {
    const item = state.lists.find(s => s.type === type);
    const selectedOneOrMore =
      state.lists.filter(({ selected }) => selected).length > 1;

    if (!selectedOneOrMore && item.selected) return;

    item.selected = enabled !== null ? enabled : !item.selected;
  },
  [TOGGLE_ALL](state) {
    const listLength = state.lists.length;
    const selectedLength = state.lists.filter(({ selected }) => selected)
      .length;
    let willSelect;

    selectedLength === listLength ? (willSelect = false) : (willSelect = true);

    state.lists.forEach((s, i) => {
      if (willSelect === false && i === 0) {
        s.selected = true;
      } else {
        s.selected = willSelect;
      }
    });
  }
};
