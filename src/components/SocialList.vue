<template>
  <ul class="SocialList" :class="{'__MenuActive': isMenuActive, '__FilterActive': isFilterActive}">
    <slot/>
  </ul>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "SocialList",
  computed: {
    ...mapGetters("toolbox", ["activeButton"]),
    isMenuActive() {
      return this.activeButton && this.activeButton.name === "menu";
    },
    isFilterActive() {
      return this.activeButton && this.activeButton.name === "filter";
    }
  }
};
</script>

<style lang="postcss" scoped>
@import url("../styles/variables.css");
.SocialList {
  --Size: var(--SocialList_Size);
  --Padding: var(--DefaultLayoutPadding);
  --Transition: var(--DefaultTransition);
  font-size: 1rem;
  width: 100%;
  max-width: var(--Size);
  position: relative;
  margin: 0 calc(var(--Padding) * 1.5);
  padding: calc(var(--Padding) * 1.5) 1rem var(--Padding) 1rem;
  transition: var(--Transition);
  transform: translateX(var(--SidebarMenu_Size));

  @media (--DesktopSmall) {
    margin: 0 auto;
    transform: translateX(0);
  }

  &.__MenuActive {
  }
  &.__FilterActive {
  }
}
</style>
