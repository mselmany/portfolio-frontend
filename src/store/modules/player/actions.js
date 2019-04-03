import { TOGGLE, ADD, REMOVE } from "./types";
import { NOTIFY } from "@/store/modules/common/types";
import { error } from "@/helpers/utils";

export default {
  async [TOGGLE](
    { dispatch, commit, state },
    media = error("'media' is missing!")
  ) {
    const { id } = media;
    const isExist = state.list.find(item => item.id === id);

    if (isExist) {
      commit(REMOVE, id);
    } else {
      commit(ADD, media);
    }

    await dispatch(
      `common/${NOTIFY}`,
      {
        type: "success",
        overrides: {
          message: isExist ? "REMOVED_FROM_PLAYLIST" : "ADDED_TO_PLAYLIST"
        }
      },
      { root: true }
    );
  }
};
