import Vue from "vue";
import Vuex from "vuex";

import common from "./modules/common";
import toolbox from "./modules/toolbox";
import filterlist from "./modules/filterlist";
import sociallist from "./modules/sociallist";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: {
    common,
    toolbox,
    filterlist,
    sociallist
  },
  strict: debug
});
