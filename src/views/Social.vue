<template>
  <div id="Social" class="Page">
    <FilterList/>
    <SocialList v-infinite-loader="loader"/>
    <!-- <SocialList/> -->
    <LoaderButton :action="loader" :limit="1">Yükle</LoaderButton>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import { MARK_AS_VIEWED } from "@/store/modules/sociallist/types";
import { TOGGLE } from "@/store/modules/filterlist/types";
import { updateQuery } from "@/helpers/utils";

export default {
  name: "Social",
  data() {
    return {
      types: []
    };
  },
  computed: {
    ...mapState("filterlist", { filterlist: "lists" }),
    ...mapGetters("filterlist", {
      filterlist_selectedListTypes: "selectedListTypes"
    })
  },
  created() {
    if (!this.$route.query.types) {
      updateQuery({ types: this.filterlist_selectedListTypes.join(",") }, true);
    }
    this.updateTypes(this.$route.query);
    this.updateFilterlist();
  },
  beforeRouteUpdate(to, from, next) {
    if (from.query.types) {
      this.updateTypes(to.query);
      this.updateFilterlist();
    }
    next();
  },
  methods: {
    ...mapMutations("filterlist", [TOGGLE]),
    ...mapActions("sociallist", [MARK_AS_VIEWED]),
    async loader() {
      this[MARK_AS_VIEWED]({ types: this.filterlist_selectedListTypes });
    },
    updateFilterlist() {
      this.filterlist.forEach(item => {
        const willSelect = this.types.includes(item.type);
        if (item.selected === willSelect) return;
        this[TOGGLE]({
          type: item.type,
          enabled: willSelect
        });
      });
    },
    updateTypes(query) {
      this.types =
        (query.types && query.types.split(",")) ||
        this.filterlist_selectedListTypes;
    }
  }
};
</script>

<style lang="postcss" scoped>
#Social {
}
</style>
