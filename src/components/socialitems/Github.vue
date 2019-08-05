<template>
	<div class="Github" v-if="loaded">
		<MetaInfo :meta="meta" />
		<div class="_Head">
			<img class="_Avatar" :src="owner.avatar_url" />
			<a class="_Link" :href="meta.url" target="_blank" rel="noopener noreferrer">
				<div class="_TopTitle Utils--textEllipsis">
					<strong>{{owner.name}}</strong>
				</div>
				<div
					class="_Title Utils--textEllipsis"
					:title="content.language"
				>{{content.name || ('gist: ' + content.id)}}</div>
				<div class="_Info">
					<span class="_IconContainer" v-if="status.stars">
						<span class="_Icon">
							<div class="Icon __mode-contain __star"></div>
						</span>
						{{ status.stars }}
					</span>
					<span class="_IconContainer" v-if="status.watchers">
						<span class="_Icon">
							<div class="Icon __mode-contain __eye2"></div>
						</span>
						{{ status.watchers }}
					</span>
					<span class="_IconContainer" v-if="status.forks">
						<span class="_Icon">
							<div class="Icon __mode-contain __fork"></div>
						</span>
						{{ status.forks }}
					</span>
					<span class="_IconContainer" v-if="status.comments >= 0">
						<span class="_Icon">
							<div class="Icon __mode-contain __comment"></div>
						</span>
						{{ status.comments }}
					</span>
					<span class="_IconContainer" v-if="status.files">
						<span class="_Icon">
							<div class="Icon __mode-contain __folder"></div>
						</span>
						{{ status.files }}
					</span>
				</div>
			</a>
		</div>
		<div class="_Description" v-if="content.description">{{ content.description }}</div>
	</div>
</template>

<script>
import axios from "axios";
import { mapMutations } from "vuex";
import { formatNumber } from "@/helpers/utils";
import { INJECT_DATA } from "@/store/modules/sociallist/types";

export default {
	name: "Github",
	props: {
		data: {
			type: Object,
			required: true
		}
	},
	data() {
		let meta = {
			url: this.data.html_url,
			date: this.data.__createdAt,
			type: this.data.__source.type,
			name: this.data.__source.name
		};
		let owner = {
			id: this.data.owner && this.data.owner.id,
			name: this.data.owner && this.data.owner.login,
			avatar_url: this.data.owner && this.data.owner.avatar_url
		};
		switch (this.data.__source.type) {
			case "gists":
				return {
					loaded: false,
					meta,
					owner,
					content: {
						id: this.data.id,
						description: this.data.description
					},
					status: {
						files: this.data.files.length,
						comments: formatNumber(this.data.comments)
					}
				};

			default:
				return {
					loaded: false,
					meta,
					owner,
					content: {
						id: this.data.id,
						name: this.data.name,
						full_name: this.data.full_name,
						description: this.data.description,
						language: this.data.language
					},
					status: {
						stars: formatNumber(this.data.stargazers_count),
						watchers: formatNumber(this.data.subscribers_count),
						forks: formatNumber(this.data.forks_count)
					}
				};
		}
	},
	async created() {
		const isEvent = this.data.__source.type === "events";

		if (isEvent) {
			try {
				let r = null;
				if (!this.data.hasOwnProperty("__injected")) {
					r = await axios.get(this.data.repo.url);
					r = r.data;
					this[INJECT_DATA]({ id: this.data.__computed.id, data: r });
				} else {
					r = this.data.__injected;
				}
				{
					const { html_url } = r;
					this.meta.url = html_url;
				}
				{
					const { id, name, full_name, description, language } = r;
					this.content = { id, name, full_name, description, language };
				}
				{
					const { id, login: name, avatar_url } = r.owner;
					this.owner = { id, name, avatar_url };
				}
				{
					const { stargazers_count, subscribers_count, forks_count } = r;
					this.status = {
						stars: formatNumber(stargazers_count),
						watchers: formatNumber(subscribers_count),
						forks: formatNumber(forks_count)
					};
				}
			} catch (error) {
				console.log(error);
			}
		}
		this.loaded = true;
	},
	methods: {
		...mapMutations("sociallist", [INJECT_DATA])
	}
};
</script>

<style lang="postcss" scoped>
@import url("../../styles/variables.css");
.Github {
	--Color: var(--DefaultColor);
	& ._Head {
		min-height: 3.75rem;
		position: relative;
		margin: 1rem 0;
	}
	& ._Link {
		max-width: 100%;
		display: inline-block;
		position: relative;
		padding-left: 4.5rem;
		color: var(--Color);
		text-decoration: none;

		&:hover {
			/* background: #eee;
			box-shadow: 0 0 0 0.75rem #eee;
			border-radius: 1px; */
			& ._Title {
				text-decoration: underline;
			}
		}
	}
	& ._Avatar {
		width: 3.75rem;
		height: 3.75rem;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
		border-radius: 5px;
	}
	& ._TopTitle {
		opacity: 0.75;
		font-size: 0.8em;
		& > em {
			text-transform: lowercase;
		}
	}
	& ._Title {
		margin: 0.05rem 0 0.2rem 0;
		font-weight: 900;
	}
	& ._Info {
		opacity: 0.75;
		font-size: 0.8em;
		font-weight: 900;
	}

	& ._IconContainer {
		display: inline-block;
		position: relative;
		&:not(:last-child) {
			padding-right: 0.5rem;
		}
	}
	& ._Icon {
		display: inline-block;
		position: relative;
		width: 0.8rem;
		height: 0.8rem;
		border-top: 0.2rem solid transparent;
	}
	& ._Description {
	}
}
</style>
