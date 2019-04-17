import {
  REGISTER,
  TOGGLE_FROM_PLAYLIST,
  UPDATE_STATUS,
  UPDATE_CURRENT,
  CREATE_AUDIO
} from "./types";
import { error } from "@/helpers/utils";

export default {
  [REGISTER](
    state,
    {
      id = error("'id' is missing!"),
      type = error("'type' is missing!"),
      source = error("'source' is missing!"),
      meta = error("'meta' is missing!"),
      __state = {},
      override = false
    }
  ) {
    if (!state.all.hasOwnProperty(id) || override) {
      state.all[id] = { id, type, source, meta, __state };
    }
  },
  [TOGGLE_FROM_PLAYLIST](state, _id = error("'id' is missing!")) {
    let media = state.all[_id];
    if (media.__state.addedToPlaylist) {
      state.playlist = state.playlist.filter(({ id }) => id !== _id);
    } else {
      state.playlist = [...state.playlist, media];
    }
    media.__state.addedToPlaylist = !media.__state.addedToPlaylist;
  },
  [UPDATE_CURRENT](state, _id = error("'id' is missing!")) {
    if (state.current && state.current.id !== _id) {
      state.current.source && state.current.source.pause();
    }
    state.current = state.all[_id];
  },
  [UPDATE_STATUS](state, status) {
    state.current.__state = { ...state.current.__state, ...status };
  }
};
