<template>
	<div class="Media">
		<div class="_FloatingContainer" v-sticky="directives.sticky" v-fullscreen="directives.fullscreen">
			<div class="_Info">
				<span class="_Item __type" :title="$t('PERMALINK')">
					<a
						:href="current.permalink"
						target="_blank"
						rel="noopener noreferrer"
					>{{$t(current.type.toUpperCase())}}</a>
				</span>
				<span
					class="_Item"
					v-if="medialist.length > 1"
				>{{current.__state.index + 1}} / {{medialist.length}}</span>
				<span class="_Item __navigation __noDot">
					<div
						class="_Icon Icon __actions __black"
						:class="current.__state.playing ? '__pause': '__play'"
						v-if="current.__state.initialized"
						@click="actions.playPause()"
					></div>
					<div class="_Icon Icon __actions __back __black" @click="prev()" v-if="medialist.length > 1"></div>
					<div class="_Icon Icon __actions __next __black" @click="next()" v-if="medialist.length > 1"></div>
					<div
						class="_Icon Icon __actions __black"
						:class="{'__fullscreenExit2': state.fullscreen.active, '__fullscreen2': !state.fullscreen.active}"
						@click="toggleFullscreen()"
					></div>
				</span>
			</div>
			<div class="_Content">
				<component
					:is="current.type + '-item'"
					:key="current.__state.index"
					:data="current"
					:state="state"
					:actions="actions"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import { KEYS } from "@/helpers/utils";

export default {
	name: "Media",
	props: {
		list: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			medialist: this.list.map((item, index) => ({
				...item,
				__state: {
					selected: index === 0,
					index
				}
			})),
			current: null,
			state: {
				sticky: {
					active: false,
					direction: null
				},
				fullscreen: {
					active: false
				}
			},
			actions: {
				onPlayStateChange: p => {
					// do not trigger sticky mode if already sticky mode or in fullscreen
					if (this.$sticky.direction || this.$fullscreen.active) {
						return;
					}

					if (p.playing) {
						this.$sticky.enable();
					} else {
						this.$sticky.disable();
					}
				}
			},
			directives: {
				sticky: {
					onChange: ctx => {
						this.state.sticky.active = ctx.active;
						this.state.sticky.direction = ctx.direction;
					},
					onDirectionChange: ctx => {
						this.state.sticky.direction = ctx.direction;
					}
				},
				fullscreen: {
					onChange: ctx => {
						this.state.fullscreen.active = ctx.active;
						if (ctx.active) {
							this.$sticky.disable();
						} else {
							if (this.current.__state.playing) {
								this.$sticky.enable();
							}
						}
					},
					onKeydown: (key, ctx) => {
						switch (key) {
							case KEYS.ESC:
								ctx.toggle();
								break;
							case KEYS.ARROW_LEFT:
							case KEYS.ARROW_UP:
								this.prev();
								break;
							case KEYS.ARROW_RIGHT:
							case KEYS.ARROW_DOWN:
								this.next();
								break;
							case KEYS.SPACE:
								if (this.actions.playPause) {
									this.actions.playPause();
								}
								break;
							default:
								break;
						}
					}
				}
			}
		};
	},
	langs: {
		PERMALINK: {
			tr: "Kaynak",
			en: "Source"
		},
		PHOTO: {
			tr: "Fotoğraf",
			en: "Photo"
		},
		VIDEO: {
			tr: "Video",
			en: "Video"
		},
		SOUND: {
			tr: "Ses",
			en: "Sound"
		},
		GIF: {
			tr: "GIF",
			en: "GIF"
		}
	},
	created() {
		this.current = this.medialist[0];
	},
	mounted() {
		this.actions = {
			...this.actions,
			sticky: this.$sticky,
			fullscreen: this.$fullscreen
		};
	},
	methods: {
		navigate(direction) {
			if (this.medialist.length === 1) return;
			const _limit = this.medialist.length - 1;
			let _position, _pending;
			if (direction === "PREV") {
				_position = this.current.__state.index - 1;
				_pending = _position < 0 ? _limit : _position;
			} else {
				_position = this.current.__state.index + 1;
				_pending = _position > _limit ? 0 : _position;
			}
			this.current.__state.selected = false;
			this.medialist[_pending].__state.selected = true;
			this.current = this.medialist[_pending];
		},
		prev() {
			this.navigate("PREV");
		},
		next() {
			this.navigate("NEXT");
		},
		toggleFullscreen() {
			this.$fullscreen.toggle();
		}
	}
};
</script>

