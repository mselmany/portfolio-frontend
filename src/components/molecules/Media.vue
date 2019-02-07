<template>
  <div
    class="Media"
    ref="mediaContainer"
    :class="{'__Fullscreen': state.fullscreen.active, '__Sticky': state.sticky.active,'__Top': state.sticky.direction === 'top', '__Bottom': state.sticky.direction === 'bottom'}"
  >
    <div
      class="_Placeholder"
      ref="placeholder"
      @click="disableSticky();"
      :data-text="$t('STICKY_MODE')"
    ></div>
    <div class="_FloatingContainer" ref="sticky">
      <div class="_Info">
        <span class="_Item __type" :title="$t('PERMALINK')">
          <a
            :href="current.permalink"
            target="_blank"
            rel="noopener noreferrer"
          >{{$t(current.type.toUpperCase())}}</a>
        </span>
        <span
          class="_Item"
          v-if="medialist.length > 1"
        >{{current.__state.index + 1}} / {{medialist.length}}</span>
        <span class="_Item __navigation __noDot">
          <div
            class="_Icon Icon __black"
            :class="current.__state.playing ? '__pause': '__play'"
            v-if="current.__state.initialized"
            @click="current.__state.playPause()"
          ></div>
          <div class="_Icon Icon __back __black" @click="prev()" v-if="medialist.length > 1"></div>
          <div class="_Icon Icon __next __black" @click="next()" v-if="medialist.length > 1"></div>
          <div
            class="_Icon Icon __black"
            :class="{'__fullscreenExit2': state.fullscreen.active, '__fullscreen2': !state.fullscreen.active}"
            @click="toggleFullscreen()"
          ></div>
        </span>
      </div>
      <div class="_Content">
        <component
          :is="current.type + '-item'"
          :data="current"
          :state="state"
          :on-fullscreen="toggleFullscreen"
          :disable-sticky="disableSticky"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { raf, inViewport } from "@/helpers/utils.js";

// ! TODO@5: Media daki sticky ve fullscreen işlevlerini directive yap en küçük birimlere ayır...

