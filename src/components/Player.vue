<template>
	<div class="Player" v-if="list.length">
		<ul class="Player__Playlist Utils--unorderedList">
			<li
				class="Player__PlaylistItem"
				v-for="l in list"
				:key="l.id"
				:class="{'__playing': l.__state.playing}"
			>
				<div class="Player__Line Player__LineCounter Utils--textEllipsis">
					<span>{{l.meta.title}}</span>
					<span class="Player__LineButton Player__LineButton--play" @click="playPause(l)">
						<div
							class="Icon __mode-contain __actions __white"
							:class="l.__state.playing ? '__pause' : '__play'"
						></div>
					</span>
					<span class="Player__LineButton Player__LineButton--remove" @click="toggleFromPlaylist(l.id)">
						<div
							class="Icon __mode-contain __actions __white"
							:class="l.__state.addedToPlaylist ? '__removeFromPlaylist': '__addToPlaylist'"
						></div>
					</span>
				</div>
				<div
					class="Player__Progress"
					ref="progressBar"
					@click="updateProgressbar"
					v-if="l.__state.playing"
				>
					<div class="Player__ProgressRail">
						<div class="Player__ProgressStatus" :style="{'width': l.__state.percentage + '%'}"></div>
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
// TODO@5: Geliştir!!
// TODO@3: Float/pin halindeki mediayı(diğerlerinide - video gibi..) resize edilebilir yap.
// TODO@5: Autoplay,tekrar oynat, shuffle mode yap, ses butonu ekle
import { updateProgressbar, playPause } from "@/helpers/media";
import { mapActions, mapState } from "vuex";
import { TOGGLE_FROM_PLAYLIST } from "@/store/modules/player/types";

export default {
	name: "Player",
	computed: {
		...mapState("player", ["playlist", "current"]),
		list() {
			let list = [];
			if (this.current && !this.current.__state.addedToPlaylist) {
				list = [this.current, ...this.playlist];
			} else {
				list = this.playlist;
			}
			return list;
		}
	},
	methods: {
		...mapActions("player", [TOGGLE_FROM_PLAYLIST]),
		playPause(l) {
			playPause(l.source);
		},
		updateProgressbar(event) {
			updateProgressbar({
				event,
				source: this.current.source,
				progressBar: this.$refs.progressBar[0]
			});
		},
		toggleFromPlaylist(id) {
			this[TOGGLE_FROM_PLAYLIST](id);
		}
	}
};
</script>

<style lang="postcss" scoped>
@import url("../styles/variables.css");
.Player {
	--BackgroundColor: var(--DefaultColor);
	--Color: var(--DefaultBackgroundColor);
	--HoverBackgroundColor: #222;
	--ProgressBgColor: rgba(255, 0, 0, 0.3);
	--ProgressColor: #cd201f;

	font-size: 0.85rem;
	text-align: left;
	width: 18em;
	max-height: 22rem;
	position: fixed;
	bottom: 0.5rem;
	right: 0.5rem;
	z-index: 9000;
	overflow-x: auto;
	background-color: var(--BackgroundColor);
	color: var(--Color);
	user-select: none;

	& .Player__Playlist {
		counter-reset: Player;
		padding: 0.5rem 0;
	}

	& .Player__PlaylistItem {
		counter-increment: Player;
		position: relative;
		padding: 0.5rem 1rem;

		&:hover {
			background-color: var(--HoverBackgroundColor);

			& .Player__LineCounter:before {
				visibility: hidden;
			}

			& .Player__LineButton {
				display: block;
			}
		}

		&.__playing {
			font-weight: 600;
			& .Player__LineProgress {
				display: block;
			}
			& .Player__LineCounter:before {
				visibility: hidden;
			}
			& .Player__LineButton--play {
				display: block;
				color: transparent;
			}
		}
	}

	& .Player__Progress {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		padding-top: 0.4rem;
		overflow: hidden;
		cursor: pointer;

		&:hover {
			& .Player__ProgressRail {
				background-color: var(--ProgressBgColor);
			}
		}
	}

	& .Player__ProgressRail {
		width: 100%;
	}

	& .Player__ProgressStatus {
		width: auto;
		height: 1px;
		background-color: var(--ProgressColor);
	}

	& .Player__Line {
		position: relative;
	}

	& .Player__LineCounter:before {
		content: counter(Player) " ･";
		padding-right: 0.5rem;
		opacity: 0.75;
	}

	& .Player__LineButton {
		display: none;
		width: 0.75rem;
		height: 0.75rem;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		cursor: pointer;
		color: var(--HoverBackgroundColor);
		background-color: currentColor;
		box-shadow: 0 0 0.25rem 0.5rem currentColor;

		&.Player__LineButton--play {
			left: 0;
		}
		&.Player__LineButton--remove {
			right: 0;
		}
	}
}
</style>
