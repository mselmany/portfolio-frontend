/*
adds [fullscreen-element][fullscreen-active] attributes to itself
creates new [fullscreen-placeholder] element as it's next sibling

{
  onEnable: context => {
    console.log("onEnable", context);
  },
  onDisable: context => {
    console.log("onDisable", context);
  },
  onChange: context => {
    console.log("onChange", context);
  },
  onKeydown: (key, context) => {
    console.log("onKeydown", key, context);
  }
};
*/

import { translate } from "@/plugins/Translate";
import { raf } from "@/helpers/utils.js";

export default {
  name: "Fullscreen",
  bind(el, binding, vnode) {
    if (el) {
      let options = typeof binding.value === "object" ? binding.value : {};

      if (options.hasOwnProperty("enabled") && !options.enabled) {
        return;
      }

      el.$fullscreen = {};

      el.$fullscreen.setPlaceholder = () => {
        raf(_setPlaceholderSync);
      };

      const _setPlaceholderSync = () => {
        const ph = vnode.context.$fullscreen.placeholder;
        ph.style.width = window.getComputedStyle(el).width;
        ph.style.height = window.getComputedStyle(el).height;
      };

      const enable = callback => {
        vnode.context.$fullscreen.active = true;

        _setPlaceholderSync();

        el.setAttribute("fullscreen-active", "");

        if (!el.$fullscreen.onKeydown) {
          el.$fullscreen.onKeydown = e => {
            e.preventDefault();
            const key = e.keyCode || e.which;

            options.onKeydown &&
              options.onKeydown(key, vnode.context.$fullscreen);
          };

          window.addEventListener("keydown", el.$fullscreen.onKeydown, false);
          window.addEventListener(
            "resize",
            el.$fullscreen.setPlaceholder,
            false
          );
        }

        if (!el.$fullscreen.onScroll) {
          el.$fullscreen.onScroll = () => {
            disable();
          };
          window.addEventListener("scroll", el.$fullscreen.onScroll, false);
        }

        options.onEnable && options.onEnable(vnode.context.$fullscreen);

        if (callback && callback instanceof Function) {
          callback();
        }
      };

      const disable = callback => {
        vnode.context.$fullscreen.active = false;

        el.removeAttribute("fullscreen-active", "");

        // remove listeners on fullscreen exit
        if (el.$fullscreen.onKeydown) {
          window.removeEventListener(
            "keydown",
            el.$fullscreen.onKeydown,
            false
          );
          window.removeEventListener(
            "resize",
            el.$fullscreen.setPlaceholder,
            false
          );
          delete el.$fullscreen.onKeydown;
        }

        if (el.$fullscreen.onScroll) {
          window.removeEventListener("scroll", el.$fullscreen.onScroll, false);
          delete el.$fullscreen.onScroll;
        }

        options.onDisable && options.onDisable(vnode.context.$fullscreen);

        if (callback && callback instanceof Function) {
          callback();
        }
      };

      const toggle = () => {
        if (vnode.context.$fullscreen.active) {
          disable();
        } else {
          enable();
        }
        options.onChange && options.onChange(vnode.context.$fullscreen);
      };

      vnode.context.$fullscreen = {
        enable,
        disable,
        toggle,
        options,
        active: false
      };
    }
  },
  inserted(el, binding, vnode) {
    let options = typeof binding.value === "object" ? binding.value : {};

    if (options.hasOwnProperty("enabled") && !options.enabled) {
      return;
    }

    el.setAttribute("fullscreen-element", "");

    // create and append placeholder element to DOM
    const placeholder = document.createElement("div");
    placeholder.setAttribute(
      "fullscreen-placeholder",
      translate("FULLSCREEN_MODE")
    );
    el.parentNode.insertBefore(placeholder, el.nextSibling);

    // cache fullscreen elements
    vnode.context.$fullscreen = {
      ...vnode.context.$fullscreen,
      placeholder
    };
  },
  unbind(el, binding, vnode) {
    if (el.$fullscreen.onKeydown) {
      window.removeEventListener("keydown", el.$fullscreen.onKeydown, false);
      window.removeEventListener(
        "resize",
        el.$fullscreen.setPlaceholder,
        false
      );
    }
    if (el.$fullscreen.onScroll) {
      window.removeEventListener("scroll", el.$fullscreen.onScroll, false);
    }
    delete el.$fullscreen;
    delete vnode.context.$fullscreen;
  }
};
