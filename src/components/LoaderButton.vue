<template>
  <div class="LoaderButton" :class="{'__Blocked': blocked}">
    <button @click="load()">
      <slot/>
      <!-- <div class="Icon" :class="icon"></div> -->
    </button>
  </div>
</template>

<script>
// TODO@3: geliştir!

import { mapState } from "vuex";
import global from "@/global";

export default {
  name: "LoaderButton",
  props: {
    action: {
      type: Function,
      required: true
    },
    limit: {
      type: Number,
      default: global.perpage
    }
  },
  computed: {
    ...mapState("common", ["loading"]),
    blocked() {
      return this.loading.queue.length >= this.limit;
    }
  },
  methods: {
    async load() {
      if (this.blocked) return;
      await this.action();
    }
  }
};
</script>

<style lang="postcss" scoped>
@import url("../styles/variables.css");
.LoaderButton {
  --Size: var(--SocialList_Size);
  --BackgroundColor: var(--DefaultColor);
  --Color: var(--DefaultBackgroundColor);
  --Margin: var(--DefaultLayoutPadding);
  --Transition: var(--DefaultTransition);
  font-size: 1rem;
  text-align: center;
  margin-bottom: var(--Margin);

  & > button {
    display: inline-block;
    /* width: 15px;
    height: 15px; */
    position: relative;
    color: currentColor;
    padding: 1rem;
    user-select: none;

    background-color: var(--BackgroundColor);
    color: var(--Color);
    cursor: pointer;
  }

  &.__Blocked {
    pointer-events: none;
    cursor: not-allowed;
    opacity: 0.5;
  }
}
</style>
