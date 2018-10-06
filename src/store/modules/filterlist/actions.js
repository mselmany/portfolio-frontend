import { TOGGLE, TOGGLE_ALL } from "./types";
import { error } from "@/helpers/utils";
import router from "@/router";

export default {
  [TOGGLE](
    { commit, getters },
    { type = error("'type' is missing!"), enabled = null }
  ) {
    commit(TOGGLE, { type, enabled });
    updateQuery("types", getters.selectedListTypes);
  },
  [TOGGLE_ALL]({ commit, getters }) {
    commit(TOGGLE_ALL);
    updateQuery("types", getters.selectedListTypes);
  }
};

function updateQuery(queryName, types) {
  router.push({
    query: { [queryName]: types.join(",") }
  });
}
