<template>
  <div class="Dribbble">
    <MetaInfo :meta="meta"/>
    <Media :list="media"/>
    <div class="_Title">{{data.title}}</div>
    <div class="_Body" v-html="data.description"></div>
  </div>
</template>

<script>
export default {
  name: "Dribbble",
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      meta: {
        url: this.data.html_url,
        date: this.data.__createdAt,
        type: this.data.__source.type,
        name: this.data.__source.name
      },
      media: [
        {
          type: "photo",
          title: this.data.title,
          src: this.data.images.hidpi
        }
      ]
    };
  }
};
</script>

<style lang="postcss" scoped>
@import url("../styles/variables.css");
.Dribbble {
}
</style>
