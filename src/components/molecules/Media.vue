<template>
  <div class="Media" :class="{'__Fullscreen': state.fullscreen}">
    <div class="_Container">
      <div class="_Info">
        <span class="_Item">{{$t(current.type.toUpperCase())}}</span>
        <span
          class="_Item __noDot"
          v-if="medialist.length > 1"
        >{{current.__state.index + 1}} / {{medialist.length}}</span>
        <span class="_Item __navigation __noDot" v-if="medialist.length > 1">
          <div class="_Icon Icon __back __black" @click="prev()"></div>
          <div class="_Icon Icon __next __black" @click="next()"></div>
          <div
            class="_Icon Icon __black"
            :class="{'__fullscreenExit': state.fullscreen, '__fullscreen': !state.fullscreen}"
            @click="toggleFullscreen()"
          ></div>
        </span>
      </div>
      <div class="_Content">
        <ul class="_List">
          <li
            class="_Item"
            v-for="(item, index) in medialist"
            :key="index"
            :class="{'__Selected': item.__state.selected}"
          >
            <component
              :is="item.type + '-item'"
              :data="item"
              :navigate="(item.type === 'photo' && medialist.length > 1) ? next : null"
              :fullscreen="toggleFullscreen"
            />
          </li>
        </ul>
        <!-- <div class="_Buttons __topLeft">
          <a :href="current.permalink">{{current.permalink}}</a>
        </div>-->
        <div class="_Buttons __bottomRight" :class="{'__Active': state.fullscreen}">
          <button @click="toggleFullscreen()">Tam Ekran</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import { TOGGLE_CSS_CLASS } from "@/store/modules/common/types";

const KEYS = {
  ESC: 27,
  ARROW_LEFT: 37,
  ARROW_UP: 38,
  ARROW_RIGHT: 39,
  ARROW_DOWN: 40
};
let _caches = {
  keyboard: null,
  scroll: null,
  scrollPos: {
    x: window.scrollX,
    y: window.scrollY
  }
};

export default {
  name: "Media",
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      medialist: this.list.map((item, index) => ({
        ...item,
        __state: {
          selected: !index,
          index
        }
      })),
      current: null,
      state: {
        fullscreen: false
      }
    };
  },
  langs: {
    PREV: {
      tr: "← Önceki",
      en: "← Previous"
    },
    NEXT: {
      tr: "Sonraki →",
      en: "Next →"
    },
    PHOTO: {
      tr: "Fotoğraf",
      en: "Photo"
    },
    VIDEO: {
      tr: "Video",
      en: "Video"
    },
    GIF: {
      tr: "GIF",
      en: "GIF"
    }
  },
  created() {
    this.current = this.medialist[0];
  },
  methods: {
    ...mapMutations("common", [TOGGLE_CSS_CLASS]),
    navigate(direction) {
      if (this.medialist.length === 1) return;
      const _limit = this.medialist.length - 1;
      let _position, _pending;
      if (direction === "PREV") {
        _position = this.current.__state.index - 1;
        _pending = _position < 0 ? _limit : _position;
      } else {
        _position = this.current.__state.index + 1;
        _pending = _position > _limit ? 0 : _position;
      }
      this.current.__state.selected = false;
      this.medialist[_pending].__state.selected = true;
      this.current = this.medialist[_pending];
    },
    prev() {
      this.navigate("PREV");
    },
    next() {
      this.navigate("NEXT");
    },
    toggleFullscreen() {
      this.state.fullscreen = !this.state.fullscreen;
      this[TOGGLE_CSS_CLASS](["__SocialList__Fullscreen"]);
      if (this.state.fullscreen) {
        _caches.keyboard = e => {
          const key = e.keyCode || e.which;
          switch (key) {
            case KEYS.ESC:
              this.toggleFullscreen();
              break;
            case KEYS.ARROW_LEFT:
            case KEYS.ARROW_UP:
              this.next();
              break;
            case KEYS.ARROW_RIGHT:
            case KEYS.ARROW_DOWN:
              this.prev();
              break;

            default:
              break;
          }
        };
        _caches.scrollPos = {
          x: window.scrollX,
          y: window.scrollY
        };
        _caches.scroll = e => {
          e.preventDefault();
          e.stopPropagation();
          window.scrollTo(_caches.scrollPos.x, _caches.scrollPos.y);
        };
        window.addEventListener("scroll", _caches.scroll, false);
        window.addEventListener("keyup", _caches.keyboard, false);
      } else {
        window.removeEventListener("scroll", _caches.scroll, false);
        window.removeEventListener("keyup", _caches.keyboard, false);
      }
    }
  }
};
</script>

