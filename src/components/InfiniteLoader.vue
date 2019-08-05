<template>
	<ul class="InfiniteLoader">
		<slot/>
		<li class="_Indicator" v-if="loading.pending">{{$t("LOADING")}}</li>
	</ul>
</template>

<script>
import { mapState } from "vuex";

export default {
	name: "InfiniteLoader",
	props: {
		handler: {
			type: Function,
			required: true
		},
		limit: {
			type: Number,
			default: 1
		},
		indicator: {
			type: Boolean,
			default: true
		},
		locked: {
			type: Boolean,
			default: false
		}
	},
	langs: {
		LOADING: {
			tr: "Yükleniyor",
			en: "Loading"
		}
	},
	computed: {
		...mapState("common", ["loading"]),
		inprogress() {
			return this.loading.pending && this.loading.queue.length >= this.limit;
		}
	},
	mounted() {
		this.loader();
		window.addEventListener("scroll", this.loader, false);
		window.addEventListener("resize", this.loader, false);
	},
	destroyed() {
		window.removeEventListener("scroll", this.loader, false);
		window.removeEventListener("resize", this.loader, false);
	},
	methods: {
		atBottom() {
			return (
				document.documentElement.clientHeight >=
				Math.round(this.$el.getBoundingClientRect().bottom)
			);
		},
		async loader() {
			if (this.inprogress || !this.atBottom() || this.locked) return;
			await this.handler();
			await this.loader();
		}
	}
};
</script>

<style lang="postcss" scoped>
@import url("../styles/variables.css");
.InfiniteLoader {
	--Padding: var(--DefaultLayoutPadding);
	--Transition: var(--DefaultTransition);
	font-size: 1rem;
	position: relative;
	transition: var(--Transition);
	user-select: none;

	&,
	& > li {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	& > ._Indicator {
		padding-top: var(--Padding);
		font-style: italic;
		text-align: center;
		letter-spacing: 0.05em;
		/* animation: _Indicator-FADE 0.5s infinite alternate; */
		&::after {
			content: "";
			position: absolute;
			animation: _Indicator-DOT 0.5s infinite alternate;
		}
	}
}

@keyframes _Indicator-FADE {
	from {
		opacity: 0.25;
		transform: translateY(0.25rem);
	}
	to {
		opacity: 1;
		transform: translateY(-0.25rem);
	}
}
@keyframes _Indicator-DOT {
	33% {
		content: ".";
	}
	66% {
		content: "..";
	}
	100% {
		content: "...";
	}
}
</style>
