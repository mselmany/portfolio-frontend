<template>
	<div class="Notification">
		<div
			class="_Toolbar __container"
			:class="{'__Active': !loading.pending && !notifications.list.length}"
		>
			<div class="_Item">
				<div
					class="_Icon __toggle Icon __actions"
					:class="{'__show': !notifications.enabled}"
					@click="toggle($event)"
				></div>
				<span class="_Message">
					<!-- {{$t(notifications.enabled ? "HIDE_NOTIFICATION" : "SHOW_NOTIFICATION")}} -->
				</span>
			</div>
		</div>
		<ul class="_List" :class="{'__container __Active': notifications.list.length || loading.pending}">
			<li class="_Item __notification" v-for="(item, index) in notifications.list" :key="index">
				<div class="_Icon Icon" :class="[item.icon]"></div>
				<span class="_Title" v-if="item.title.length">{{$t(item.title)}}</span>
				<span class="_Message" v-if="item.title.length">{{$t(item.message)}}</span>
			</li>
			<li class="_Item __loading" v-if="loading.pending">
				<div class="_Icon Icon" :class="[loading.icon]"></div>
				<span class="_Title" v-if="loading.title.length">{{loading.queue.length}} {{$t(loading.title)}}</span>
				<span class="_Message" v-if="loading.message.length">{{$t(loading.message)}}</span>
			</li>
		</ul>
	</div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { TOGGLE_NOTIFICATION } from "@/store/modules/common/types";

export default {
	name: "Notification",
	langs: {
		PROCESS: {
			tr: "İşlem",
			en: "Process"
		},
		ERROR: {
			tr: "Hata!",
			en: "Error!"
		},
		WARN: {
			tr: "Uyarı",
			en: "Warning"
		},
		UNKNOWN: {
			tr: "Bilinmeyen",
			en: "Unknown"
		},
		SUCCESS: {
			tr: "Başarılı",
			en: "Success"
		},
		TWITTER: {
			tr: "Twitter",
			en: "Twitter"
		},
		DRIBBBLE: {
			tr: "Dribbble",
			en: "Dribbble"
		},
		GITHUB: {
			tr: "Github",
			en: "Github"
		},
		RAINDROP: {
			tr: "Raindrop",
			en: "Raindrop"
		},
		SOUNDCLOUD: {
			tr: "Soundcloud",
			en: "Soundcloud"
		},
		YOUTUBE: {
			tr: "Youtube",
			en: "Youtube"
		},
		MEDIUM: {
			tr: "Medium",
			en: "Medium"
		},
		INSTAGRAM: {
			tr: "İnstagram",
			en: "Instagram"
		},
		LOADING_MESSAGE: {
			tr: "Veri yükleniyor...",
			en: "Data loading..."
		},
		ERROR_MESSAGE: {
			tr: "İstenmeyen bir durum meydana geldi.",
			en: "An unexpected situation occurred."
		},
		WARN_MESSAGE: {
			tr: "Bu işlem yapılamaz.",
			en: "This process can not be done."
		},
		UNKNOWN_MESSAGE: {
			tr: "Bilinmeyen işlem tipi.",
			en: "Unknown process type."
		},
		SUCCESS_MESSAGE: {
			tr: "İşlem tamamlandı.",
			en: "Process completed."
		},
		TWITTER_MESSAGE: {
			tr: "Twitler çekildi.",
			en: "Tweets fetched."
		},
		DRIBBBLE_MESSAGE: {
			tr: "Tasarımlar alındı.",
			en: "Designs fetched."
		},
		GITHUB_MESSAGE: {
			tr: "Kodlar alındı.",
			en: "Codes fetched."
		},
		RAINDROP_MESSAGE: {
			tr: "Öğeler alındı.",
			en: "Items fetched."
		},
		SOUNDCLOUD_MESSAGE: {
			tr: "Sesler alındı.",
			en: "Sounds fetched."
		},
		YOUTUBE_MESSAGE: {
			tr: "Videolar alındı.",
			en: "Videos fetched."
		},
		MEDIUM_MESSAGE: {
			tr: "Makaleler alındı.",
			en: "Articles fetched."
		},
		INSTAGRAM_MESSAGE: {
			tr: "Fotoğraflar alındı.",
			en: "Photographs fetched."
		},
		NOTIFICATION_ENABLED: {
			tr: "Bildirimler aktif hale getirildi.",
			en: "Notifications enabled."
		},
		NOTIFICATION_DISABLED: {
			tr: "Bildirimler devre dışı bırakıldı.",
			en: "Notifications disabled."
		},
		SHOW_NOTIFICATION: {
			tr: "Bildirimleri göster",
			en: "Show notifications"
		},
		HIDE_NOTIFICATION: {
			tr: "Bildirimleri gizle",
			en: "Hide notifications"
		},
		ADDED_TO_PLAYLIST: {
			tr: "Oynatma listesine eklendi.",
			en: "Added to playlist."
		},
		REMOVED_FROM_PLAYLIST: {
			tr: "Oynatma listesinden kaldırıldı.",
			en: "Removed from playlist."
		}
	},
	computed: {
		...mapState("common", ["notifications", "loading"])
	},
	methods: {
		...mapActions("common", [TOGGLE_NOTIFICATION]),
		toggle(e) {
			e.preventDefault();
			this[TOGGLE_NOTIFICATION]();
		}
	}
};
</script>

<style lang="postcss" scoped>
@import url("../styles/variables.css");
.Notification {
	--BackgroundColor: var(--DefaultColor);
	--Color: var(--DefaultBackgroundColor);
	font-size: 1rem;
	text-align: left;
	min-width: 8em;
	max-width: 20em;
	position: fixed;
	bottom: 0;
	left: 0;
	z-index: 9000;
	user-select: none;

	& ._Toolbar {
		& ._Message {
			visibility: hidden;
		}
		& ._Icon:hover + ._Message {
			visibility: visible;
		}
	}

	& ._List {
		list-style: none;
		margin: 0;
		background-color: var(--BackgroundColor);
		color: var(--Color);
	}

	& .__container {
		font-size: 1rem;
		padding: 0.75em;
		padding-right: 1.25em;
		display: none;
		/* transform-origin: 0 0;
    transform: translateY(100%) translateY(1.5em);
    opacity: 0;
    visibility: hidden; */
		&.__Active {
			display: block;
			/* transform: translateY(0);
      opacity: 1;
      visibility: visible; */
		}
	}

	& ._Item {
		position: relative;
		&:not(:last-child) {
			margin-bottom: 0.5em;
		}
		&.__notification {
		}
		&.__loading {
		}
	}

	& ._Icon {
		width: 2rem;
		height: 2rem;
		position: absolute;
		top: 50%;
		left: 0;
		z-index: 2;
		transform: translateY(-50%);

		&.__toggle {
			background-image: url("../assets/icon_eyeclose.svg");
			cursor: pointer;
			&.__show {
				background-image: url("../assets/icon_eye.svg");
			}
		}
	}

	& ._Title {
		display: block;
		padding-left: 2.5rem;
		text-transform: uppercase;
		font-size: 0.75em;
		opacity: 0.75;
	}
	& ._Message {
		padding-left: 2.5rem;
	}
}
</style>
