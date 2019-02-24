/*
adds [sticky-element] attribute to itself
adds [sticky-container] to its parent element
creates new [stickt-placeholder] element as it's next sibling

{
  onEnable: context => {
    console.log("onEnable", context);
  },
  onDisable: context => {
    console.log("onDisable", context);
  },
  onChange: context => {
    console.log("onChange", context);
  }
};
*/

import { translate } from "@/plugins/Translate";
import { raf, inViewport } from "@/helpers/utils.js";

export default {
  name: "Sticky",
  bind(el, binding, vnode) {
    if (el) {
      let options = typeof binding.value === "object" ? binding.value : {};

      if (options.hasOwnProperty("enabled") && !options.enabled) {
        return;
      }

      let _inviewChangeState;

      el.$sticky = {};

      el.$sticky.setPlaceholder = () => {
        raf(() => {
          const { placeholder: ph, container: sc } = vnode.context.$sticky;
          ph.style.width = window.getComputedStyle(sc).width;
          ph.style.height = window.getComputedStyle(sc).height;
        });
      };

      const enable = callback => {
        if (vnode.context.$sticky.active) return;

        el.$sticky.setPlaceholder();

        if (!el.$sticky.onSticky) {
          const { container } = vnode.context.$sticky;
          el.$sticky.onSticky = () => {
            // if element in view, sticky will be true else false
            raf(() => {
              const { inview, direction } = inViewport(container);

              // is pending state is different from previous state then update states
              if (_inviewChangeState !== inview) {
                vnode.context.$sticky.active = !inview;
                vnode.context.$sticky.direction = direction;
                _inviewChangeState = inview;
                if (!inview) {
                  container.setAttribute("sticky-active", direction);
                } else {
                  container.removeAttribute("sticky-active");
                }
                options.onChange && options.onChange(vnode.context.$sticky);
              }
            });
          };

          el.$sticky.onSticky();
          window.addEventListener("scroll", el.$sticky.onSticky, false);
          window.addEventListener("resize", el.$sticky.setPlaceholder, false);
        }

        options.onEnable && options.onEnable(vnode.context.$sticky);

        if (callback && callback instanceof Function) {
          callback();
        }
      };

      const disable = callback => {
        if (!vnode.context.$sticky.active) return;

        _inviewChangeState = true;
        vnode.context.$sticky.active = false;
        vnode.context.$sticky.direction = null;
        vnode.context.$sticky.container.removeAttribute("sticky-active");
        if (el.$sticky.onSticky) {
          window.removeEventListener(
            "resize",
            el.$sticky.setPlaceholder,
            false
          );
          window.removeEventListener("scroll", el.$sticky.onSticky, false);
          delete el.$sticky.onSticky;
        }

        options.onDisable && options.onDisable(vnode.context.$sticky);

        if (callback && callback instanceof Function) {
          callback();
        }
      };

      vnode.context.$sticky = {
        enable,
        disable,
        options,
        active: false,
        direction: null
      };
    }
  },
  inserted(el, binding, vnode) {
    let options = typeof binding.value === "object" ? binding.value : {};

    if (options.hasOwnProperty("enabled") && !options.enabled) {
      return;
    }

    el.setAttribute("sticky-element", "");

    // create and append placeholder element to DOM
    const placeholder = document.createElement("div");
    placeholder.setAttribute("sticky-placeholder", translate("STICKY_MODE"));
    placeholder.addEventListener("click", vnode.context.$sticky.disable, false);
    el.parentNode.insertBefore(placeholder, el.nextSibling);

    // if exist, find container element else set container to parent element
    const container =
      el.closest("[sticky-container]") ||
      (el.parentElement.setAttribute("sticky-container", "") ||
        el.parentElement);

    // cache sticky elements
    vnode.context.$sticky = {
      ...vnode.context.$sticky,
      placeholder,
      container
    };
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
