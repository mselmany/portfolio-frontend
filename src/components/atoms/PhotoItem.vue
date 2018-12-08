<template>
  <div class="Photo">
    <div class="_Content">
      <img :src="data.src" :alt="data.alt" @click="navigate()" @dblclick="fullscreen()">
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
    navigate: {
      type: Function,
      default: _ => {}
    },
    fullscreen: {
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
