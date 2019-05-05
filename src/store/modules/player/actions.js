import {
  TOGGLE_FROM_PLAYLIST,
  REGISTER,
  UPDATE_STATUS,
  UPDATE_CURRENT
} from "./types";
import { NOTIFY } from "@/store/modules/common/types";
import { error } from "@/helpers/utils";

export default {
  async [TOGGLE_FROM_PLAYLIST](
    { dispatch, commit, getters },
    id = error("'id' is missing!")
  ) {
    commit(TOGGLE_FROM_PLAYLIST, id);

    let media = getters.getMedia(id);
    let addedToPlaylist = media.__state.addedToPlaylist;

    let message = addedToPlaylist
      ? "ADDED_TO_PLAYLIST"
      : "REMOVED_FROM_PLAYLIST";
    let icon =
      "__white " +
      (addedToPlaylist ? "__addedToPlaylist" : "__removeFromPlaylist");

    await dispatch(
      `common/${NOTIFY}`,
      {
        type: "success",
        overrides: {
          message,
          parameters: [media.meta.title],
          icon
        }
      },
      { root: true }
    );
  },
  [REGISTER]({ commit }, data) {
    const { id } = data;

    let audio = document.createElement("audio");
    audio.setAttribute("preload", "metadata");
    audio.src = data.src;
    // audio.src = require("@/mock/assets/Budakid ft. Nordfold - Granny(MP3_160K).mp3");

    audio.addEventListener("loadedmetadata", function() {
      let { duration } = audio;

      updateStatus({ duration, initialized: true });
    });

    audio.addEventListener("volumechange", function() {
      let { volume, muted } = audio;

      updateStatus({ volume, muted });
    });

    audio.addEventListener("timeupdate", function() {
      let { duration, currentTime, paused, ended } = audio;
      let percentage = Math.floor((currentTime / duration) * 100);
      let playing = !(paused || ended);

      updateStatus({ currentTime, percentage, playing });
    });

    audio.addEventListener("play", function() {
      updateStatus({ playing: true });

      commit(UPDATE_CURRENT, id);
    });

    audio.addEventListener("pause", function() {
      updateStatus({ playing: false });
    });

    commit(REGISTER, { ...data, source: audio });

    function updateStatus(statuses) {
      commit(UPDATE_STATUS, {
        id,
        ...statuses
      });
    }
  }
};
