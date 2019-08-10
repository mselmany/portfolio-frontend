<template>
	<figure class="Sound">
		<div class="Sound__Player" :class="{'Sound__Player--touched': media.__state.playing}">
			<div
				class="Sound__Artwork"
				@click="playPause()"
				:style="{'transform': `rotate(${(media.__state.currentTime % 360) * 2.5}deg) translateZ(0)`}"
			>
				<img draggable="false" :src="media.meta.artwork" />
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
			<div class="Sound__MetaLine Sound__Actions Utils--textEllipsis">
				<div class="Sound__Button" @click="playPause()">
					<div
						class="Icon __mode-contain __actions __black"
						:class="media.__state.playing ? '__pause': '__play'"
					></div>
				</div>
				<div class="Sound__Button" @click="toggleFromPlaylist();">
					<div
						class="Icon __mode-contain __actions __black"
						:class="media.__state.addedToPlaylist ? '__toggleToPlaylist': '__addToPlaylist'"
					></div>
				</div>
				<span
					class="Utils--tabular"
				>{{media.__state.formattedCurrentTime}}∙{{media.__state.formattedDuration}}</span>
			</div>
			<div class="Sound__MetaLine Sound__Title Utils--textEllipsis" v-if="media.meta.title">
				<span>{{media.meta.title}}</span>
			</div>
			<div class="Sound__MetaLine Sound__Label Utils--textEllipsis" v-if="media.meta.label">
				<span>{{media.meta.label}}</span>
			</div>
		</div>
	</figure>
</template>

<script>
// TODO@3: Progressbar mouse sürükle-bırak ile ileri-geri sarılabilmeli.
import { updateProgressbar, changeVolume, playPause } from "@/helpers/media";

export default {
	name: "SoundItem",
	props: {
		media: {
			type: Object,
			required: true
		}
	},
	methods: {
		toggleFromPlaylist() {
			this.$emit("toggleFromPlaylist", this.media.id);
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

	& .Sound__MetaLine {
		min-height: 1.3rem;
		&:not(:last-child) {
			margin-bottom: 0.5rem;
		}
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
}
</style>