<style lang="postcss" scoped>
@import url("../../styles/variables.css");

.Media {
  --BackgroundColor: var(--DefaultColor);
  --Color: var(--DefaultBackgroundColor);
  --ColorContrast: var(--DefaultColor);
  --Transition: var(--DefaultTransition);
  --ButtonFrame_Padding: 0.35rem;
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
  font-size: 1rem;
  transition: 0s;
  user-select: none;

  &.__Fullscreen {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 9999;
    background-color: color-mod(var(--ColorContrast) a(75%));

    & > ._Container {
      width: 100%;
      height: 100%;
      position: relative;
      z-index: 1;

      /* margin: 0 auto;
      padding: 5%; */
    }

    & ._Info {
      padding: 5rem;
      position: absolute;
      top: 0;
      width: 100%;
      z-index: 3;
    }

    & ._Content {
      width: 100%;
      height: 100%;
      padding: 10%;
      margin: 0 auto;
      & > ._List {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;

        & > ._Item.__Selected {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  & ._Info {
    display: flex;
    position: relative;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    overflow: hidden;
    font-weight: 900;
    font-size: 0.85rem;
    line-height: 1rem;

    & > ._Item {
      position: relative;

      &:not(:last-of-type, .__noDot) {
        margin-right: 0.35rem;

        &:after {
          content: "•";
          padding-left: 0.3rem;
        }
      }

      &.__navigation {
        margin-left: auto;
        & ._Icon {
          position: relative;
          width: 1em;
          /* height: 1em; */
          background-size: contain;
        }
        & > * {
          display: inline-block;
          cursor: pointer;

          &:not(:last-of-type) {
            margin-right: 0.75rem;
          }

          &:hover {
            opacity: 0.75;
          }
          &:active {
            transform: scale(0.9);
          }
        }
      }
    }
  }

  & ._Content {
    display: block;
    position: relative;
  }

  & ._List {
    list-style: none;
    display: block;
    position: relative;
    z-index: 1;
    margin: 0;
    padding: 0;
    & > ._Item {
      display: none;
      margin: 0;
      padding: 0;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;

      &.__Selected {
        display: block;
        position: relative;
        z-index: 2;
      }
    }
  }

  & ._Buttons {
    position: absolute;
    z-index: 2;
    font-weight: 900;
    font-size: 0.85rem;
    line-height: 1;

    &.__topLeft {
      top: var(--ButtonFrame_Padding);
      left: var(--ButtonFrame_Padding);
    }

    &.__topRight {
      top: var(--ButtonFrame_Padding);
      right: var(--ButtonFrame_Padding);
    }

    &.__bottomRight {
      bottom: var(--ButtonFrame_Padding);
      right: var(--ButtonFrame_Padding);
    }

    &.__bottomLeft {
      bottom: var(--ButtonFrame_Padding);
      left: var(--ButtonFrame_Padding);
    }

    &.__Active {
      opacity: 0.5;
    }

    & > * {
      display: inline-block;
      margin: 0.15rem;
      padding: var(--ButtonFrame_Padding);
      background-color: var(--BackgroundColor);
      color: var(--Color);
      font-weight: 400;
      cursor: pointer;
    }
  }
}
</style>

<style lang="postcss">
@import url("../../styles/variables.css");

.__SocialList__Fullscreen .SocialList {
  transform: none !important; /* for fullscreen*/
  transition: 0s !important;
}
</style>