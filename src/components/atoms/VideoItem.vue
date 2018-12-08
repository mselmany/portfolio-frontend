<template>
  <div class="Video">
    <video controls :poster="data.thumbnail" width="100%">
      <source
        v-for="(source, index) in data.srcset"
        :key="index"
        :src="source.src"
        :type="source.type"
      >
    </video>
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
    fullscreen: {
      type: Function,
      default: _ => {}
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
  overflow: hidden;
  /* box-shadow: 0 0 0 1px color-mod(var(--BorderColor) l(+75%)); */

  display: flex;
  justify-content: center;
  align-items: center;

  & video {
    display: block;
    object-fit: contain;
    overflow: hidden;
  }
}
</style>
