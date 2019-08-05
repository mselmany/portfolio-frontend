<template>
	<div id="Home" class="Page">
		<div v-for="item in list" :key="item.id">{{ item.repo.name }}</div>
		<LoaderButton :action="loader" :limit="1">Yükle</LoaderButton>
	</div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      list: [],
      page: 1,
      pageToken: ""
    };
  },
  methods: {
    async loader() {
      // const r = await this.$api.get(
      //   "/bucket/list" /* {
      //   params: { filter: "twitter,github,medium,pocket" }
      // } */
      // );
      // console.log(r);
    }
  }
};
</script>

<style lang="postcss" scoped>
#Home {
}
</style>
