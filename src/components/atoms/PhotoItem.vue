<template>
  <div class="Photo">
    <div class="_Content">
      <img
        ref="img"
        :class="{'__Loaded': imageLoaded}"
        :src="data.src"
        :alt="data.alt"
        @click="onFullscreen(onImageReady)"
        @dblclick="onFullscreen(onImageReady)"
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "PhotoItem",
  props: {
    data: {
      type: Object,
      required: true
    },
    onNavigate: {
      type: Function,
      default: _ => {}
    },
    onFullscreen: {
      type: Function,
      default: _ => {}
    },
    state: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      imageLoaded: false
    };
  },
  mounted() {
    if (this.state.fullscreen) {
      const img = this.$refs.img;
      if (img.complete) {
        this.onImageLoad();
      } else {
        img.onload = this.onImageLoad;
      }
    }
  },
  methods: {
    onImageReady(fullscreen) {
      const img = this.$refs.img;
      if (!img || !(img instanceof HTMLImageElement)) return;

      const fullSize = () => {
        let { naturalWidth, naturalHeight } = img,
          w,
          h;
        if (naturalWidth > naturalHeight) {
          w = 100;
          h = 100 * (naturalHeight / naturalWidth);
        } else {
          w = 100 * (naturalWidth / naturalHeight);
          h = 100;
        }
        img.style.width = `${w}%`;
        img.style.height = `${h}%`;
        // img.style.minWidth = `${naturalWidth}px`;
        // img.style.minHeight = `${naturalHeight}px`;
        img.style.objectFit = "initial";
        img.style.position = "absolute";
      };

      if (fullscreen) {
        // img.complete ? fullSize() : (img.onload = fullSize);
      } else {
        // img.style = null;
      }
    },
    __onImageLoad() {
      let _img = this.$refs.img,
        { naturalWidth, naturalHeight } = _img,
        w,
        h;
      if (naturalWidth > naturalHeight) {
        w = 100;
        h = 100 * (naturalHeight / naturalWidth);
      } else {
        w = 100 * (naturalWidth / naturalHeight);
        h = 100;
      }
      _img.style.width = `${w}%`;
      _img.style.height = `${h}%`;
      _img.style.minWidth = `${naturalWidth}px`;
      _img.style.minHeight = `${naturalHeight}px`;
      _img.style.objectFit = "initial";
      this.imageLoaded = true;
    },
    toggleSize() {
      const img = this.$refs.img;
      if (this.state.fullscreen) {
        if (img.complete) {
          this.onImageLoad();
        } else {
          img.onload = this.onImageLoad;
        }
      } else {
        img.style = null;
        this.imageLoaded = false;
      }
    },
    toggleFullscreen() {
      this.onFullscreen();
      this.toggleSize();
    }
  }
};
</script>

<style lang="postcss" scoped>
@import url("../../styles/variables.css");

.Photo {
  --BackgroundColor: var(--DefaultColor);
  --Color: var(--DefaultBackgroundColor);
  --ColorContrast: var(--DefaultColor);
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
  font-size: 1rem;
  user-select: none;

  & ._Content {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 1;

    display: flex;
    justify-content: center;
    align-items: center;

    & img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
      /* border-radius: 0.25rem; */
      overflow: hidden;
    }
  }
}
</style>

<style lang="postcss">
@import url("../../styles/variables.css");

.Media.__Fullscreen .Photo img {
  /* display: none; */

  &.__Loaded {
    display: block;
    border: 4px solid red;
  }
}
</style>