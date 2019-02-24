import Vue from "vue";
import { sync } from "vuex-router-sync";

import "@/pollyfils";
import "@/registerServiceWorker";
import App from "@/App";
import router from "@/router";
import store from "@/store";
import { api } from "@/api";
import "@/components";
import "@/directives";
import "@/plugins";

sync(store, router);

Vue.config.productionTip = false;
Vue.prototype.$api = api;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
