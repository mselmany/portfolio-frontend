<template>
  <div class="Video">
    <figure>
      <video ref="video" preload="metadata" :poster="data.thumbnail">
        <source
          v-for="(source, index) in data.srcset"
          :key="index"
          :src="source.src"
          :type="source.type"
        >
      </video>
      <div class="_Controls">
        <div class="_Layer __topLeft">
          <div v-if="state.sticky.active" class="_Item __Hover" @click="disableStickyAndScroll()">
            <div class="_Icon Icon __white __pin"></div>
          </div>
          <div
            v-if="state.sticky.active || state.fullscreen.active"
            class="_Item __Hover"
            @click="disableStickyAndPause()"
          >
            <div class="_Icon Icon __white __close2"></div>
          </div>
        </div>
        <div class="_Layer __topRight">
          <div class="_Item" :class="{'__Hover': data.__state.playing}" @click="playPause()">
            <div
              class="_Icon Icon __white"
              :class="{'__play': !data.__state.playing && data.__state.percentage !== 100, '__reload': data.__state.percentage === 100, '__pause': data.__state.playing}"
            ></div>
          </div>
          <div class="_Item" :class="{'__Hover': !data.__state.muted}" @click="changeVolume()">
            <div
              class="_Icon Icon __white"
              :class="{'__volumeOff': data.__state.muted, '__volumeOnZero': !data.__state.muted && data.__state.volume == 0, '__volumeOnHalf': !data.__state.muted && data.__state.volume > 0 && data.__state.volume <= 0.5, '__volumeOn': !data.__state.muted && data.__state.volume > 0.5}"
            ></div>
          </div>
        </div>
      </div>
      <div class="_PlayPauseArea" @click="playPause()"></div>
      <div class="_Player">
        <div class="_Container">
          <div class="_Panel">
            <div class="_Item">{{formattedCurrentTime}} ∙ {{formattedDuration}}</div>
          </div>
          <div class="_ProgressBar" ref="progressBar">
            <div class="_Progress">
              <div class="_Indicator" :style="{'width': data.__state.percentage + '%'}"></div>
            </div>
          </div>
        </div>
      </div>
    </figure>
  </div>
</template>

<script>
import { formatTime } from "@/helpers/utils";

export default {
  name: "SoundItem",
  props: {
    data: {
      type: Object,
      required: true
    },
    state: {
      type: Object,
      required: true
    },
    onFullscreen: {
      type: Function,
      default: _ => {}
    },
    disableSticky: {
      type: Function,
      default: _ => {}
    }
  },
  mounted() {
    const video = this.$refs.video,
      progressBar = this.$refs.progressBar;

    if (!this.data.__state.hasOwnProperty("initialized")) {
      this.data.__state = {
        ...this.data.__state,
        initialized: true,
        playing: false,
        duration: -1,
        currentTime: 0,
        percentage: 0,
        volume: video.volume,
        muted: video.muted
      };
    }
    this.data.__state.playPause = this.playPause;

    video.addEventListener("loadedmetadata", () => {
      let { duration } = video;
      this.data.__state.duration = duration;
    });

    video.addEventListener("volumechange", () => {
      let { volume, muted } = video;
      this.data.__state.volume = volume;
      this.data.__state.muted = muted;
    });

    video.addEventListener("timeupdate", () => {
      let { duration, currentTime, paused, ended } = video;
      if (this.data.__state.duration === -1) {
        this.data.__state.duration = duration;
      }
      this.data.__state.currentTime = currentTime;
      this.data.__state.percentage = Math.floor((currentTime / duration) * 100);
      this.data.__state.playing = !(paused || ended);
    });

    progressBar.addEventListener("click", function(e) {
      const pos =
        (e.pageX - this.getBoundingClientRect().left) / this.offsetWidth;
      video.currentTime = pos * video.duration;
    });

    // TODO@3: Progressbar mouse sürükle-bırak ile ileri-geri sarılabilmeli.
    // TODO@3: Float/pin halindeki mediayı(video) resize edilebilir yap.
  },
  beforeDestroy() {
    this.pause();
  },
  computed: {
    formattedCurrentTime() {
      return formatTime(this.data.__state.currentTime);
    },
    formattedDuration() {
      return formatTime(this.data.__state.duration);
    }
  },
  methods: {
    playPause() {
      const video = this.$refs.video;
      if (video.paused || video.ended) {
        this.play();
      } else {
        this.pause();
      }
    },
    play() {
      this.data.__state.playing = true;
      this.$refs.video.play();
    },
    pause() {
      this.data.__state.playing = false;
      this.$refs.video.pause();
    },
    changeVolume() {
      const video = this.$refs.video;
      if (video.muted) {
        video.muted = false;
      } else if (video.volume <= 0.5) {
        video.volume = 1;
      } else if (!video.muted) {
        video.muted = true;
        video.volume = 0.5;
      }
    },
    disableStickyAndScroll() {
      this.disableSticky(() => {
        setTimeout(() => {
          this.$el.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center"
          });
        });
      });
    },
    disableStickyAndPause() {
      this.pause();
      if (this.state.fullscreen.active) {
        this.onFullscreen();
      }
      if (this.state.sticky.active) {
        this.disableSticky();
      }
    }
  }
};
</script>

