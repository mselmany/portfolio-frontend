<template>
	<div class="Photo">
		<div class="_Content">
			<img
				:src="data.src"
				:alt="data.alt"
				:data-broken="$t('BROKEN_IMAGE')"
				@click="toggleFullscreen()"
			>
			<div class="_Alt">
				<div class="_Text" v-html="data.alt"></div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "PhotoItem",
	props: {
		data: {
			type: Object,
			required: true
		},
		state: {
			type: Object,
			required: true
		},
		hooks: {
			type: Object
		}
	},
	langs: {
		BROKEN_IMAGE: {
			tr: "Görüntü yüklenemedi",
			en: "Failed to load image"
		}
	},
	methods: {
		toggleFullscreen() {
			this.hooks.fullscreen.toggle();
		}
	}
};
</script>

<style lang="postcss" scoped>
@import url("../../styles/variables.css");

.Photo {
	--BackgroundColor: var(--DefaultColor);
	--Color: var(--DefaultBackgroundColor);
	--DotPatternImage: url("../../assets/background_patterndot.svg");

	display: block;
	width: 100%;
	height: 100%;
	position: relative;
	font-size: 1rem;
	user-select: none;

	& ._Content {
		width: 100%;
		height: 100%;
		position: relative;

		display: flex;
		justify-content: center;
		align-items: center;

		& img {
			display: block;
			width: 100%;
			height: 100%;
			position: relative;
			object-fit: contain;
			/* border-radius: 0.25rem; */
			overflow: hidden;
			cursor: zoom-in;

			font-size: 0;
			line-height: 5rem;

			&:before {
				content: "";
				display: block;
				position: absolute;
				z-index: 1;
				left: 0;
				top: 0;
				right: 0;
				bottom: 0;
				background-color: var(--Color);
				background-image: var(--DotPatternImage);
			}
			&:after {
				content: attr(data-broken);
				max-width: 70%;
				display: inline-block;
				position: absolute;
				top: 50%;
				left: 50%;
				z-index: 2;
				transform: translateX(-50%) translateY(-50%);
				padding: 0 0.3rem;
				background-color: var(--Color);
				font-size: 0.8rem;
				line-height: 1.25rem;
				/* font-weight: bold; */
				font-style: italic;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}

		& ._Alt {
			display: none;
			max-width: 10rem;
			padding: 1rem;
			position: absolute;
			right: 0;
			bottom: 0;
			z-index: 3;
			& ._Text {
				padding: 0.75rem;
				color: var(--BackgroundColor);
				text-shadow: -1px -1px 15px var(--Color), 1px 1px 15px var(--Color),
					-1px 1px 15px var(--Color), 1px -1px 15px var(--Color);
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			&:hover {
				max-width: 100%;
				opacity: 1;
				& ._Text {
					background-color: var(--BackgroundColor);
					color: var(--Color);
					text-shadow: none;
				}
			}
		}
	}
}
</style>

<style lang="postcss">
@import url("../../styles/variables.css");

.Media.__Fullscreen .Photo {
	& img {
		cursor: zoom-out;
	}
	& ._Alt {
		display: block;

		& ._Text * {
			margin: 0;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		&:hover {
			& ._Text,
			& ._Text * {
				white-space: initial;
			}
		}
	}
}
</style>