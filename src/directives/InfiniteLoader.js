/* 
"{
  handler: function(fetch), 
  limit: number(for max fetch at same time), 
  locked: boolean(for prevent fetching), 
  text: string(customized text), 
  suffix: string(for styling)
}" 

OR 

only "function"
*/

import { translate } from "@/plugins/Translate";

const defaults = {
  limit: 1,
  locked: false,
  suffix: null,
  text: translate("LOADING"),
  handler: null
};

export default {
  name: "InfiniteLoader",
  bind(el, binding, vnode) {
    if (el) {
      let options = { ...defaults };
      if (typeof binding.value === "object") {
        options = { ...defaults, ...binding.value };
      } else {
        options.handler = binding.value;
      }

      function isLoadable() {
        /*     
        //! windowun sonuna gelince...
        const doc = document.documentElement;
        const atBottom = () =>
          doc.scrollTop + doc.clientHeight >= doc.scrollHeight; 
        */

        //! elemanın sonuna gelince...
        const atBottom = () =>
          document.documentElement.clientHeight >=
          Math.round(el.getBoundingClientRect().bottom);
        const { loading } = vnode.context.$store.state.common;
        const inprogress = () =>
          loading.pending && loading.queue.length >= options.limit;

        return !(
          inprogress() ||
          !atBottom() ||
          options.locked ||
          el._state.destroyed
        );
      }

      async function loader() {
        // ! TODO@5: raf() metodunu kullan
        if (!isLoadable()) return;
        await options.handler();
        await loader();
      }

      const attribute = options.suffix
        ? binding.name + options.suffix
        : binding.name;

      el._state = { destroyed: false, options, loader, isLoadable, attribute };

      window.addEventListener("scroll", el._state.loader, false);
      window.addEventListener("resize", el._state.loader, false);
    }
  },
  inserted(el, binding, vnode) {
    setTimeout(() => {
      el._state.loader();
    });
  },
  update(el, binding, vnode, oldVnode) {
    if (vnode === oldVnode) return;
    const { options, isLoadable, loader, attribute } = el._state;
    const { loading } = vnode.context.$store.state.common;

    if (loading.pending) {
      el.setAttribute(attribute, options.text);
    } else {
      el.removeAttribute(attribute);
    }

    setTimeout(() => {
      if (isLoadable()) {
        loader();
      }
    });
  },
  unbind(el, binding, vnode) {
    const { attribute } = el._state;
    el._state.destroyed = true;
    el.removeAttribute(attribute);
    window.removeEventListener("scroll", el._state.loader, false);
    window.removeEventListener("resize", el._state.loader, false);
  }
};
