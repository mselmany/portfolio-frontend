<template>
  <div id="app">
    <SidebarMenu>
      <Toolbox slot="toolbox" />
    </SidebarMenu>
    <router-view/>
    <Notification/>
  </div>
</template>

<script>
export default {
  name: "app"
};
</script>
 
<style lang="postcss">
@import url("./styles/index.css");
#app {
  height: 100%;
}
</style>
