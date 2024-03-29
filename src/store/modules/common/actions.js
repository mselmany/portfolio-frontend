import {
  DELETE_NOTIFY,
  NOTIFY,
  SET_NOTIFY,
  TOGGLE_NOTIFICATION
} from "./types";
import { generateId } from "@/helpers/utils";
import global from "@/global";
import { notifications } from "@/configs";

let TOGGLE_NOTIFICATION_processing = false;

export default {
  async [NOTIFY]({ commit, state }, { type, overrides = null } = {}) {
    if (!state.notifications.enabled) return;
    let notification = notifications.hasOwnProperty(type)
      ? { ...notifications[type] }
      : { ...notifications["unknown"] };
    if (overrides) {
      notification = { ...notification, ...overrides };
    }
    let id = generateId();
    notification.id = id;
    commit(SET_NOTIFY, { notification });
    return new Promise(resolve => {
      setTimeout(
        () => resolve(commit(DELETE_NOTIFY, { id })),
        global.notificationDelay
      );
    });
  },
  async [TOGGLE_NOTIFICATION]({ dispatch, commit, state }, enable = null) {
    if (TOGGLE_NOTIFICATION_processing) return;
    TOGGLE_NOTIFICATION_processing = true;
    const isEnabled = state.notifications.enabled;
    !isEnabled && commit(TOGGLE_NOTIFICATION, enable);
    await dispatch(NOTIFY, {
      type: "warn",
      overrides: {
        message: !isEnabled ? "NOTIFICATION_ENABLED" : "NOTIFICATION_DISABLED"
      }
    });
    isEnabled && commit(TOGGLE_NOTIFICATION, enable);
    TOGGLE_NOTIFICATION_processing = false;
  }
};