const KEYS = {
  ESC: 27,
  SPACE: 32,
  ARROW_LEFT: 37,
  ARROW_UP: 38,
  ARROW_RIGHT: 39,
  ARROW_DOWN: 40
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
        fullscreen: {
          active: false,
          caches: {
            onKeydown: null,
            onScroll: null
          }
        },
        sticky: {
          active: false,
          caches: {
            onSticky: null
          }
        }
      }
    };
  },
  langs: {
    PERMALINK: {
      tr: "Kaynak",
      en: "Source"
    },
    STICKY_MODE: {
      tr: "Sabit modda oynatılıyor...",
      en: "Playing in sticky mode..."
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
  watch: {
    playing() {
      // do not trigger sticky mode if already sticky mode or in fullscreen
      if (this.state.sticky.active || this.state.fullscreen.active) {
        return;
      }

      if (this.current.__state.playing) {
        this.enableSticky();
      } else {
        this.disableSticky();
      }
    }
  },
  computed: {
    // for listen player state changes
    playing() {
      if (this.current && this.current.__state) {
        return this.current.__state.playing;
      }
    }
  },
  methods: {
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
    setPlaceholder() {
      if (!this.state.fullscreen.active) {
        const placeholder = this.$refs.placeholder;
        const sticky = this.$refs.sticky;
        placeholder.style.width = window.getComputedStyle(sticky).width;
        placeholder.style.height = window.getComputedStyle(sticky).height;
      }
    },
    toggleFullscreen() {
      if (!this.state.fullscreen.active) {
        this.setPlaceholder();
        this.disableSticky();

        // add listeners if did not attached
        if (!this.state.fullscreen.caches.onKeydown) {
          this.state.fullscreen.caches.onKeydown = e => {
            e.preventDefault();
            const key = e.keyCode || e.which;
            switch (key) {
              case KEYS.ESC:
                this.toggleFullscreen();
                break;
              case KEYS.ARROW_LEFT:
              case KEYS.ARROW_UP:
                this.prev();
                break;
              case KEYS.ARROW_RIGHT:
              case KEYS.ARROW_DOWN:
                this.next();
                break;
              case KEYS.SPACE:
                this.current.__state.playPause &&
                  this.current.__state.playPause();
                break;

              default:
                break;
            }
          };
          window.addEventListener(
            "keydown",
            this.state.fullscreen.caches.onKeydown,
            false
          );
        }

        if (!this.state.fullscreen.caches.onScroll) {
          this.state.fullscreen.caches.onScroll = e => {
            this.toggleFullscreen();
          };
          window.addEventListener(
            "scroll",
            this.state.fullscreen.caches.onScroll,
            false
          );
        }

        // enable fullscreen
        this.state.fullscreen.active = true;
      } else {
        if (this.current.__state.playing) {
          this.enableSticky();
        }

        // remove listeners on fullscreen exit
        if (this.state.fullscreen.caches.onKeydown) {
          window.removeEventListener(
            "keydown",
            this.state.fullscreen.caches.onKeydown,
            false
          );
          this.state.fullscreen.caches.onKeydown = null;
        }

        if (this.state.fullscreen.caches.onScroll) {
          window.removeEventListener(
            "scroll",
            this.state.fullscreen.caches.onScroll,
            false
          );
          this.state.fullscreen.caches.onScroll = null;
        }

        // disable fullscreen
        this.state.fullscreen.active = false;
      }
    },
    enableSticky() {
      this.setPlaceholder();

      const mediaContainer = this.$refs.mediaContainer;

      if (!this.state.sticky.caches.onSticky) {
        this.state.sticky.caches.onSticky = () => {
          // if element in view, sticky will be true else false
          raf(() => {
            const { inview, direction } = inViewport(mediaContainer);
            this.state.sticky.active = !inview;
            this.state.sticky.direction = direction;
          });
        };

        this.state.sticky.caches.onSticky();

        window.addEventListener(
          "scroll",
          this.state.sticky.caches.onSticky,
          false
        );
      }
    },
    disableSticky(callback) {
      this.state.sticky.active = false;

      if (this.state.sticky.caches.onSticky) {
        window.removeEventListener(
          "scroll",
          this.state.sticky.caches.onSticky,
          false
        );
        this.state.sticky.caches.onSticky = null;
      }

      if (callback && callback instanceof Function) {
        callback();
      }
    }
  }
};
</script>

<style lang="postcss" scoped>
@import url("../../styles/variables.css");

/* 
background: linear-gradient(135deg, rgb(216, 210, 202) 0%, rgb(137, 133, 128) 100%);
background: linear-gradient(135deg, rgb(201, 201, 201) 0%, rgb(120, 120, 120) 100%);
 */

.Media {
  --BackgroundColor: var(--DefaultColor);
  --Color: var(--DefaultBackgroundColor);
  --ColorContrast: var(--DefaultColor);
  --Transition: var(--DefaultTransition);
  --InfoOffset_Height: 2.5rem;
  --DotPatternImage: url("../../assets/background_patterndot.svg");

  display: block;
  width: 100%;
  height: 100%;
  margin-top: var(--InfoOffset_Height);
  position: relative;
  font-size: 1rem;
  transition: 0s !important;
  user-select: none;

  &.__Fullscreen {
    & ._Placeholder {
      display: block;
      position: relative !important;
    }
    & ._FloatingContainer {
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 9999;
      background-color: var(--Color);
      color: var(--BackgroundColor);
    }

    & ._Info {
      width: auto;
      padding: 1.5rem;
      position: absolute;
      top: 1rem;
      right: 1rem;
      z-index: 3;
      text-shadow: -1px -1px 15px var(--Color), 1px 1px 15px var(--Color),
        -1px 1px 15px var(--Color), 1px -1px 15px var(--Color);

      & ._Item:not(:first-of-type) {
        margin-left: 0.75rem;
      }
      & ._Item.__navigation {
        margin-left: 2.5rem;
      }
    }

    & ._Content {
      width: 100%;
      height: 100%;
      margin: 0 auto;
    }
  }

  &.__Sticky {
    & ._Placeholder {
      display: block;
      position: relative !important;
    }
    & ._FloatingContainer {
      max-width: 25%;
      position: fixed;
      right: 1rem;
      z-index: 9999;
      background-color: var(--Color);
      color: var(--BackgroundColor);

      & ._Info {
        display: none;
      }
    }
    &.__Top ._FloatingContainer {
      top: 1rem;
    }
    &.__Bottom ._FloatingContainer {
      bottom: 1rem;
    }

    &.__Top ._Placeholder:after {
    }
    &.__Bottom ._Placeholder:after {
    }
  }

  & ._Placeholder {
    display: none;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;

    &:before {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: color-mod(var(--BackgroundColor) a(0.25));
      background: var(--DotPatternImage);
    }
    &:after {
      content: attr(data-text);
      display: inline-block;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      padding: 0 0.3rem;
      background-color: var(--Color);
      font-size: 0.8rem;
      line-height: 1.25rem;
      /* font-weight: bold; */
      font-style: italic;
      /* text-transform: uppercase; */
    }
  }

  & ._FloatingContainer {
    display: block;
    position: relative;
    z-index: 1;
  }

  & ._Info {
    display: flex;
    width: 100%;
    padding-top: 0.75rem; /* --InfoOffset_Height depends this*/
    padding-bottom: 0.75rem; /* --InfoOffset_Height depends this*/
    line-height: 1rem; /* --InfoOffset_Height depends this*/
    position: absolute;
    top: calc(var(--InfoOffset_Height) * -1);
    overflow: hidden;
    font-weight: 900;
    font-size: 0.85rem;

    & > ._Item {
      position: relative;

      &:not(:first-of-type, .__noDot) {
        margin-left: 0.35rem;

        &:before {
          content: "•";
          padding-right: 0.3rem;
        }
      }

      & a {
        color: currentColor;
        text-decoration: none;
        white-space: nowrap;
        &:hover {
          text-decoration: underline;
        }
      }

      &.__type {
        font-family: "Playfair Display";
        font-style: italic;
        font-weight: 600;
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
}
</style>