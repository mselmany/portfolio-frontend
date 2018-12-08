import { TOGGLE, TOGGLE_ALL } from "./types";
import { error, updateQuery } from "@/helpers/utils";

export default {
  [TOGGLE](
    { commit, getters },
    { type = error("'type' is missing!"), enabled = null }
  ) {
    commit(TOGGLE, { type, enabled });
    updateQuery({ types: getters.selectedListTypes.join(",") });
  },
  [TOGGLE_ALL]({ commit, getters }) {
    commit(TOGGLE_ALL);
    updateQuery({ types: getters.selectedListTypes.join(",") });
  }
};
