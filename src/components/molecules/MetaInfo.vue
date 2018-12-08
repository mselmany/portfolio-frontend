<template>
  <div class="MetaInfo">
    <!-- TODO@1: <locale lang="tr"></locale> cinsinden virtual component yap -->
    <template v-if="$locale === 'tr'">
      <TimeAgo :url="meta.url" :date="meta.date"/>
      <HoverCard :type="meta.name" :url="meta.url"/>
      <span class="_Delimiter">{{$t("ON")}}</span>
      <Action :name="meta.name" :type="meta.type"/>
    </template>
    <template v-else>
      <Action :name="meta.name" :type="meta.type"/>
      <span class="_Delimiter">{{$t("ON")}}</span>
      <HoverCard :type="meta.name" :url="meta.url"/>
      <TimeAgo :url="meta.url" :date="meta.date"/>
    </template>
  </div>
</template>

<script>
export default {
  name: "MetaInfo",
  props: {
    meta: {
      type: Object,
      required: true
    }
  },
  langs: {
    ON: {
      tr: "da",
      en: "on"
    }
  }
};
</script>

<style lang="postcss" scoped>
@import url("../../styles/variables.css");
.MetaInfo {
  --BackgroundColor: var(--DefaultColor);
  display: block;
  position: relative;
  margin-bottom: 0.5rem;
  color: color-mod(var(--BackgroundColor) l(+35%));
  font-size: 1rem;
  font-weight: 500;
  /* font-style: italic; */
  &:first-letter {
    text-transform: uppercase;
  }

  & ._Delimiter {
    /* opacity: 0.75; */
  }
}
</style>
