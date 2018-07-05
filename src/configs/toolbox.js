export default {
  routes: [
    {
      name: "home",
      buttons: ["menu"]
    },
    {
      name: "social",
      buttons: ["menu", "filter", "back"]
    },
    {
      name: "resume",
      buttons: ["menu", "back"]
    },
    {
      name: "projects",
      buttons: ["menu", "back"]
    },
    {
      name: "articles",
      buttons: ["menu", "back"]
    }
  ],
  buttons: [
    {
      name: "menu",
      icon: {
        default: "__menu",
        active: "__close"
      },
      label: {
        default: "MENU",
        hover: "OPEN_MENU",
        active: "CLOSE_MENU"
      },
      action(context) {
        console.log(this.name, "tetiklendi");
      }
    },
    {
      name: "filter",
      icon: {
        default: "__filter",
        active: "__close"
      },
      label: {
        default: "FILTERS",
        hover: "OPEN_FILTERS",
        active: "CLOSE_FILTERS"
      }
    },
    {
      name: "unselect",
      icon: {
        default: "__unselect",
        active: "__tick"
      },
      label: {
        default: "SELECT",
        hover: "OPEN_SELECTORS",
        active: "CLOSE_SELECTORS"
      }
    },
    {
      name: "back",
      icon: {
        default: "__back"
      },
      label: {
        default: "BACK",
        hover: "GO_BACK"
      },
      action(context) {
        context.$router.push({ name: "home" });
      }
    }
  ]
};
