<template>
	<div class="Raindrop" :class="{'__withMedia': media}">
		<MetaInfo :meta="meta" />
		<div class="_Title">
			<div class="_Icon">
				<div class="Icon __link __black"></div>
			</div>
			<a :href="meta.url" target="_blank" rel="noopener noreferrer" v-html="data.title"></a>
		</div>
		<div class="_Description" v-html="data.excerpt"></div>
		<Media v-if="media.length" :list="media" />
	</div>
</template>

<script>
export default {
	name: "Raindrop",
	props: {
		data: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			meta: {
				url: this.data.link,
				date: this.data.__createdAt,
				type: this.data.__source.type,
				name: this.data.__source.name
			},
			media:
				this.data.media &&
				this.data.media.map(item => {
					const type = item.type;
					switch (type) {
						case "image":
							return {
								type: "photo",
								alt: this.data.title,
								src: item.link,
								permalink: this.data.link
							};
						default:
							break;
					}
				})
		};
	}
};
</script>

<style lang="postcss" scoped>
@import url("../../styles/variables.css");
.Raindrop {
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
		/* & .MetaInfo, */
		& ._Title {
			/* padding: 0 1rem;
      color: var(--Color); */
			margin: 0.5rem 0;
			position: relative;
			/* font-family: "Playfair Display"; */
			/* font-weight: 500; */
		}
		& ._Icon {
			position: relative;
			width: 1em;
			/* height: 1em; */
			background-size: contain;
		}
	}
}
</style>
