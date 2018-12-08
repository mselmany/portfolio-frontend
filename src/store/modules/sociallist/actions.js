import { generateId, fetchQuery, delay } from "@/helpers/utils";
import { MARK_AS_VIEWED } from "./types";
import { LOADING, INIT } from "@/store/modules/common/types";
import Bucket from "@/api/Bucket";

export default {
  async _INIT({ commit, rootGetters }) {
    // fetch all
    const data = await Bucket.list();
    // detect successed items for filterlist and init it
    commit(`filterlist/${INIT}`, { data }, { root: true });
    // detect selected filterlist items by queryparams or default filterlist state
    let types = fetchQuery("types");
    types =
      (types && types.split(",").filter(t => t)) ||
      rootGetters["filterlist/selectedListTypes"];
    // store fetched data and proccess them
    commit(INIT, { data, types });
  },
  async [MARK_AS_VIEWED]({ commit }, { types, amount }) {
    const id = generateId();
    commit(`common/${LOADING}`, id, { root: true });
    // wait little bit (for UX/loading indicator)
    await delay();
    commit(MARK_AS_VIEWED, { types, amount });
    commit(`common/${LOADING}`, id, { root: true });
  }
};
