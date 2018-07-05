<template>
  <section class="FilterList" :class="{'__Active': isFilterActive, '__AllSelected': selectedList.length === lists.length}">
    <div class="_ScrollWrapper">
      <div class="_Selections">
        <div class="_Amount" v-if="allSelected">{{$t("ALL_ITEMS_SELECTED")}}</div>
        <div class="_Amount" v-if="!allSelected">{{$t("ITEMS_SELECTED",[`${selectedList.length}/${lists.length}`, oneSelected ? "@ITEM" : "@ITEMS"])}}</div>
        <div class="_Text">{{selectedsText}}</div>
      </div>
      <ol class="_List">
        <li class="_Item __button" :class="{'__Selected': selectedList.length === lists.length, '__Shuffled': selectedList.length && selectedList.length !== lists.length}" @click="toggleAll()" @contextmenu="toggleAll($event)">
          <div class="_Logo"></div>
          <div class="_Name">
            <span>{{$t("TOGGLE")}}</span>
          </div>
          <div class="_Description">
            <span>{{$t(allSelected ? "UNSELECT_ALL" : "SELECT_ALL")}}</span>
            <div class="_Status">
              <div class="_Icon __shuffle Icon __circle"></div>
              <div class="_Icon __selected Icon __tick"></div>
              <div class="_Icon __hover Icon __unselect"></div>
            </div>
          </div>
        </li>
        <li class="_Item __withCounter" v-for="(item, index) in lists" :key="index" @click="toggle(item)" @contextmenu="toggleAll($event)" :class="{'__Selected': item.selected}">
          <div class="_Logo">
            <div class="_Icon Icon" :class="item.icon"></div>
          </div>
          <div class="_Name">
            <div>
              <span :data-length="filteredLength([item.name.toLowerCase()]) || null">{{item.name}}</span>
            </div>
          </div>
          <div class="_Description">
            <span>{{$t("AS", [item.description])}}</span>
            <div class="_Status">
              <div class="_Icon __selected Icon __tick"></div>
              <div class="_Icon __hover Icon __unselect"></div>
            </div>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { TOGGLE, TOGGLE_ALL } from "@/store/modules/filterlist/types";

export default {
  name: "FilterList",
  langs: {
    SELECT_ONE: {
      tr: "En az bir öğe seçin.",
      en: "Select at least 1 item."
    },
    ITEMS_SELECTED: {
      tr: "$0 $1 seçildi.",
      en: "$0 $1 selected."
    },
    ALL_ITEMS_SELECTED: {
      tr: "Tüm öğeler seçildi.",
      en: "All items selected."
    },
    ITEM: {
      tr: "öğe",
      en: "item"
    },
    ITEMS: {
      tr: "öğe",
      en: "items"
    },
    AND: {
      tr: " ve",
      en: " and"
    },
    FILTERED: {
      tr: " filtrelendi.",
      en: " filtered."
    },
    TOGGLE: {
      tr: "Seç",
      en: "Select"
    },
    SELECT_ALL: {
      tr: "Hepsini seç",
      en: "Select all"
    },
    UNSELECT_ALL: {
      tr: "Seçimi kaldır",
      en: "Unselect all"
    },
    AS: {
      tr: "$0 olarak",
      en: "as $0"
    }
  },
  computed: {
    ...mapGetters("toolbox", ["activeButton"]),
    ...mapGetters("filterlist", ["selectedList"]),
    ...mapGetters("sociallist", ["filteredLength"]),
    ...mapState("filterlist", ["lists"]),
    isFilterActive() {
      return this.activeButton && this.activeButton.name === "filter";
    },
    oneSelected() {
      return this.selectedList.length === 1;
    },
    allSelected() {
      return this.lists.length === this.selectedList.length;
    },
    selectedsText() {
      if (!this.selectedList.length) return this.$t("SELECT_ONE");
      var s;
      return (
        this.selectedList
          .reduce((total, item, index) => {
            if (index <= 1) {
              return (s = total + ", " + item.name);
            } else if (index > 1) {
              return s + this.$t("AND") + " +" + (this.selectedList.length - 2);
            }
          }, "")
          .substring(2) + this.$t("FILTERED")
      );
    }
  },
  methods: {
    ...mapActions("filterlist", [TOGGLE, TOGGLE_ALL]),
    toggle(item) {
      this[TOGGLE]({
        type: item.type
      });
    },
    toggleAll(e) {
      if (e) {
        e.preventDefault();
      }
      this[TOGGLE_ALL]();
    }
  }
};
</script>

