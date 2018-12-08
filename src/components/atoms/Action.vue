<template>
  <span class="Action">{{translationKey()}}</span>
</template>

<script>
export default {
  name: "Action",
  props: {
    type: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  langs: {
    DRIBBBLE_SHOTS: {
      tr: " yayınladı",
      en: "published "
    },
    TWITTER_LIKES: {
      tr: " beğendi",
      en: "liked "
    },
    TWITTER_TIMELINE: {
      tr: " öttürdü",
      en: "tweeted "
    }
  },
  methods: {
    translationKey() {
      return this.$t([this.name, this.type].join("_").toUpperCase());
    }
  }
};
</script>

<style lang="postcss" scoped>
@import url("../../styles/variables.css");

.Action {
}
</style>
