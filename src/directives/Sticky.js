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

      const _setPlaceholderSync = () => {
        const { placeholder: ph, container: sc } = vnode.context.$sticky;
        ph.style.width = window.getComputedStyle(sc).width;
        ph.style.height = window.getComputedStyle(sc).height;
      };

      el.$sticky.setPlaceholder = () => {
        raf(_setPlaceholderSync);
      };

      const enable = callback => {
        vnode.context.$sticky.active = true;

        _setPlaceholderSync();

        if (!el.$sticky.onSticky) {
          const { container } = vnode.context.$sticky;
          // if element in view, sticky will be true else false
          const isInViewport = () => {
            let { inview, direction } = inViewport(container);

            // if pending state is different from previous state then update states
            if (_inviewChangeState !== inview) {
              vnode.context.$sticky.direction = direction;
              _inviewChangeState = inview;
              if (!inview && direction) {
                container.setAttribute("sticky-active", direction);
              } else {
                container.removeAttribute("sticky-active");
              }
              if (
                options.onDirectionChange &&
                options.onDirectionChange instanceof Function
              ) {
                options.onDirectionChange(vnode.context.$sticky);
              }
            }
          };

          el.$sticky.onSticky = () => {
            raf(isInViewport);
          };

          isInViewport();
          window.addEventListener("scroll", el.$sticky.onSticky, false);
          window.addEventListener("resize", el.$sticky.setPlaceholder, false);
        }

        if (options.onChange && options.onChange instanceof Function) {
          options.onChange(vnode.context.$sticky);
        }
        if (callback && callback instanceof Function) {
          callback();
        }
      };

      const disable = callback => {
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

        if (options.onChange && options.onChange instanceof Function) {
          options.onChange(vnode.context.$sticky);
        }

        if (callback) {
          if (callback instanceof Function) {
            callback();
          } else if (callback instanceof Object) {
            const { scrollTo } = callback;
            if (scrollTo && scrollTo instanceof HTMLElement) {
              setTimeout(() => {
                scrollTo.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                  inline: "center"
                });
              });
            }
          }
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
