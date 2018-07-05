<template>
  <div class="Toolbox" :class="{'__Active': activeButton, '__MenuActive': isMenuActive, '__FilterActive': isFilterActive}">
    <div class="_Box">
      <button class="_Button" v-for="(item, index) in buttons" :key="index" @click="toggle(item)" :class="{'__Active': item.active}" :data-label="$t(item.label.default)" :data-label__hover="$t(item.label.hover)" :data-label__active="$t(item.label.active)">
        <div class="Icon _Icon __default" :class="[item.icon.default]"></div>
        <div class="Icon _Icon __active" :class="[item.icon.active]"></div>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { TOGGLE_BUTTON } from "@/store/modules/toolbox/types";
import router from "@/router";
import store from "@/store";

router.beforeEach((to, from, next) => {
  // TODO@5: her sayfa için toolbox.js de button tanımı olmayabilir, bu durumlar için default button ayarla
  if (from.name !== to.name) {
    store.commit("toolbox/ACTIVATE_BY_TOOLBOX", to.name);
  }
  next();
});

export default {
  name: "Toolbox",
  langs: {
    MENU: {
      tr: "Menü",
      en: "Menu"
    },
    OPEN_MENU: {
      tr: "Menüyü aç",
      en: "Open menu"
    },
    CLOSE_MENU: {
      tr: "Menüyü kapat",
      en: "Close menu"
    },
    FILTERS: {
      tr: "Filtre",
      en: "Filter"
    },
    OPEN_FILTERS: {
      tr: "Filtreyi aç",
      en: "Open filter"
    },
    CLOSE_FILTERS: {
      tr: "Filtreyi kapat",
      en: "Close filter"
    },
    SELECT: {
      tr: "Seç",
      en: "Select"
    },
    OPEN_SELECTORS: {
      tr: "Seçiciyi aç",
      en: "Open selectors"
    },
    CLOSE_SELECTORS: {
      tr: "Seçiciyi kapat",
      en: "Close selectors"
    },
    BACK: {
      tr: "Geri",
      en: "Back"
    },
    GO_BACK: {
      tr: "Geri git",
      en: "Go back"
    }
  },
  computed: {
    ...mapGetters("toolbox", ["activeButton", "buttons"]),
    isMenuActive() {
      return this.activeButton && this.activeButton.name === "menu";
    },
    isFilterActive() {
      return this.activeButton && this.activeButton.name === "filter";
    }
  },
  methods: {
    ...mapMutations("toolbox", [TOGGLE_BUTTON]),
    toggle(item) {
      if (!item.hasOwnProperty("notoggle")) {
        this[TOGGLE_BUTTON]({ name: item.name });
      }
      if (typeof item.action === "function") {
        item.action(this);
      }
    }
  }
};
</script>

<style lang="postcss" scoped>
@import url("../styles/variables.css");
.Toolbox {
  --Size: var(--Toolbox_Size);
  --Padding: var(--DefaultLayoutPadding);
  --BackgroundColor: var(--DefaultColor);
  --FontSize: var(--Toolbox_FontSize);
  --Transition: var(--DefaultTransition);
  font-size: 1rem;
  width: calc(var(--Size) * 4);
  position: absolute;
  top: var(--Padding);
  right: calc(var(--Size) * -2);
  z-index: 3;
  user-select: none;
  transition: var(--Transition);

  @media (--DesktopSmall) {
    & {
      top: var(--Size);
      right: calc(var(--Size) * -4);
      &.__MenuActive.__MenuActive {
        top: var(--Padding);
        right: calc(var(--Size) * -2);
      }
    }
  }

  & ._Box {
    width: 50%;
    position: relative;
    margin: 0 25%;
    clear: fix;
  }
  & ._Button {
    width: var(--Size);
    height: var(--Size);
    position: relative;
    float: left;
    background-color: var(--BackgroundColor);
    cursor: pointer;
    &:before,
    &:after {
      width: 100%;
      max-height: 100%;
      position: absolute;
      top: 50%;
      line-height: calc(var(--Size) / 2.5);
      font-size: var(--FontSize);
      font-weight: 500;
      transition: var(--Transition);
      pointer-events: none;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    &[data-label]:before {
      content: attr(data-label);
      transform: translateY(-50%);
      opacity: 1;
      visibility: visible;
    }
    &[data-label__hover]:after {
      content: attr(data-label__hover);
      transform: translateY(-25%);
      opacity: 0;
      visibility: hidden;
    }
    &:hover {
      &:before {
        transform: translateY(-75%);
        opacity: 0;
        visibility: hidden;
      }
      &:after {
        transform: translateY(-50%);
        opacity: 1;
        visibility: visible;
      }
    }
    &:nth-child(2n + 1) {
      &:before,
      &:after {
        padding-right: 25%;
        left: -100%;
        text-align: right;
      }
    }
    &:nth-child(2n + 2) {
      &:before,
      &:after {
        padding-left: 25%;
        right: -100%;
        text-align: left;
      }
    }

    &.__Active {
      &[data-label__active] {
        &:before {
          content: attr(data-label__active);
          transform: translateY(-50%);
          opacity: 1;
          visibility: visible;
        }
        &:after {
          transform: translateY(-25%);
          opacity: 0;
          visibility: hidden;
        }
      }
      & ._Icon {
        &.__default {
          transform: scale(0.2);
          opacity: 0;
          visibility: hidden;
        }
        &.__active {
          transform: scale(1);
          opacity: 1;
          visibility: visible;
        }
      }
    }
  }
  & ._Icon {
    transition: var(--Transition);
    &.__default {
      transform: scale(1);
      opacity: 1;
      visibility: visible;
    }
    &.__active {
      transform: scale(0.2);
      opacity: 0;
      visibility: hidden;
    }
  }

  &.__Active {
    & :not(.__Active)._Button[data-label]:before {
      transform: translateY(-75%);
      opacity: 0;
      visibility: hidden;
    }
  }
  &.__MenuActive {
  }
  &.__FilterActive {
  }
}
</style>
