<template>
  <div id="Social" class="Page">
    <FilterList />
    <SocialList v-infinite-loader="loader">
      <SocialItem v-for="(item, index) in sociallist" :key="index" :data="item" :isgroup="item.groupName !== (index === 0 ? '' : sociallist[index - 1].groupName)" />
      <!-- <LoaderButton :action="loader" :limit="1">Yükle</LoaderButton> -->
    </SocialList>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import { NOTIFY } from "@/store/modules/common/types";
import { FETCH } from "@/store/modules/sociallist/types";
import { TOGGLE } from "@/store/modules/filterlist/types";

import { randomFrom } from "@/mock";

export default {
  name: "Social",
  data() {
    return {
      types: []
    };
  },
  created() {
    if (!this.$route.query.types) {
      this.$router.replace({
        query: { types: this.selectedListTypes.join(",") }
      });
    }
    this.updateTypes(this.$route.query);
    this.updateFilterlist(this.types);
  },
  beforeRouteUpdate(to, from, next) {
    if (from.query.types) {
      this.updateTypes(to.query);
      this.updateFilterlist(this.types);
    }
    next();
  },
  computed: {
    ...mapState("filterlist", ["lists"]),
    ...mapGetters("sociallist", ["filtered"]),
    ...mapGetters("filterlist", ["selectedListTypes"]),
    sociallist() {
      return this.filtered(this.types);
    }
  },
  methods: {
    ...mapMutations("filterlist", [TOGGLE]),
    ...mapActions("sociallist", [FETCH]),
    ...mapActions("common", [NOTIFY]),
    async loader() {
      const type = randomFrom(this.types);
      await this[FETCH]({ type });
      this[NOTIFY]({ type });
    },
    updateFilterlist(types) {
      this.lists.forEach(item => {
        const willSelect = types.includes(item.type);
        if (item.selected === willSelect) return;
        this[TOGGLE]({
          type: item.type,
          enabled: willSelect
        });
      });
    },
    updateTypes(query) {
      this.types =
        (query.types && query.types.split(",")) || this.selectedListTypes;
    }
  }
};
</script>

<style lang="postcss" scoped>
#Social {
}
</style>
