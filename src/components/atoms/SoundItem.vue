<template>
	<div class="Sound">
		<figure>
			<audio controls :src="data.src"></audio>
		</figure>
	</div>
</template>

<script>
import { formatTime } from "@/helpers/utils";

export default {
	name: "SoundItem",
	props: {
		data: {
			type: Object,
			required: true
		},
		state: {
			type: Object,
			required: false
		},
		disableSticky: {
			type: Function,
			default: _ => {}
		}
	},
	mounted() {},
	beforeDestroy() {},
	computed: {},
	methods: {}
};
</script>

<style lang="postcss" scoped>
@import url("../../styles/variables.css");

.Sound {
	--BackgroundColor: var(--DefaultColor);
	--Color: var(--DefaultBackgroundColor);
	--Transition: var(--DefaultTransition);

	--ProgressBarHeight: 2rem;
	--ProgressHeight: 0.2rem;
	--ProgressColor: #cd201f;
	--ProgressBgColor: var(--DefaultColor);

	display: block;
	width: 100%;
	height: 100%;
	font-size: 1rem;
	position: relative;
	margin: 0;
	padding: 0;

	display: flex;
	justify-content: center;
	align-items: center;

	& .__Hover,
	& figure:hover .__NotHover {
		display: none !important;
	}
	& figure:hover .__Hover {
		display: block !important;
		&._Layer {
			display: flex !important;
		}
	}

	& figure {
		display: block;
		position: relative;
		margin: 0;
		padding: 0;
		max-width: 100%;
		max-height: 100%;
	}

	& ._Controls {
		width: 1px;
		height: 0;
		position: static;
		& ._Layer {
			display: flex;
			flex-direction: row;
			position: absolute;
			z-index: 2;
			background-color: greenyellow;

			&.__topLeft {
				top: 0.5rem;
			}
			&.__topRight {
				top: 0.5rem;
			}
			&.__bottomRight {
				bottom: 0.5rem;
			}
			&.__bottomLeft {
				bottom: 0.5rem;
			}
			&.__topLeft,
			&.__bottomLeft {
				left: 0.5rem;
				/* & > *:not(:last-of-type) {
          margin-right: 0.5rem;
        } */
			}
			&.__topRight,
			&.__bottomRight {
				right: 0.5rem;
				flex-direction: row-reverse;

				/* & > *:not(:last-of-type) {
          margin-left: 0.5rem;
        } */
			}
		}
		& ._Item {
			width: 1.25rem;
			height: 1.25rem;
			background-color: var(--BackgroundColor);
			position: relative;
			cursor: pointer;
			border: 0.3rem solid;
			& ._Icon {
				background-size: contain;
			}
		}
	}
	& ._PlayPauseArea {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 1;
		cursor: pointer;
	}
	& ._Player {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 2;

		& ._Container {
			width: auto;
			position: relative;
			transition: var(--Transition);
		}

		& ._Panel {
			width: 100%;
			position: relative;
			z-index: 2;
			padding: 0 1rem;
			font-size: 0.8rem;
			line-height: 1rem;
			color: var(--BackgroundColor);
			transition: var(--Transition);
			opacity: 0;
			visibility: hidden;
		}

		& ._ProgressBar {
			width: 100%;
			height: 1rem;
			display: block;
			transition: var(--Transition);
			cursor: pointer;

			& ._Progress {
				width: auto;
				height: calc(var(--ProgressHeight) / 2);
				min-height: 2px;
				display: block;
				position: absolute;
				left: 0;
				right: 0;
				bottom: 0;
				background-color: var(--ProgressBgColor);
				transition: inherit;
				cursor: pointer;

				& ._Indicator {
					height: 100%;
					display: block;
					position: relative;
					background-color: var(--ProgressColor);

					&:after {
						content: "";
						box-sizing: initial;
						width: var(--ProgressHeight);
						height: var(--ProgressHeight);
						position: absolute;
						top: -0.3rem;
						right: calc(((var(--ProgressHeight) / 2) + 0.3rem) * -1);
						border: 0.3rem solid currentColor;
						background-color: var(--Color);
						color: var(--Color);
						box-shadow: 0 0 calc(var(--ProgressHeight) / 2)
							color-mod(var(--BackgroundColor) a(25%));
						border-radius: 50%;
						transition: var(--Transition);
						transform: scale(0.5);
						visibility: hidden;
					}
				}
			}
		}
	}

	& figure:hover {
		& ._Player {
			& ._Container {
				margin: 0 1rem;
			}

			& ._Panel {
				padding: 0;
				opacity: 1;
				visibility: visible;
			}

			& ._ProgressBar {
				height: var(--ProgressBarHeight);

				&:hover ._Indicator:after {
					transform: scale(1);
				}

				& ._Progress {
					height: var(--ProgressHeight);
					bottom: calc(1rem - (var(--ProgressHeight) / 2));

					& ._Indicator:after {
						visibility: visible;
					}
				}
			}
		}
	}
}
</style>
