<template>
  <div
    class="Media"
    ref="mediaContainer"
    :class="{'__Fullscreen': state.fullscreen, '__Sticky': state.sticky}"
  >
    <div
      class="_Placeholder"
      ref="placeholder"
      @click="toggleSticky();"
      :data-text="$t('STICKY_MODE')"
    ></div>
    <div class="_Container" ref="sticky">
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
            :class="{'__fullscreenExit2': state.fullscreen, '__fullscreen2': !state.fullscreen}"
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
        />
      </div>
    </div>
  </div>
</template>

<script>
import { raf, inViewport } from "@/helpers/utils.js";

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
        fullscreen: false,
        sticky: false
      },
      caches: {
        onKeydown: null,
        onScroll: null,
        onSticky: null
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
      // console.log("watch");
      if (this.state.fullscreen) {
        console.log("0");
        /* if (this.current.__state.playing) {
          console.log("-2");
          this.enableSticky();
        } else {
          console.log("-3");
          this.disableSticky();
        } */
        return;
      }
      if (this.state.sticky || this.state.fullscreen) {
        console.log("1");
        return;
      }

      if (this.current.__state.playing) {
        console.log("2");
        this.enableSticky();
      } else {
        console.log("3");
        this.disableSticky();
      }
    }
  },
  computed: {
    // for listen changes
    playing() {
      if (
        this.current &&
        this.current.__state /* && !this.state.fullscreen */
      ) {
        console.log("playing");
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
      if (!this.state.fullscreen) {
        const placeholder = this.$refs.placeholder;
        const sticky = this.$refs.sticky;
        placeholder.style.width = window.getComputedStyle(sticky).width;
        placeholder.style.height = window.getComputedStyle(sticky).height;
      }
    },
    toggleFullscreen() {
      if (!this.state.fullscreen) {
        // this.setPlaceholder(); // set placeholder size

        // for refreshing sticky state
        // this.disableSticky();

        if (this.current.__state.playing) {
          console.log("---2");
          this.enableSticky();
        } else {
          console.log("---3");
          this.disableSticky();
        }

        // enable fullscreen
        this.state.fullscreen = true;

        // add listeners if did not attached
        if (!this.caches.onKeydown) {
          this.caches.onKeydown = e => {
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
          window.addEventListener("keydown", this.caches.onKeydown, false);
        }

        if (!this.caches.onScroll) {
          this.caches.onScroll = e => {
            this.toggleFullscreen();
          };
          window.addEventListener("scroll", this.caches.onScroll, false);
        }
      } else {
        // for refreshing sticky state
        // this.enableSticky();

        if (this.current.__state.playing) {
          console.log("---2");
          this.enableSticky();
        } else {
          console.log("---3");
          this.disableSticky();
        }

        this.state.fullscreen = false;

        // remove listeners on fullscreen exit
        if (this.caches.onKeydown) {
          window.removeEventListener("keydown", this.caches.onKeydown, false);
          this.caches.onKeydown = null;
        }

        if (this.caches.onScroll) {
          window.removeEventListener("scroll", this.caches.onScroll, false);
          this.caches.onScroll = null;
        }
      }
    },
    enableSticky() {
      // console.log("enableSticky");
      this.setPlaceholder();

      const mediaContainer = this.$refs.mediaContainer;

      if (!this.caches.onSticky) {
        this.caches.onSticky = () => {
          // if element in view, sticky will be true else false
          raf(() => {
            this.state.sticky = !inViewport(mediaContainer);
            console.log("stickyy");
          });
        };

        this.caches.onSticky();

        window.addEventListener("scroll", this.caches.onSticky, false);
      }
    },
    disableSticky() {
      // console.log("disableSticky");
      this.state.sticky = false;

      if (this.caches.onSticky) {
        window.removeEventListener("scroll", this.caches.onSticky, false);
        this.caches.onSticky = null;
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
  --ButtonFrame_Padding: 0.35rem;
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
  font-size: 1rem;
  transition: 0s !important;
  user-select: none;

  &.__Fullscreen {
    & > ._Placeholder {
      display: block;
      position: relative !important;
    }
    & > ._Container {
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
    & > ._Placeholder {
      display: block;
      position: relative !important;
    }
    & > ._Container {
      max-width: 30%;
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 9999;
      background-color: var(--Color);
      color: var(--BackgroundColor);

      & ._Info {
        display: none;
      }
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
      top: 2.5rem;
      bottom: 0;
      background: color-mod(var(--BackgroundColor) a(0.25));
      background: url("../../assets/background_patterndot.svg");
    }
    &:after {
      content: attr(data-text);
      display: inline-block;
      position: absolute;
      left: 1.25rem;
      bottom: 1.25rem;
      padding: 0 0.3rem;
      background-color: var(--Color);
      font-size: 0.8rem;
      line-height: 1.25rem;
      font-weight: bold;
      font-style: italic;
      /* text-transform: uppercase; */
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