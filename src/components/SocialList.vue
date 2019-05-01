<template>
	<ul class="SocialList" :class="{'__MenuActive': isMenuActive, '__FilterActive': isFilterActive}">
		<li
			class="_SocialItem"
			v-for="(item, index) in sociallistViewing"
			:key="item.__computed.id"
			:class="'__'+item.__source.name"
			:data-type="item.__source.name"
			:data-date="isGroup(item, index)"
		>
			<component :is="item.__source.name" :data="item"/>
		</li>
	</ul>
</template>

<script>
import { mapGetters } from "vuex";

export default {
	name: "SocialList",
	computed: {
		...mapGetters("toolbox", {
			toolbox_activeButton: "activeButton"
		}),
		...mapGetters("filterlist", {
			filterlist_selectedListTypes: "selectedListTypes"
		}),
		...mapGetters("sociallist", {
			sociallist_filtered: "filtered"
		}),
		isMenuActive() {
			return (
				this.toolbox_activeButton && this.toolbox_activeButton.name === "menu"
			);
		},
		isFilterActive() {
			return (
				this.toolbox_activeButton && this.toolbox_activeButton.name === "filter"
			);
		},
		sociallistViewing() {
			return this.sociallist_filtered(this.filterlist_selectedListTypes);
		}
	},
	methods: {
		isGroup(item, index) {
			return item.__computed.group !==
				(index === 0 ? "" : this.sociallistViewing[index - 1].__computed.group)
				? item.__computed.group
				: null;
		}
	}
};
</script>

<style lang="postcss" scoped>
@import url("../styles/variables.css");
.SocialList {
	--Size: var(--SocialList_Size);
	--Padding: var(--DefaultLayoutPadding);
	--Transition: var(--DefaultTransition);
	--BackgroundColor: var(--DefaultColor);
	--SocialItem_Margin: 2.5rem;
	font-size: 1rem;
	width: 100%;
	max-width: var(--Size);
	position: relative;
	margin: 0 calc(var(--Padding) * 1.5);
	padding: calc(var(--Padding) * 1.5) 1rem var(--Padding) 1rem;
	transition: var(--Transition);
	left: var(--SidebarMenu_Size);

	@media (--DesktopSmall) {
		margin: 0 auto;
		left: 0;
	}

	&.__MenuActive,
	&.__FilterActive {
		/* filter: blur(3rem); */
	}

	& ._SocialItem {
		display: block;
		font-size: 1rem;
		width: 100%;
		position: relative;
		color: var(--BackgroundColor);
		font-family: "Barlow", "Karla", "Work Sans";
		user-select: none;

		& ~ ._SocialItem {
			margin-top: var(--SocialItem_Margin);
		}
		&[data-date] {
			& ~ [data-date] {
				margin-top: calc(var(--SocialItem_Margin) * 1.75);
			}
			&:before {
				content: attr(data-date);
				display: block;
				margin-bottom: var(--SocialItem_Margin);
				font-size: 1.5rem;
				font-weight: 600;
				font-style: italic;
			}
		}

		& ._Content {
			display: block;
			position: relative;
			& ._Title {
			}
			& ._Body {
			}
			& ._Title ~ ._Body {
				margin-top: 0.5rem;
			}
		}
	}
}
</style>
