<template>
  <div id="Home" class="Page">
    homepageee
    <!-- <FilterList/>
    <SocialList v-infinite-loader="loader">
      <SocialItem v-for="(item, index) in list" :key="index" :data="item" :isgroup="item.groupName !== (index === 0 ? '' : list[index - 1].groupName)" />
      <LoaderButton :action="loader" :limit="1">Yükle</LoaderButton>
    </SocialList> -->
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { NOTIFY } from "@/store/modules/common/types";
import { FETCH } from "@/store/modules/sociallist/types";

import { randomFrom } from "@/mock";

export default {
  name: "Home",
  computed: {
    ...mapGetters("filterlist", ["selectedListTypes"]),
    ...mapGetters("sociallist", ["filtered"]),
    list() {
      return this.filtered(this.selectedListTypes);
    }
  },
  methods: {
    ...mapActions("sociallist", [FETCH]),
    ...mapActions("common", [NOTIFY]),
    async loader() {
      const type = randomFrom(this.selectedListTypes);
      await this[FETCH]({ type });
      this[NOTIFY]({ type });
    }
  }
};
</script>

<style lang="postcss" scoped>
#Home {
}
</style>