<style lang="postcss" scoped>
@import url("../styles/variables.css");
.FilterList {
  --Size: var(--FilterList_Size);
  --Color: var(--DefaultColor);
  --ColorContrast: var(--DefaultBackgroundColor);
  --Padding: calc(var(--DefaultLayoutPadding) / 1.5);
  --FontSize: var(--FilterList_FontSize);
  --DotSize: var(--FilterList_DotSize);
  --Transition: var(--DefaultTransition);
  --BorderColor: var(--DefaultBorderColor);
  font-size: 1rem;
  width: var(--Size);
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1;
  background: var(--Color);
  color: var(--ColorContrast);
  background: linear-gradient(
    180deg,
    color-mod(var(--Color) l(+30%)) 0%,
    var(--Color) 100%
  );
  background: radial-gradient(
    circle at top left,
    color-mod(var(--Color) l(+30%)),
    var(--Color)
  );
  user-select: none;
  transform: translateX(100%);
  opacity: 0;
  visibility: hidden;
  transition: var(--Transition);
  transition-property: transform, opacity, visibility;
  will-change: transform, opacity, visibility;

  & ._ScrollWrapper {
    width: 100%;
    height: 100%;
    position: relative;
    overflow-x: hidden;
  }

  & ._Selections {
    width: 100%;
    padding: calc(var(--Padding) / 2) var(--Padding);
    position: relative;
    z-index: 1;
    &::after {
      content: "";
      width: 25%;
      height: 0;
      position: absolute;
      left: var(--Padding);
      bottom: 0;
      border-bottom: var(--DotSize) solid var(--ColorContrast);
      opacity: 0.1;
    }

    & ._Amount,
    & ._Text {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    & ._Text {
      /* font-style: italic; */
      opacity: 0.5;
    }
  }

  & ._List {
    counter-reset: _List;
    margin: 0;
    padding: 0;
    padding-top: calc(var(--Padding) / 2);
    position: relative;
    z-index: 0;
    & ._Item {
      display: block;
      padding: calc(var(--Padding) / 4) var(--Padding);
      position: relative;
      z-index: 1;
      cursor: pointer;
      /* transition: var(--Transition); */
      &:hover {
        background-color: color-mod(var(--Color) l(-4%));
      }
      &.__button {
        text-transform: uppercase;
        & ._Name:before {
          content: "↓";
        }
      }
      &.__withCounter {
        counter-increment: _List;
      }
      &:matches(.__Selected, .__Shuffled) {
        background-color: color-mod(var(--Color) l(-2%));
        &.__withLine:not(:last-child)::after {
          content: "";
          width: 72%;
          height: 0;
          position: absolute;
          left: 14%;
          bottom: 0;
          border-bottom: var(--DotSize) solid var(--ColorContrast);
          opacity: 0.05;
        }
        & ._Logo ._Icon {
          filter: none;
        }
        & ._Description ._Icon {
          filter: brightness(0) invert(1);
        }
      }
      &.__Selected {
        & ._Icon {
          &.__selected {
            transform: translateZ(0.1px) scale(1);
            opacity: 1;
            visibility: visible;
          }
        }
        &:hover {
          & ._Icon {
            &.__shuffle,
            &.__selected {
              transform: translateZ(0.1px) scale(0.2);
              opacity: 0;
              visibility: hidden;
            }
            &.__hover {
              transform: translateZ(0.1px) scale(1);
              opacity: 1;
              visibility: visible;
            }
          }
        }
      }
      &.__Shuffled {
        & ._Icon {
          &.__shuffle {
            transform: translateZ(0.1px) scale(1);
            opacity: 1;
            visibility: visible;
          }
        }
        &:hover {
          & ._Icon {
            &.__shuffle,
            &.__hover {
              transform: translateZ(0.1px) scale(0.2);
              opacity: 0;
              visibility: hidden;
            }
            &.__selected {
              transform: translateZ(0.1px) scale(1);
              opacity: 1;
              visibility: visible;
            }
          }
        }
      }
    }
    & ._Logo {
      display: block;
      width: 1.5em;
      height: 1.5em;
      position: absolute;
      top: calc(var(--Padding) / 4);
      top: 50%;
      right: var(--Padding);
      transform: translateZ(0.1px) translateY(-50%);
      & ._Icon {
        /* transition: var(--Transition); */
        filter: brightness(0) invert(1);
      }
    }
    & ._Name,
    & ._Description {
      padding: 0 1.5em;
      position: relative;
      & > * {
        display: block;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    & ._Name {
      &:before {
        content: counter(_List, decimal);
        display: block;
        max-width: 5ch;
        position: absolute;
        top: 0;
        right: 100%;
        transform: translateX(1.5ch);
        /* font-style: italic; */
        text-align: right;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        /* opacity: 0.5; */
      }
      & [data-length] {
        position: relative;
        font-weight: 500;
        &:after {
          content: attr(data-length);
          min-width: 2.25ch;
          padding: 0 0.5ch;
          position: absolute;
          top: 0;
          right: 0;
          transform: translateX(100%) translateX(0.5em) translateZ(0)
            scale(0.75);
          border-radius: 2.25ch;
          text-align: center;
          background-color: color-mod(var(--ColorContrast) a(0.4));
          color: var(--Color);
          /* opacity: 0.75; */
        }
      }
    }
    & ._Description {
      & span {
        /* font-style: italic; */
        opacity: 0.5;
      }
      & ._Status {
        display: block;
        width: 2ch;
        height: 100%;
        position: absolute;
        top: 0;
        right: 100%;
        transform: translateZ(0.1px) translateX(1.5ch);
        text-align: right;
        & ._Icon {
          background-position-x: right;
          transition: var(--Transition);
          transform: translateZ(0.1px) scale(0.2);
          opacity: 0;
          visibility: hidden;
          will-change: transform, opacity, visibility;
        }
      }
    }
  }
  &.__AllSelected {
    background: var(--ColorContrast);
    color: var(--Color);
    /* box-shadow: calc(var(--DotSize) * -1) 0 0 0 var(--BorderColor); */
    box-shadow: calc(var(--DotSize) * -1) 0 calc(var(--Size) * 0.5)
      calc(var(--Size) * 0.25) var(--ColorContrast);
    & ._Selections::after {
      border-bottom-color: var(--BorderColor);
      opacity: 1;
    }
    & ._Item._Item {
      background-color: transparent;
      &.__withLine::after {
        display: none;
      }
      & ._Logo,
      & ._Description {
        & ._Icon {
          filter: none;
        }
      }
      & [data-length]:after {
        background-color: color-mod(var(--Color) a(0.4));
        color: var(--ColorContrast);
      }
    }
  }
  &.__Active {
    transform: translateX(0);
    opacity: 1;
    visibility: visible;
  }
}
</style>
