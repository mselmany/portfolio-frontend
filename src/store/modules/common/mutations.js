import { error, is } from "@/helpers/utils";
import {
  DELETE_NOTIFY,
  LOADING,
  SET_NOTIFY,
  TOGGLE_NOTIFICATION
} from "./types";

export default {
  [LOADING](state, id = null) {
    if (id) {
      state.loading.queue.includes(id)
        ? (state.loading.queue = state.loading.queue.filter(q => q !== id))
        : state.loading.queue.push(id);
      state.loading.pending = !!state.loading.queue.length;
    } else {
      state.loading.pending = !state.loading.pending;
    }
  },
  [SET_NOTIFY](state, { notification = error("'notification' is missing!") }) {
    is("Object", notification);
    state.notifications.list = [notification, ...state.notifications.list];
  },
  [DELETE_NOTIFY](state, { id = error("'id' is missing!") }) {
    is("String", id);
    state.notifications.list = state.notifications.list.filter(
      item => item.id !== id
    );
  },
  [TOGGLE_NOTIFICATION](state, enable = null) {
    state.notifications.enabled =
      enable !== null ? enable : !state.notifications.enabled;
  }
};
