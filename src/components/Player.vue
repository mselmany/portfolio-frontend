<template>
	<div class="Player">
		<!-- <div class="Player__Controls"></div> -->
		<ul class="Player__Playlist Utils--unorderedList">
			<li
				class="Player__PlaylistItem"
				v-for="l in list"
				:key="l.id"
				:class="l.meta.title === 'Safinteam - The Dellusion (Original Mix)' && '__playing'"
			>
				<div class="Player__Line Player__LineCounter Utils--textEllipsis">
					<span>{{l.meta.title}}</span>
					<span class="Player__LineButton __play" @click="playPause(l)">
						<div
							class="Icon __mode-contain __actions __white"
							:class="l.source.paused ? '__pause' : '__play'"
						></div>
					</span>
					<span class="Player__LineButton __remove" @click="removeFromPlaylist(l.id)">
						<div class="Icon __mode-contain __actions __white __removeFromPlaylist"></div>
					</span>
				</div>
				<div class="Player__LineProgress" :style="{'width': '11%'}"></div>
			</li>
		</ul>
	</div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { TOGGLE } from "@/store/modules/player/types";

export default {
	name: "Player",
	data() {
		return {
			current: null
		};
	},
	computed: {
		...mapState("player", ["list"])
	},
	methods: {
		...mapActions("player", [TOGGLE]),
		playPause(item) {
			item.actions.playPause();
			this.current = item;
		},
		removeFromPlaylist(id) {
			this[TOGGLE]({ id });
		}
	}
};

/* TODO@5 : Sound componentinde audioyu set etme sadece placeholder koy.
bunun yerine player storunda currente ata ve o anki mediayı player statınde çal.
ayrıca tüm sitedeki media yı player storuna registeret, sadece store da oynat, tek biyerden(storedan yönet herşeyi)
 */
</script>

<style lang="postcss" scoped>
@import url("../styles/variables.css");
.Player {
	--BackgroundColor: var(--DefaultColor);
	--Color: var(--DefaultBackgroundColor);
	--HoverBackgroundColor: #222;
	--ProgressColor: #cd201f;

	font-size: 0.85rem;
	text-align: left;
	width: 18em;
	max-height: 25rem;
	position: fixed;
	bottom: 0.5rem;
	right: 0.5rem;
	z-index: 9000;
	overflow-x: auto;
	background-color: var(--BackgroundColor);
	color: var(--Color);
	user-select: none;

	& .Player__Controls {
		height: 5rem;
	}

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
			& .Player__LineButton.__play {
				display: block;
				color: transparent;
			}
		}
	}

	& .Player__LineProgress {
		display: none;
		width: auto;
		height: 1px;
		position: absolute;
		left: 0;
		bottom: 0;
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

		&.__play {
			left: 0;
		}
		&.__remove {
			right: 0;
		}
	}
}
</style>
