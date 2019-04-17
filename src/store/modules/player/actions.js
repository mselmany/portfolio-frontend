import { TOGGLE_FROM_PLAYLIST } from "./types";
import { NOTIFY } from "@/store/modules/common/types";
import { error } from "@/helpers/utils";

export default {
  async [TOGGLE_FROM_PLAYLIST](
    { dispatch, commit, state },
    _id = error("'id' is missing!")
  ) {
    let media = state.all[_id];
    if (media) {
      commit(TOGGLE_FROM_PLAYLIST, _id);
      // media.addedToPlaylist = !media.addedToPlaylist;

      await dispatch(
        `common/${NOTIFY}`,
        {
          type: "success",
          overrides: {
            message: media.__state.addedToPlaylist
              ? "REMOVED_FROM_PLAYLIST"
              : "ADDED_TO_PLAYLIST"
          }
        },
        { root: true }
      );
    } else {
      error(_id + " is not registered to 'player' store!");
    }
  }
};
