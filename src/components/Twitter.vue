<template>
  <div class="Twitter" :class="{'__withMedia': media}">
    <MetaInfo :meta="meta"/>
    <div class="_Title" v-html="data.text"></div>
    <Media v-if="media" :list="media"/>
  </div>
</template>

<script>
export default {
  name: "Twitter",
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      meta: {
        url: this.data.tweet_url,
        date: this.data.__createdAt,
        type: this.data.__source.type,
        name: this.data.__source.name
      },
      media:
        this.data.media &&
        this.data.media.map(item => {
          const type = item.type;
          switch (type) {
            case "photo":
              return {
                type,
                alt: this.data.text,
                src: item.media_url_https,
                permalink: item.url
              };
            case "video":
            case "animated_gif":
              return {
                type: "video",
                title: this.data.text,
                duration: item.video_info.duration_millis,
                thumbnail: item.media_url_https,
                permalink: item.url,
                srcset: [
                  {
                    src: item.video_info.source.url,
                    type: item.video_info.source.content_type
                  }
                ]
              };
            default:
              break;
          }
        })
    };
  }
};
</script>

<style lang="postcss" scoped>
@import url("../styles/variables.css");
.Twitter {
  --BackgroundColor: var(--DefaultColor);
  --Color: var(--DefaultBackgroundColor);
  --Transition: var(--DefaultTransition);
  &.__withMedia {
    /* background-color: var(--BackgroundColor); */
    /* color: var(--Color); */
    /* padding-bottom: 1rem; */
    /* border-radius: 0.5rem; */
    /* border: 2px solid color-mod(var(--BackgroundColor) l(+55%)); */

    & .Media {
      /* padding: 1rem 1rem 0 1rem; */
      /* border-radius: 0.5rem; */
      /* overflow: hidden; */
    }
    & .MetaInfo,
    & ._Title {
      /* padding: 0 1rem; */
      /* color: var(--Color); */
    }
  }
}
</style>
