import { generateId, error } from "@/helpers";
import { ADD, FETCH } from "./types";
import { LOADING } from "@/store/modules/common/types";

import { getRamdomByTypeAsync } from "@/mock";
import mock from "@/mock/sociallist.json";

const _LOADING = `common/${LOADING}`;

export default {
  async [FETCH](
    { commit },
    { type, to } = error("'type' or 'to' is missing!")
  ) {
    const id = generateId();
    commit(_LOADING, id, { root: true });
    commit(ADD, { data: [await getRamdomByTypeAsync(mock, type)], to });
    commit(_LOADING, id, { root: true });
  }
};
