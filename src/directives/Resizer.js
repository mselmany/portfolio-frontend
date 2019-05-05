/*
adds [sticky-element] attribute to itself
adds [sticky-container] to its parent element
creates new [stickt-placeholder] element as it's next sibling

{
  onDirectionChange: context => {
    console.log("onDirectionChange", context);
  },
  onChange: context => {
    console.log("onChange", context);
  }
};
*/

import { translate } from "@/plugins/Translate";
import { raf } from "@/helpers/utils.js";

export default {
  name: "Resizer",
  bind(el, binding, vnode) {
    if (el) {
      let options = typeof binding.value === "object" ? binding.value : {};

      if (options.hasOwnProperty("enabled") && !options.enabled) {
        return;
      }

      // el.$resizer = {};

      // const enable = callback => {
      //   vnode.context.$resizer.active = true;

      //   el.addEventListener("scroll", el.$sticky.onSticky, false);
      // };

      // vnode.context.$resizer = {
      //   enable,
      //   disable,
      //   options,
      //   active: false
      // };
    }
  },
  inserted(el, binding, vnode) {
    let options = typeof binding.value === "object" ? binding.value : {};

    if (options.hasOwnProperty("enabled") && !options.enabled) {
      return;
    }

    el.setAttribute("resizer-element", "");

    // create and append placeholder element to DOM
    const resizers = {
      top: document.createElement("div"),
      right: document.createElement("div"),
      bottom: document.createElement("div"),
      left: document.createElement("div"),
      topleft: document.createElement("div"),
      topright: document.createElement("div"),
      bottomright: document.createElement("div"),
      bottomleft: document.createElement("div")
    };

    Object.entries(resizers).forEach(([k, v]) => {
      v.setAttribute(`resizer-${k}`, "");
      el.append(v);
    });
    // placeholder.setAttribute("sticky-placeholder", translate("STICKY_MODE"));
    // placeholder.addEventListener("click", vnode.context.$sticky.disable, false);
    // el.parentNode.insertBefore(placeholder, el.nextSibling);

    // // if exist, find container element else set container to parent element
    // const container =
    //   el.closest("[sticky-container]") ||
    //   (el.parentElement.setAttribute("sticky-container", "") ||
    //     el.parentElement);

    // // cache sticky elements
    // vnode.context.$sticky = {
    //   ...vnode.context.$sticky,
    //   placeholder,
    //   container
    // };
  },
  unbind(el, binding, vnode) {
    if (el.$sticky.onSticky) {
      window.removeEventListener("resize", el.$sticky.setPlaceholder, false);
      window.removeEventListener("scroll", el.$sticky.onSticky, false);
    }
    delete el.$sticky;
    delete vnode.context.$sticky;
  }
};
