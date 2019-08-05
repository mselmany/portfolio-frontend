<template>
	<div class="Soundcloud __withMedia" v-if="track">
		<MetaInfo :meta="meta"/>
		<SoundItem :media="media" @toggleFromPlaylist="toggleFromPlaylist"/>
	</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { TOGGLE_FROM_PLAYLIST, REGISTER } from "@/store/modules/player/types";
import Soundcloud from "@/api/Soundcloud";
import { formatTime } from "@/helpers/utils";

export default {
	name: "Soundcloud",
	props: {
		data: {
			type: Object,
			required: true
		}
	},
	data() {
		const isComment = this.data.__source.type === "comments";
		const needTrackData = isComment && !this.data.track;
		return {
			isComment,
			needTrackData,
			meta: {
				url: isComment ? this.data.user.permalink_url : this.data.permalink_url,
				date: this.data.__createdAt,
				type: this.data.__source.type,
				name: this.data.__source.name
			},
			comment: !isComment
				? null
				: {
						id: this.data.id,
						user: this.data.user,
						body: this.data.body,
						timestamp: formatTime(this.data.timestamp),
						track_id: this.data.track_id
				  },
			track: needTrackData ? null : getTrackModel(this.data.track || this.data)
		};
	},
	computed: {
		...mapGetters("player", ["getMedia"]),
		media() {
			return this.getMedia(this.track.id);
		}
	},
	async created() {
		if (this.needTrackData) {
			const t = await this.fetchCommentedTrack(this.data.track_id);
			this.data.track = t;
			this.track = getTrackModel(t);
		}
		this.register();
	},
	methods: {
		...mapActions("player", [REGISTER, TOGGLE_FROM_PLAYLIST]),
		register() {
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
		toggleFromPlaylist(id) {
			this[TOGGLE_FROM_PLAYLIST](id);
		},
		async fetchCommentedTrack(id) {
			if (!id) return null;
			try {
				const t = await Soundcloud.track({ id });
				return t.data.data;
			} catch (error) {
				console.log(error);
			}
		}
	}
};

function getTrackModel(data) {
	if (!data) return null;
	return {
		type: "sound",
		src: data.stream_url + "?client_id=d01accc030bfaa3bb48783eb7f2db5e6",
		permalink: data.permalink_url,
		duration: data.duration,
		id: data.id,
		title: data.title,
		genre: data.genre,
		label: data.label_name,
		artwork: data.artwork_url,
		waveform: data.waveform_url,
		counts: {
			playback: data.playback_count,
			favorite: data.favoritings_count,
			comment: data.comment_count
		}
	};
}
</script>

<style lang="postcss" scoped>
@import url("../../styles/variables.css");
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
