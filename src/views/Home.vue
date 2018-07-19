<template>
  <div id="Home" class="Page">
    <div v-for="item in list" :key="item">
      {{ item }}
    </div>
    <LoaderButton :action="loader" :limit="1">Yükle</LoaderButton>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { NOTIFY } from "@/store/modules/common/types";
import { FETCH } from "@/store/modules/sociallist/types";
import { twitter } from "@/api";

import { randomFrom } from "@/mock";

export default {
  name: "Home",
  data() {
    return {
      list: []
    };
  },
  methods: {
    ...mapActions("sociallist", [FETCH]),
    ...mapActions("common", [NOTIFY]),
    async loader() {
      let timeline = await twitter.token();
      this.list = [...timeline, ...list];
      console.log(timeline);
    }
  }
};
</script>

<style lang="postcss" scoped>
#Home {
}
</style>
