<template>
  <div class="Video">
    <figure>
      <video ref="video" controls preload="metadata" :poster="data.thumbnail">
        <source
          v-for="(source, index) in data.srcset"
          :key="index"
          :src="source.src"
          :type="source.type"
        >
      </video>
      <div class="_PlayPauseArea" @click="playPause()"></div>
      <div class="_Controls">
        <div class="_Layer __topLeft">
          <div v-if="state.sticky" class="_Item __Hover" @click="stopSticky()">
            <div class="_Icon Icon __white __pin"></div>
          </div>
        </div>
        <div class="_Layer __topRight">
          <div class="_Item" @click="playPause()">
            <div
              class="_Icon Icon __white"
              :class="{'__play': !data.__state.playing, '__pause': data.__state.playing}"
            ></div>
          </div>
        </div>
        <!-- <div class="_Layer __bottomRight __Hover">
          <div class="_Item">
            <div class="_Icon Icon __white __next"></div>
          </div>
          <div class="_Item">
            <div class="_Icon Icon __white __next"></div>
          </div>
        </div>
        <div class="_Layer __bottomLeft">
          <div class="_Item">
            <div class="_Icon Icon __white __next"></div>
          </div>
          <div class="_Item">
            <div class="_Icon Icon __white __next"></div>
          </div>
        </div>-->
      </div>
    </figure>
  </div>
</template>

<script>
export default {
  name: "VideoItem",
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
    }
  },
  mounted() {
    if (!this.data.__state.hasOwnProperty("initialized")) {
      this.data.__state = {
        ...this.data.__state,
        initialized: true,
        playing: false,
        duration: -1,
        currentTime: 0,
        percentage: 0,
        sound: 0.3
      };
    }
    this.data.__state.playPause = this.playPause;

    const video = this.$refs.video;
    video.addEventListener("loadedmetadata", () => {
      this.data.__state.duration = video.duration;
    });
    video.addEventListener("timeupdate", () => {
      if (this.data.__state.duration === -1) {
        this.data.__state.duration = video.duration;
      }
      this.data.__state.currentTime = video.currentTime;
      this.data.__state.percentage = Math.floor(
        (video.currentTime / video.duration) * 100
      );
      this.data.__state.playing = !(video.paused || video.ended);
      // console.log(">> ", this.data.__state.playing);
    });
  },
  beforeDestroy() {
    this.pause();
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
      this.$refs.video.play();
      this.data.__state.playing = true;
    },
    pause() {
      this.$refs.video.pause();
      this.data.__state.playing = false;
    },
    stopSticky() {
      this.state.sticky = false;
      this.pause();
    }
  }
};
</script>

<style lang="postcss" scoped>
@import url("../../styles/variables.css");

.Video {
  --BackgroundColor: var(--DefaultColor);
  --Color: var(--DefaultBackgroundColor);
  --BorderColor: var(--BackgroundColor);
  display: block;
  width: 100%;
  height: 100%;
  font-size: 1rem;
  position: relative;
  margin: 0;
  padding: 0;
  /* border-radius: 0.25rem; */
  /* overflow: hidden; */

  display: flex;
  justify-content: center;
  align-items: center;

  & .__Hover,
  &:hover .__NotHover {
    display: none !important;
  }
  &:hover .__Hover {
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

  & ._PlayPauseArea {
    width: 100%;
    height: calc(100% - 4rem);
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    cursor: pointer;
    /* background-color: red;
    bottom: 0; */
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
}
</style>
