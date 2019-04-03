import { ADD, REMOVE } from "./types";
import { error } from "@/helpers/utils";

export default {
  [ADD](
    state,
    {
      id = error("'id' is missing!"),
      type = error("'type' is missing!"),
      source = error("'source' is missing!"),
      meta = error("'meta' is missing!"),
      actions = error("'actions' is missing!")
    }
  ) {
    state.list = [
      ...state.list,
      {
        id,
        type,
        source,
        meta,
        actions
      }
    ];
  },
  [REMOVE](state, _id) {
    state.list = state.list.filter(({ id }) => id !== _id);
  }
};
