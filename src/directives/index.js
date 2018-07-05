import Vue from "vue";

import GoBack from "./GoBack";
import InfiniteLoader from "./InfiniteLoader";

const directives = {
  GoBack,
  InfiniteLoader
};

Object.values(directives).forEach(directive => {
  Vue.directive(directive.name, directive);
});
