export default {
  name: "GoBack",
  bind(el, binding, vnode) {
    if (el) {
      el.goBack = e => {
        let router = vnode.context.$router || window.history;
        e.preventDefault();
        window.history.length > 1 ? router.go(-1) : router.push("/");
      };
      el.addEventListener("click", el.goBack, false);
    }
  },
  unbind(el) {
    el.removeEventListener("click", el.goBack, false);
  }
};
