<template>
  <span class="HoverCard" :class="'__' + type">
    <div class="Icon" :class="'__'+type"></div>
    <div class="_Wrapper" v-if="selectedListTypes.length > 1">
      <div class="_Content">
        <div class="_Icon">
          <div class="Icon" :class="'__'+type"></div>
        </div>
        <div class="_Meta">
          <div class="_Type" :data-length="filteredLength([type]) || null">{{type}}</div>
          <div class="_Source">
            <router-link
              class="_Link"
              :to="{name: 'social', query: {types: type}}"
              :title="$t('FILTER_DESCRIPTION', [type])"
            >{{$t("FILTER")}}</router-link>
            <em>{{$t("OR")}}</em>
            <a :href="url" target="_blank" rel="noopener noreferrer">{{$t("GO_SOURCE")}}</a>
          </div>
        </div>
      </div>
    </div>
  </span>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "HoverCard",
  props: {
    type: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  langs: {
    FILTER: {
      tr: "Filtrele",
      en: "Filter"
    },
    FILTER_DESCRIPTION: {
      tr: "$0'a göre listele",
      en: "List by $0"
    },
    GO_SOURCE: {
      tr: "kaynağa git",
      en: "go source"
    },
    OR: {
      tr: "ya da",
      en: "or"
    }
  },
  computed: {
    ...mapGetters("sociallist", ["filteredLength"]),
    ...mapGetters("filterlist", ["selectedListTypes"])
  }
};
</script>

<style lang="postcss" scoped>
@import url("../../styles/variables.css");
.HoverCard {
  --BackgroundColor: var(--DefaultColor);
  --Color: var(--DefaultBackgroundColor);
  --ColorContrast: var(--DefaultColor);
  --BorderColor: var(--BackgroundColor);
  --Padding: var(--DefaultLayoutPadding);
  --Transition: var(--DefaultTransition);
  --ArrowSize: 0.75em;
  --ContentHeight: 5em;
  --ContentPadding: 1em;
  display: inline;
  width: 100%;
  height: 100%;
  font-size: 1rem;
  position: relative;
  padding-right: 1.65rem;
  transition: var(--Transition);
  user-select: none;

  &:hover {
    & ._Wrapper {
      transition-delay: calc(var(--Transition) * 4);
      visibility: visible;
      opacity: 1;
      transform: translateY(0);
    }
  }

  & ._Wrapper {
    width: 0;
    height: var(--ArrowSize);
    position: absolute;
    top: 75%;
    left: 50%;
    z-index: 9999;
    transition: var(--Transition);
    visibility: hidden;
    opacity: 0;
    transform: translateY(-50%);
    &::before {
      content: "";
      width: 4em;
      height: 2em;
      position: absolute;
      left: -2em;
      top: 0;
      opacity: 0;
      visibility: visible;
    }
    &::after {
      content: "";
      width: 0;
      height: 0;
      position: absolute;
      left: calc(var(--ArrowSize) * 0.5 * -1);
      bottom: 0;
      border: calc(var(--ArrowSize) * 0.5) solid var(--BorderColor);
      border-top-color: transparent !important;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
    }
  }

  & ._Content {
    padding: var(--ContentPadding);
    padding-right: calc(var(--ContentPadding) * 1.25);
    position: absolute;
    top: var(--ArrowSize);
    left: 0;
    transform: translateX(-50%);
    background: var(--BackgroundColor);
    border-top: calc(var(--ArrowSize) * 0.25) solid var(--BorderColor);
    overflow: hidden;
  }

  & ._Icon {
    width: calc(var(--ContentHeight) / 2);
    height: calc(var(--ContentHeight) / 2);
    position: absolute;
    left: var(--ContentPadding);
    top: 50%;
    transform: translateY(-50%) scale(1.15);
  }
  & ._Meta {
    padding-left: calc(var(--ContentPadding) + var(--ContentHeight) / 2);
    color: var(--Color);

    & ._Source {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    & ._Type {
      text-transform: capitalize;
      font-family: "Playfair Display";
      font-style: italic;
      &[data-length] {
        display: inline-block;
        position: relative;
        &:after {
          content: attr(data-length);
          min-width: 2.25ch;
          padding: 0 0.5ch;
          margin-right: -0.5ch;
          position: absolute;
          top: 0;
          right: 0;
          transform: translateX(100%) scale(0.75);
          border-radius: 2.25ch;
          text-align: center;
          font-style: normal;
          font-family: var(--DefaultFontFamily);
          font-weight: 500;
          background-color: color-mod(var(--Color) a(0.4));
          color: var(--ColorContrast);
          /* opacity: 0.75; */
        }
      }
    }
    & ._Source {
      & > em {
        font-family: "Playfair Display";
        padding: 0 0.2em;
      }
      & > a {
        color: currentColor;
        &:hover {
          text-decoration: none;
        }
      }
    }
  }

  &.__twitter {
    & ._Wrapper::after,
    & ._Content {
      border-color: var(--TwitterColor);
    }
  }
  &.__youtube {
    & ._Wrapper::after,
    & ._Content {
      border-color: var(--YoutubeColor);
    }
  }
  &.__raindrop {
    & ._Wrapper::after,
    & ._Content {
      border-color: var(--RaindropColor);
    }
  }
  &.__instagram {
    & ._Wrapper::after,
    & ._Content {
      border-color: var(--InstagramColor);
    }
  }
  &.__dribbble {
    & ._Wrapper::after,
    & ._Content {
      border-color: var(--DribbbleColor);
    }
  }
  &.__medium {
    & ._Wrapper::after,
    & ._Content {
      border-color: var(--MediumColor);
    }
  }
  &.__soundcloud {
    & ._Wrapper::after,
    & ._Content {
      border-color: var(--SoundcloudColor);
    }
  }
  &.__github {
    & ._Wrapper::after,
    & ._Content {
      border-color: var(--GithubColor);
    }
  }
}
</style>
