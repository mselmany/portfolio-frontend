<template>
  <a
    class="TimeAgo"
    target="_blank"
    rel="noopener noreferrer"
    :href="url"
    :title="$t('SOURCE_LINK')"
  >{{timeAgo()}}</a>
</template>

<script>
// TODO@3: Tooltip le tarih formatı değiştirilebilir, close buttonu ile de değişiklik önerisi bidaha çıkmamak üzere kapatılabilir
import { timeAgo } from "@/helpers/utils";

export default {
  name: "TimeAgo",
  props: {
    date: {
      type: Number,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  langs: {
    SOURCE_LINK: {
      tr: "Kaynak",
      en: "Source"
    }
  },
  methods: {
    timeAgo() {
      return timeAgo(this.date);
    }
  }
};
</script>

<style lang="postcss" scoped>
@import url("../../styles/variables.css");

.TimeAgo {
  color: inherit;
  text-decoration: none;
  white-space: nowrap;
  &:hover {
    text-decoration: underline;
  }
}
</style>
