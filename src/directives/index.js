import Vue from "vue";

import GoBack from "./GoBack";
import InfiniteLoader from "./InfiniteLoader";
import Sticky from "./Sticky";
import Fullscreen from "./Fullscreen";

const directives = {
  GoBack,
  InfiniteLoader,
  Sticky,
  Fullscreen
};

Object.values(directives).forEach(directive => {
  Vue.directive(directive.name, directive);
});
