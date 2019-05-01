<template>
	<figure class="Sound">
		<!-- <audio ref="audio" preload="metadata" :src="data.src"></audio> -->
		<div class="Sound__Player" :class="{'Sound__Player--touched': media.__state.playing}">
			<div
				class="Sound__Artwork"
				@click="playPause()"
				:style="{'transform': `rotate(${(media.__state.currentTime % 360) * 2.5}deg) translateZ(0)`}"
			>
				<img draggable="false" :src="data.artwork">
			</div>
			<div
				class="Sound__Progress"
				ref="progressBar"
				@click="updateProgressbar"
				v-if="media.__state.currentTime > 0"
			>
				<div class="Sound__ProgressRail">
					<div class="Sound__ProgressStatus" :style="{'width': media.__state.percentage + '%'}"></div>
				</div>
			</div>
		</div>
		<div class="Sound__Meta">
			<div class="Sound__Actions __oneLine">
				<div class="Sound__Button" @click="playPause()">
					<div
						class="Icon __mode-contain __actions __black"
						:class="media.__state.playing ? '__pause': '__play'"
					></div>
				</div>
				<div class="Sound__Button" @click="addToPlaylist();">
					<div
						class="Icon __mode-contain __actions __black"
						:class="media.__state.addedToPlaylist ? '__toggleToPlaylist': '__addToPlaylist'"
					></div>
				</div>
				<span
					class="Utils--tabular"
				>{{media.__state.formattedCurrentTime}}∙{{media.__state.formattedDuration}}</span>
			</div>
			<div class="Sound__Title __oneLine" v-if="data.title">
				<span>{{data.title}}</span>
			</div>
			<div class="Sound__Label __oneLine" v-if="data.label">
				<span>{{data.label}}</span>
			</div>
		</div>
	</figure>
</template>

<script>
import { formatTime, raf, generateId, error } from "@/helpers/utils";
import { updateProgressbar, changeVolume, playPause } from "@/helpers/media";
import { mapActions, mapMutations, mapState, mapGetters } from "vuex";
import {
	TOGGLE_FROM_PLAYLIST,
	REGISTER,
	UPDATE_STATUS,
	UPDATE_CURRENT
} from "@/store/modules/player/types";

export default {
	name: "SoundItem",
	props: {
		data: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			id: this.data.id
		};
	},
	computed: {
		...mapGetters("player", ["getMedia"]),
		media() {
			return this.getMedia(this.id);
		}
	},
	created() {
		this[REGISTER]({
			id: this.id,
			type: "sound",
			src: this.data.src,
			meta: {
				title: this.data.title,
				label: this.data.label
			}
		});
		// TODO@3: Progressbar mouse sürükle-bırak ile ileri-geri sarılabilmeli.
		// TODO@3: Float/pin halindeki mediayı(audio) resize edilebilir yap.
	},
	beforeDestroy() {
		this.media.source.pause();
	},
	methods: {
		...mapActions("player", [REGISTER, TOGGLE_FROM_PLAYLIST]),
		addToPlaylist() {
			this[TOGGLE_FROM_PLAYLIST](this.id);
		},
		updateProgressbar(event) {
			updateProgressbar({
				event,
				source: this.media.source,
				progressBar: this.$refs.progressBar
			});
		},
		playPause() {
			playPause(this.media.source);
			setTimeout(() => {
				this.$emit("playPause", this.media);
			});
		},
		changeVolume() {
			changeVolume(this.media.source);
		},
		disableStickyAndScroll() {
			if (this.actions.sticky) {
				this.actions.sticky.disable({ scrollTo: this.$el });
			}
		},
		disableStickyAndPause() {
			this.media.source.pause();
			if (this.actions.sticky && this.actions.sticky.active) {
				this.actions.sticky.disable();
			}
		}
	}
};
</script>

<style lang="postcss" scoped>
@import url("../../styles/variables.css");

.Sound {
	--Size: 4.5rem;
	--BackgroundColor: var(--DefaultColor);
	--Color: var(--DefaultBackgroundColor);
	--Transition: var(--DefaultTransition);

	--BoxShadow: 0 1px 4px 0 #ccc;
	--ProgressHeight: 0.2rem;
	--ProgressBgColor: rgba(0, 0, 0, 0.25);
	--ProgressColor: #cd201f;

	display: block;
	width: 100%;
	font-size: 1rem;
	position: relative;
	margin: 0;
	padding: 1rem 0;

	display: flex;
	/* justify-content: center; */
	align-items: center;

	& .Sound__Player {
		display: block;
		width: var(--Size);
		height: var(--Size);
		transition: var(--Transition);

		&.Sound__Player--touched {
			transform: scale(0.95);
		}
	}

	& .Sound__Artwork {
		display: block;
		width: 100%;
		height: 100%;
		background-color: var(--Color);
		box-shadow: var(--BoxShadow);
		border-radius: 50%;
		overflow: hidden;
		transition: 0.1s linear;
		will-change: transform;
		cursor: pointer;

		& > img {
			width: 100%;
			height: 100%;
		}
		/*
		&::before,
		&::after {
			content: "";
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			background-color: var(--Color);
			border-radius: 50%;
		}

		&::before {
			width: 2rem;
			height: 2rem;
			z-index: 1;
			opacity: 0.75;
		}
		&::after {
			width: 1rem;
			height: 1rem;
			z-index: 2;
			box-shadow: 0 0 3px 0 #ccc inset;
		} */
	}

	& .Sound__Progress {
		width: 50%;
		margin: auto;
		margin-top: 0.5rem;
		padding: 0.15rem 0;

		&:hover .Sound__ProgressRail {
			height: calc(var(--ProgressHeight) + 0.1rem);
			transform: translateY(-0.05rem);
		}
	}

	& .Sound__ProgressRail {
		width: 100%;
		height: var(--ProgressHeight);
		background-color: var(--ProgressBgColor);
		border-radius: 1rem;
		overflow: hidden;
		cursor: pointer;
		transition: var(--Transition);
	}

	& .Sound__ProgressStatus {
		width: auto;
		height: 100%;
		background-color: var(--ProgressColor);
	}

	& .Sound__Button {
		display: inline-block;
		position: relative;
		width: 0.75rem;
		height: 0.75rem;
		margin-right: 0.5rem;
		cursor: pointer;
	}

	& .Sound__Meta {
		width: calc(100% - var(--Size));
		padding-left: 1rem;
	}

	& .Sound__Actions {
		font-size: 0.85rem;
	}

	& .Sound__Title {
		/* text-transform: capitalize; */
	}

	& .Sound__Label {
		font-family: "Playfair Display";
		font-style: italic;
	}

	& .__oneLine {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		&:not(:last-child) {
			padding-bottom: 0.5rem;
		}
	}

	/* & .Sound--playing {
		animation: Sound--playing 10s linear infinite;
	} */
}

/* @keyframes Sound--playing {
	from {
		transform: rotate(0);
	}
	to {
		transform: rotate(1turn);
	}
} */
</style>