<style lang="postcss" scoped>
@import url("../../styles/variables.css");

.Video {
  --BackgroundColor: var(--DefaultColor);
  --Color: var(--DefaultBackgroundColor);
  --Transition: var(--DefaultTransition);

  --ProgressBarHeight: 2rem;
  --ProgressHeight: 0.2rem;
  --ProgressColor: #cd201f;
  --ProgressBgColor: var(--DefaultColor);

  display: block;
  width: 100%;
  height: 100%;
  font-size: 1rem;
  position: relative;
  margin: 0;
  padding: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  & .__Hover,
  & figure:hover .__NotHover {
    display: none !important;
  }
  & figure:hover .__Hover {
    display: block !important;
    &._Layer {
      display: flex !important;
    }
  }

  & figure,
  & video {
    display: block;
    position: relative;
    margin: 0;
    padding: 0;
  }
  & figure {
    max-width: 100%;
    max-height: 100%;
  }
  & video {
    width: 100%;
    height: 100%;
    object-fit: scale-down;
    object-fit: contain;
    overflow: hidden;
  }

  & ._Controls {
    width: 1px;
    height: 0;
    position: static;
    & ._Layer {
      display: flex;
      flex-direction: row;
      position: absolute;
      z-index: 2;
      background-color: greenyellow;

      &.__topLeft {
        top: 0.5rem;
      }
      &.__topRight {
        top: 0.5rem;
      }
      &.__bottomRight {
        bottom: 0.5rem;
      }
      &.__bottomLeft {
        bottom: 0.5rem;
      }
      &.__topLeft,
      &.__bottomLeft {
        left: 0.5rem;
        /* & > *:not(:last-of-type) {
          margin-right: 0.5rem;
        } */
      }
      &.__topRight,
      &.__bottomRight {
        right: 0.5rem;
        flex-direction: row-reverse;

        /* & > *:not(:last-of-type) {
          margin-left: 0.5rem;
        } */
      }
    }
    & ._Item {
      width: 1.25rem;
      height: 1.25rem;
      background-color: var(--BackgroundColor);
      position: relative;
      cursor: pointer;
      border: 0.3rem solid;
      & ._Icon {
        background-size: contain;
      }
    }
  }
  & ._PlayPauseArea {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    cursor: pointer;
  }
  & ._Player {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;

    & ._Container {
      width: auto;
      position: relative;
      transition: var(--Transition);
    }

    & ._Panel {
      width: 100%;
      position: relative;
      z-index: 2;
      padding: 0 1rem;
      font-size: 0.8rem;
      line-height: 1rem;
      color: var(--BackgroundColor);
      transition: var(--Transition);
      opacity: 0;
      visibility: hidden;
    }

    & ._ProgressBar {
      width: 100%;
      height: 1rem;
      display: block;
      transition: var(--Transition);
      cursor: pointer;

      & ._Progress {
        width: auto;
        height: calc(var(--ProgressHeight) / 2);
        min-height: 2px;
        display: block;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--ProgressBgColor);
        transition: inherit;
        cursor: pointer;

        & ._Indicator {
          height: 100%;
          display: block;
          position: relative;
          background-color: var(--ProgressColor);

          &:after {
            content: "";
            box-sizing: initial;
            width: var(--ProgressHeight);
            height: var(--ProgressHeight);
            position: absolute;
            top: -0.3rem;
            right: calc(((var(--ProgressHeight) / 2) + 0.3rem) * -1);
            border: 0.3rem solid currentColor;
            background-color: var(--Color);
            color: var(--Color);
            box-shadow: 0 0 calc(var(--ProgressHeight) / 2)
              color-mod(var(--BackgroundColor) a(25%));
            border-radius: 50%;
            transition: var(--Transition);
            transform: scale(0.5);
            visibility: hidden;
          }
        }
      }
    }
  }

  & figure:hover {
    & ._Player {
      & ._Container {
        margin: 0 1rem;
      }

      & ._Panel {
        padding: 0;
        opacity: 1;
        visibility: visible;
      }

      & ._ProgressBar {
        height: var(--ProgressBarHeight);

        &:hover ._Indicator:after {
          transform: scale(1);
        }

        & ._Progress {
          height: var(--ProgressHeight);
          bottom: calc(1rem - (var(--ProgressHeight) / 2));

          & ._Indicator:after {
            visibility: visible;
          }
        }
      }
    }
  }
}
</style>
