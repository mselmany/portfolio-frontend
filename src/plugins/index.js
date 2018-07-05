import Vue from "vue";
import global from "@/global";

import Translate, { translate } from "./Translate";

Vue.use(Translate, { locale: global.language });

export { translate };
