<template>
	<figure class="Sound">
		<audio ref="audio" preload="metadata" :src="data.src"></audio>
		<div class="Sound__Player" :class="{'Sound__Player--touched': data.__state.playing}">
			<img
				class="Sound__Artwork"
				draggable="false"
				@click="playPause()"
				:src="data.artwork"
				:style="{'transform': `rotate(${(data.__state.currentTime % 360) * 2.5}deg) translateZ(0)`}"
			>
			<div
				class="Sound__Progress"
				ref="progressBar"
				@click="updateProgressbar"
				v-if="data.__state.currentTime > 0"
			>
				<div class="Sound__ProgressRail">
					<div class="Sound__ProgressStatus" :style="{'width': data.__state.percentage + '%'}"></div>
				</div>
			</div>
		</div>
		<div class="Sound__Meta">
			<div class="Sound__Actions __oneLine">
				<div class="Sound__Button" @click="playPause()">
					<div
						class="Icon __mode-contain __actions __black"
						:class="data.__state.playing ? '__pause': '__play'"
					></div>
				</div>
				<div class="Sound__Button" @click="addToPlaylist();">
					<div
						class="Icon __mode-contain __actions __black"
						:class="data.__state.liked ? '__toggleToPlaylist': '__addToPlaylist'"
					></div>
				</div>
				<span class="Utils--tabular">{{formattedCurrentTime}}∙{{formattedDuration}}</span>
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
import { formatTime, raf, generateId } from "@/helpers/utils";
import { mapActions, mapState } from "vuex";
import { ADD, REMOVE, TOGGLE } from "@/store/modules/player/types";

export default {
	name: "SoundItem",
	props: {
		data: {
			type: Object,
			required: true,
			default: () => ({ __state: {} })
		},
		state: {
			type: Object
		},
		actions: {
			type: Object,
			default: () => ({})
		}
	},
	computed: {
		...mapState("player", ["list"]),
		formattedCurrentTime() {
			return formatTime(this.data.__state.currentTime);
		},
		formattedDuration() {
			return formatTime(this.data.__state.duration);
		}
	},
	created() {
		this.actions.playPause = this.playPause;
	},
	mounted() {
		const audio = this.$refs.audio;

		this.init();
		if (this.list.length < 15) {
			this.addToPlaylist();
		}

		audio.addEventListener("loadedmetadata", () => {
			let { duration } = audio;
			this.data.__state.duration = duration;

			if (this.actions.onLoad) {
				this.actions.onLoad(this.data.__state);
			}
		});

		audio.addEventListener("volumechange", () => {
			let { volume, muted } = audio;
			this.data.__state.volume = volume;
			this.data.__state.muted = muted;

			if (this.actions.onVolumeChange) {
				this.actions.onVolumeChange(this.data.__state);
			}
		});

		audio.addEventListener("timeupdate", () => {
			let { duration, currentTime, paused, ended } = audio;
			if (this.data.__state.duration === 0) {
				this.data.__state.duration = duration;
			}
			this.data.__state.currentTime = currentTime;
			this.data.__state.percentage = Math.floor((currentTime / duration) * 100);
			this.data.__state.playing = !(paused || ended);

			if (this.actions.onTimeUpdate) {
				this.actions.onTimeUpdate(this.data.__state);
			}
		});

		// TODO@3: Progressbar mouse sürükle-bırak ile ileri-geri sarılabilmeli.
		// TODO@3: Float/pin halindeki mediayı(audio) resize edilebilir yap.
	},
	beforeDestroy() {
		this.pause();
	},
	methods: {
		...mapActions("player", [TOGGLE]),
		init() {
			const audio = this.$refs.audio;

			if (!this.data.__state.initialized) {
				this.data.__state = {
					...this.data.__state,
					id: generateId(),
					initialized: true,
					playing: false,
					duration: 0,
					currentTime: 0,
					percentage: 0,
					volume: audio.volume || 1,
					muted: audio.muted || false,
					liked: false
				};
			} else {
				const {
					currentTime = 0,
					volume = 1,
					muted = false
				} = this.data.__state;
				audio.currentTime = currentTime;
				audio.volume = volume;
				audio.muted = muted;
			}
		},
		addToPlaylist() {
			const { type, permalink, title, label, artwork } = this.data;

			this.data.__state.liked = !this.data.__state.liked;

			this[TOGGLE]({
				id: this.data.__state.id,
				type,
				source: this.$refs.audio,
				actions: {
					playPause: this.playPause,
					changeVolume: this.changeVolume,
					updateProgressbar: this.updateProgressbar
				},
				meta: { permalink, title, label, artwork }
			});
		},
		updateProgressbar(event) {
			const audio = this.$refs.audio,
				progressBar = this.$refs.progressBar;

			raf(() => {
				const pos =
					(event.pageX - progressBar.getBoundingClientRect().left) /
					progressBar.offsetWidth;
				audio.currentTime = pos * audio.duration;
			});

			if (this.actions.onProgressChange) {
				this.actions.onProgressChange(this.data.__state);
			}
		},
		playPause() {
			const audio = this.$refs.audio;
			if (audio.paused || audio.ended) {
				this.play();
			} else {
				this.pause();
			}

			if (this.actions.onPlayStateChange) {
				this.actions.onPlayStateChange(this.data.__state);
			}
		},
		play() {
			this.data.__state.playing = true;
			this.$refs.audio.play();
		},
		pause() {
			this.data.__state.playing = false;
			this.$refs.audio.pause();
		},
		changeVolume() {
			const audio = this.$refs.audio;
			if (audio.muted) {
				audio.muted = false;
			} else if (audio.volume <= 0.5) {
				audio.volume = 1;
			} else if (!audio.muted) {
				audio.muted = true;
				audio.volume = 0.5;
			}
		},
		disableStickyAndScroll() {
			if (this.actions.sticky) {
				this.actions.sticky.disable({ scrollTo: this.$el });
			}
		},
		disableStickyAndPause() {
			this.pause();
			if (this.actions.fullscreen && this.actions.fullscreen.active) {
				this.toggleFullscreen();
			}
			if (this.actions.sticky && this.actions.sticky.active) {
				this.actions.sticky.disable();
			}
		},
		toggleFullscreen() {
			if (this.actions.fullscreen) {
				this.actions.fullscreen.toggle();
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
