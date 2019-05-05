import Vue from "vue";
import Vuex from "vuex";

import common from "./modules/common";
import toolbox from "./modules/toolbox";
import filterlist from "./modules/filterlist";
import sociallist from "./modules/sociallist";
import player from "./modules/player";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

const modules = {
  common,
  toolbox,
  filterlist,
  sociallist,
  player
};

const store = new Vuex.Store({
  modules,
  strict: debug
});

// If exist, automatically run the `_INIT` action for every modules
for (const m of Object.keys(modules)) {
  if (modules[m].actions && modules[m].actions._INIT) {
    store.dispatch(`${m}/_INIT`);
  }
}

export default store;
