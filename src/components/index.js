import Vue from "vue";

import Toolbox from "./Toolbox";
import SidebarMenu from "./SidebarMenu";
import FilterList from "./FilterList";
import SocialList from "./SocialList";
import SocialItem from "./SocialItem";
import LoaderButton from "./LoaderButton";
import Notification from "./Notification";
import InfiniteLoader from "./InfiniteLoader";
import HoverCard from "./HoverCard";

const components = {
  Toolbox,
  SidebarMenu,
  FilterList,
  SocialList,
  SocialItem,
  LoaderButton,
  Notification,
  InfiniteLoader,
  HoverCard
};

Object.values(components).forEach(component => {
  Vue.component(component.name, component);
});

export default components;
