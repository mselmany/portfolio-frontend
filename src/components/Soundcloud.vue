<template>
	<div class="Soundcloud" :class="{'__withMedia': !!track}">
		<MetaInfo :meta="meta"/>
		<!-- <Media v-if="!!media" :list="[media]"/> -->
		<SoundItem :media="media" @toggleFromPlaylist="toggleFromPlaylist"/>
	</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { TOGGLE_FROM_PLAYLIST, REGISTER } from "@/store/modules/player/types";

export default {
	name: "Soundcloud",
	props: {
		data: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			meta: {
				url: this.data.permalink_url,
				date: this.data.__createdAt,
				type: this.data.__source.type,
				name: this.data.__source.name
			},
			track: {
				__state: {},
				type: "sound",
				src:
					this.data.stream_url + "?client_id=d01accc030bfaa3bb48783eb7f2db5e6",
				permalink: this.data.permalink_url,
				duration: this.data.duration,
				id: this.data.id,
				title: this.data.title,
				genre: this.data.genre,
				label: this.data.label_name,
				artwork: this.data.artwork_url,
				waveform: this.data.waveform_url,
				counts: {
					playback: this.data.playback_count,
					favorite: this.data.favoritings_count,
					comment: this.data.comment_count
				}
			}
		};
	},
	computed: {
		...mapGetters("player", ["getMedia"]),
		media() {
			return this.getMedia(this.track.id);
		}
	},
	created() {
		this[REGISTER]({
			id: this.track.id,
			type: this.track.type,
			src: this.track.src,
			meta: {
				artwork: this.track.artwork,
				title: this.track.title,
				label: this.track.label
			}
		});
	},
	methods: {
		...mapActions("player", [REGISTER, TOGGLE_FROM_PLAYLIST]),
		toggleFromPlaylist(id) {
			this[TOGGLE_FROM_PLAYLIST](id);
		}
	}
};
</script>

<style lang="postcss" scoped>
@import url("../styles/variables.css");
.Soundcloud {
	--BackgroundColor: var(--DefaultColor);
	--Color: var(--DefaultBackgroundColor);
	--Transition: var(--DefaultTransition);
	&.__withMedia {
		/* background-color: var(--BackgroundColor);
    color: var(--Color);
    padding: 1rem 0;
    border-radius: 0.5rem;
    border: 2px solid color-mod(var(--BackgroundColor) l(+55%)); */

		& .Media {
			/* padding: 1rem 1rem 0 1rem;
      border-radius: 0.5rem;
      overflow: hidden; */
		}
		& .MetaInfo,
		& ._Title {
			/* padding: 0 1rem;
      color: var(--Color); */
		}
	}
}
</style>
