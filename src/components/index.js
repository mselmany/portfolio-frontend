import Vue from "vue";

import atoms from "./atoms";
import molecules from "./molecules";

import Dribbble from "./Dribbble";
import Twitter from "./Twitter";
import Soundcloud from "./Soundcloud";

import Toolbox from "./Toolbox";
import SidebarMenu from "./SidebarMenu";
import FilterList from "./FilterList";
import SocialList from "./SocialList";
import LoaderButton from "./LoaderButton";
import Notification from "./Notification";
import InfiniteLoader from "./InfiniteLoader";
import Player from "./Player";

const socialitems = {
  Dribbble,
  Twitter,
  Soundcloud
};

const components = {
  ...atoms,
  ...molecules,
  ...socialitems,
  Toolbox,
  SidebarMenu,
  FilterList,
  SocialList,
  LoaderButton,
  Notification,
  InfiniteLoader,
  Player
};

Object.values(components).forEach(component => {
  Vue.component(component.name, component);
});

export default components;
