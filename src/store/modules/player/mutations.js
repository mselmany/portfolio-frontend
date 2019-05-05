import {
  REGISTER,
  TOGGLE_FROM_PLAYLIST,
  UPDATE_STATUS,
  UPDATE_CURRENT
} from "./types";
import { error, formatTime } from "@/helpers/utils";
import Vue from "vue";

export default {
  [REGISTER](
    state,
    {
      id = error("'id' is missing!"),
      type = error("'type' is missing!"),
      source = error("'source' is missing!"),
      meta = error("'meta' is missing!"),
      __state
    }
  ) {
    if (!state.all.hasOwnProperty(id)) {
      state.all[id] = Vue.observable({
        id,
        type,
        source,
        meta,
        __state: {
          initialized: false,
          playing: false,
          duration: 0,
          formattedDuration: "00:00",
          currentTime: 0,
          formattedCurrentTime: "00:00",
          percentage: 0,
          volume: 1,
          muted: false,
          addedToPlaylist: false,
          ...__state
        }
      });
    }
  },
  [TOGGLE_FROM_PLAYLIST](state, _id = error("'id' is missing!")) {
    const isCurrent = state.current && state.current.id === _id;
    let media = state.all[_id];
    if (media.__state.addedToPlaylist) {
      state.playlist = state.playlist.filter(({ id }) => id !== _id);
    } else {
      state.playlist = isCurrent
        ? [media, ...state.playlist]
        : [...state.playlist, media];
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
    let { id = null, duration = null, currentTime = null } = status;
    if (duration !== null) {
      status.formattedDuration = formatTime(duration);
    }
    if (currentTime !== null) {
      status.formattedCurrentTime = formatTime(currentTime);
    }

    if (id !== null) {
      state.all[id].__state = { ...state.all[id].__state, ...status };
    } else {
      state.current.__state = { ...state.current.__state, ...status };
    }
  }
};