<style lang="postcss" scoped>
@import url("../../styles/variables.css");

/*
background: linear-gradient(135deg, rgb(216, 210, 202) 0%, rgb(137, 133, 128) 100%);
background: linear-gradient(135deg, rgb(201, 201, 201) 0%, rgb(120, 120, 120) 100%);
 */

.Media {
	--BackgroundColor: var(--DefaultColor);
	--Color: var(--DefaultBackgroundColor);
	--ColorContrast: var(--DefaultColor);
	--Transition: var(--DefaultTransition);
	--InfoOffset_Height: 2.5rem;
	--DotPatternImage: url("../../assets/background_patterndot.svg");

	display: block;
	width: 100%;
	height: 100%;
	margin-top: var(--InfoOffset_Height);
	position: relative;
	font-size: 1rem;
	transition: 0s !important;
	user-select: none;

	& [fullscreen-active] {
		&._FloatingContainer {
			width: 100%;
			height: 100%;
			position: fixed;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 9999;
			background-color: var(--Color);
			color: var(--BackgroundColor);
		}

		& ._Info {
			width: auto;
			padding: 1.5rem;
			position: absolute;
			top: 1rem;
			right: 1rem;
			z-index: 3;
			text-shadow: -1px -1px 15px var(--Color), 1px 1px 15px var(--Color),
				-1px 1px 15px var(--Color), 1px -1px 15px var(--Color);

			& ._Item:not(:first-of-type) {
				margin-left: 0.75rem;
			}
			& ._Item.__navigation {
				margin-left: 2.5rem;
			}
		}

		& ._Content {
			width: 100%;
			height: 100%;
			margin: 0 auto;
		}
	}

	&[sticky-active] {
		& [sticky-element] {
			max-width: 25%;
			position: fixed;
			right: 1rem;
			z-index: 9999;
			background-color: var(--Color);
			color: var(--BackgroundColor);

			& ._Info {
				display: none;
			}
		}
		&[sticky-active="top"] [sticky-element] {
			top: 1rem;
		}
		&[sticky-active="bottom"] [sticky-element] {
			bottom: 1rem;
		}

		&[sticky-active="top"] [sticky-placeholder]:after {
		}
		&[sticky-active="bottom"] [sticky-placeholder]:after {
		}
	}

	& ._FloatingContainer {
		display: block;
		position: relative;
		z-index: 1;
	}

	& ._Info {
		display: flex;
		width: 100%;
		padding-top: 0.75rem; /* --InfoOffset_Height depends this*/
		padding-bottom: 0.75rem; /* --InfoOffset_Height depends this*/
		line-height: 1rem; /* --InfoOffset_Height depends this*/
		position: absolute;
		top: calc(var(--InfoOffset_Height) * -1);
		overflow: hidden;
		font-weight: 900;
		font-size: 0.85rem;

		& > ._Item {
			position: relative;

			&:not(:first-of-type, .__noDot) {
				margin-left: 0.35rem;

				&:before {
					content: "・";
					padding-right: 0.3rem;
				}
			}

			& a {
				color: currentColor;
				text-decoration: none;
				white-space: nowrap;
				&:hover {
					text-decoration: underline;
				}
			}

			&.__type {
				font-family: "Playfair Display";
				font-style: italic;
				font-weight: 600;
			}

			&.__navigation {
				margin-left: auto;
				& ._Icon {
					position: relative;
					width: 1em;
					/* height: 1em; */
					background-size: contain;
				}
				& > * {
					display: inline-block;
					cursor: pointer;

					&:not(:last-of-type) {
						margin-right: 0.75rem;
					}

					&:hover {
						opacity: 0.75;
					}
					&:active {
						transform: scale(0.9);
					}
				}
			}
		}
	}

	& ._Content {
		display: block;
		position: relative;
	}
}
</style>
