<template>
	<span class="Action">{{translationKey()}}</span>
</template>

<script>
export default {
	name: "Action",
	props: {
		type: {
			type: String,
			required: true
		},
		name: {
			type: String,
			required: true
		}
	},
	langs: {
		DRIBBBLE_SHOTS: {
			tr: " yayınladı",
			en: "published "
		},
		TWITTER_LIKES: {
			tr: " beğendi",
			en: "liked "
		},
		TWITTER_TIMELINE: {
			tr: " öttürdü",
			en: "tweeted "
		},
		SOUNDCLOUD_FAVORITES: {
			tr: " beğendi",
			en: "liked "
		},
		SOUNDCLOUD_COMMENTS: {
			tr: " yorum yaptı",
			en: "commented "
		},
		GITHUB_EVENTS: {
			tr: " takibe aldı",
			en: "watching "
		},
		GITHUB_WATCHERS: {
			tr: " takibe aldı",
			en: "watching "
		},
		GITHUB_STARS: {
			tr: " yıldız verdi",
			en: "starred "
		},
		GITHUB_GISTS: {
			tr: " kod ekledi",
			en: "coded "
		},
		RAINDROP_BOOKMARKS: {
			tr: " yer imlerine eklendi",
			en: " bookmarked"
		}
	},
	methods: {
		translationKey() {
			return this.$t([this.name, this.type].join("_").toUpperCase());
		}
	}
};
</script>

<style lang="postcss" scoped>
@import url("../../styles/variables.css");

.Action {
}
</style>
