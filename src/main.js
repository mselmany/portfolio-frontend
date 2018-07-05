import Vue from "vue";
import { sync } from "vuex-router-sync";

import "./registerServiceWorker";
import App from "./App";
import router from "./router";
import store from "./store";
import "./components";
import "./directives";
import "./plugins";

sync(store, router);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
