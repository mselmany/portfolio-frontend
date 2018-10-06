import { ACTIVATE_BY_TOOLBOX, TOGGLE_BUTTON } from "./types";
import { error, is } from "@/helpers/utils";

export default {
  [ACTIVATE_BY_TOOLBOX]({ routes }, name = error("'name' is missing!")) {
    is("String", name);
    routes
      .map(r => {
        r.active = false;
        return r;
      })
      .find(r => r.name === name).active = true;
  },
  [TOGGLE_BUTTON]({ buttons }, { name = error("'name' is missing!") }) {
    is("String", name);
    buttons.map(button => {
      if (button.name !== name && button.active) button.active = false;
      if (button.name === name) button.active = !button.active;
      return button;
    });
  }
};
