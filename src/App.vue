<template>
	<div id="app" :class="css">
		<SidebarMenu>
			<Toolbox slot="toolbox"/>
		</SidebarMenu>
		<router-view/>
		<Notification/>
		<Player/>
	</div>
</template>

<script>
import { mapState } from "vuex";

export default {
	name: "app",
	computed: {
		...mapState("common", ["css"])
	}
};
</script>

<style lang="postcss">
@import url("./styles/index.css");
#app {
	height: 100%;
}
</style>
