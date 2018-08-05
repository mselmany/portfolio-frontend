<template>
  <div id="Home" class="Page">
    <div v-for="item in list" :key="item.id">
      {{ item.repo.name }}
    </div>
    <LoaderButton :action="loader" :limit="1">Yükle</LoaderButton>
  </div>
</template>

<script>
// import Github from "@/api/Github";
// import Raindrop from "@/api/Raindrop";
// import Soundcloud from "@/api/Soundcloud";
import Medium from "@/api/Medium";
import axios from "axios";

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
      var youtube_playlist_id = "PL2v0NJ-7QYEXdb2XCECHfEYhiN0kKVjsp";
      // let g = await Github.events({ page: this.page });
      // let g = await Raindrop.collection();
      // let g = await Soundcloud.track({ id: 158555288 });
      // let g = await Youtube.activities({ pageToken: this.pageToken });
      // let g = await Youtube.playlistVideos({ playlistId: youtube_playlist_id });
      // let g = await Youtube.video({ id: "T6GrsA2Q6jg" });
      // let g = await Medium.latest();

      let g = await axios.post("https://dribbble.com/oauth/token", {
        params: {
          client_id:
            "cdc4746754748a20353c77dcc303525ae65c812ee7434ef1771ceda7bbaf5199",
          client_secret:
            "e28b0b8d910c0943e9e8b10fbcedd1276be2247fb21a5f4037590b4f1c4c0cb1",
          code:
            "64e168836e70b4437d06a47f35ad51aec652485cf7184f560ee17735527c76f0"
        }
      });
      console.log(g);
      // this.list = [...this.list, ...g.data];
      this.page++;
    }
  }
};
</script>

<style lang="postcss" scoped>
#Home {
}
</style>
