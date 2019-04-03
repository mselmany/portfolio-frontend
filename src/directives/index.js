import Vue from "vue";

import GoBack from "./GoBack";
import InfiniteLoader from "./InfiniteLoader";
import Sticky from "./Sticky";
import Fullscreen from "./Fullscreen";
import Resizer from "./Resizer";

const directives = {
  GoBack,
  InfiniteLoader,
  Sticky,
  Fullscreen,
  Resizer
};

Object.values(directives).forEach(directive => {
  Vue.directive(directive.name, directive);
});
