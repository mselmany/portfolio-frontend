export default {
  activeToolbox({ routes }) {
    return routes.find(route => route.active);
  },
  activeButton({ buttons }) {
    return buttons.find(button => button.active);
  },
  buttons({ buttons }, { activeToolbox }) {
    return buttons.filter(b => {
      for (const key of activeToolbox.buttons) {
        if (key === b.name) return true;
      }
    });
  }
};
