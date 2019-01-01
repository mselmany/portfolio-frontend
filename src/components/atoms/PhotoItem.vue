<template>
  <div class="Photo">
    <div class="_Content">
      <img :src="data.src" :alt="data.alt" @click="onFullscreen()">
      <div class="_Alt">
        <div class="_Text" v-html="data.alt"></div>
      </div>
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
    state: {
      type: Object,
      required: true
    },
    onFullscreen: {
      type: Function,
      default: _ => {}
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
      cursor: zoom-in;
    }

    & ._Alt {
      display: none;
      max-width: 10rem;
      padding: 1rem;
      position: absolute;
      right: 0;
      bottom: 0;
      z-index: 3;
      & ._Text {
        padding: 0.75rem;
        /* background-color: var(--Color); */
        color: var(--BackgroundColor);
        text-shadow: -1px -1px 15px var(--Color), 1px 1px 15px var(--Color),
          -1px 1px 15px var(--Color), 1px -1px 15px var(--Color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &:hover {
        max-width: 100%;
        opacity: 1;
        & ._Text {
          background-color: var(--BackgroundColor);
          color: var(--Color);
          text-shadow: none;
        }
      }
    }
  }
}
</style>

<style lang="postcss">
@import url("../../styles/variables.css");

.Media.__Fullscreen .Photo {
  & img {
    cursor: zoom-out;
  }
  & ._Alt {
    display: block;

    & ._Text * {
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &:hover {
      & ._Text,
      & ._Text * {
        white-space: initial;
      }
    }
  }
}
</style>