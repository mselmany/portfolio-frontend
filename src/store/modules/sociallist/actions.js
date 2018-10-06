import { generateId, error } from "@/helpers/utils";
import { ADD, FETCH } from "./types";
import { LOADING, INIT } from "@/store/modules/common/types";
import Bucket from "@/api/Bucket";

import { getRamdomByTypeAsync } from "@/mock";
import mock from "@/mock/sociallist.json";

export default {
  async _INIT({ commit }) {
    const r = await Bucket.list({ filter: "dribbble" });
    commit(INIT, { data: r.data });
    commit(`filterlist/${INIT}`, { data: r.data }, { root: true });
  },
  async [FETCH](
    { commit },
    { type, to } = error("'type' or 'to' is missing!")
  ) {
    const id = generateId();
    commit(`common/${LOADING}`, id, { root: true });
    commit(ADD, { data: [await getRamdomByTypeAsync(mock, type)], to });
    commit(`common/${LOADING}`, id, { root: true });
  }
};
