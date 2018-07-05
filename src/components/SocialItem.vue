<template>
  <li class="SocialItem" :class="'__'+data.type" :data-type="data.type" :data-date="isgroup ? data.groupName : null">
    <div class="_Meta">
      <template v-if="$locale === 'tr'">
        <a class="_Date" href="">{{data.timeAgo}}</a>
        <span class="_Type">
          <div v-if="selectedListTypes.length <= 1" class="Icon" :class="'__'+data.type"></div>
          <HoverCard v-else :data="data">
            <div class="Icon" :class="'__'+data.type"></div>
          </HoverCard>
        </span>
        <span class="_Delimiter">{{$t("FROM")}}</span>
        <span class="_Action">{{$t(data.action.toUpperCase())}}</span>
      </template>
      <template v-else>
        <span class="_Action">{{$t(data.action.toUpperCase())}}</span>
        <span class="_Delimiter">{{$t("FROM")}}</span>
        <span class="_Type">
          <div v-if="selectedListTypes.length <= 1" class="Icon" :class="'__'+data.type"></div>
          <HoverCard v-else :data="data">
            <div class="Icon" :class="'__'+data.type"></div>
          </HoverCard>
        </span>
        <a class="_Date" href="">{{data.timeAgo}}</a>
      </template>
    </div>
    <div class="_Content">
      <div class="_Title" v-if="data.title">{{data.title}}</div>
      <div class="_Body">{{data.id}} - {{data.groupName}} ### {{data.content}}</div>
    </div>
  </li>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "SocialItem",
  props: {
    data: {
      type: Object,
      required: true
    },
    isgroup: {
      type: Boolean,
      required: true
    }
  },
  langs: {
    FROM: {
      tr: "'dan",
      en: "from"
    },
    RETWEETED: {
      tr: " retweetlendi",
      en: "retweeted "
    },
    UPLOADED: {
      tr: " yüklendi",
      en: "uploaded "
    },
    FORKED: {
      tr: " forklandı",
      en: "forked "
    }
  },
  computed: {
    ...mapGetters("filterlist", ["selectedListTypes"])
  }
};
</script>

<style lang="postcss" scoped>
@import url("../styles/variables.css");
.SocialItem {
  --Size: 2.5em;
  --Padding: var(--DefaultLayoutPadding);
  --BackgroundColor: var(--DefaultColor);
  --Color: var(--DefaultBackgroundColor);
  --FontSize: 0.75em;
  --Transition: var(--DefaultTransition);
  display: block;
  font-size: 1rem;
  width: 100%;
  position: relative;
  color: var(--BackgroundColor);
  font-family: "Barlow", "Karla", "Work Sans";
  user-select: none;

  & ~ .SocialItem {
    margin-top: 1.5rem;
  }
  &[data-date] {
    & ~ [data-date] {
      margin-top: 2.5rem;
    }
    &:before {
      content: attr(data-date);
      display: block;
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
      font-weight: 600;
      font-style: italic;
    }
  }

  & ._Meta {
    display: block;
    position: relative;
    /* padding-bottom: 0.25rem; */
    color: color-mod(var(--BackgroundColor) l(+35%));
    /* font-size: 0.85rem; */
    font-weight: 400;
    /* font-style: italic; */
    /* text-transform: uppercase; */
    &:first-letter {
      text-transform: uppercase;
    }
    /* & ._Action {
      text-transform: capitalize;
    } */
    & ._Delimiter {
      opacity: 0.75;
    }
    & ._Type {
      display: inline;
      position: relative;
      left: -0.075rem;
      padding-right: 1.75rem;
    }
    & ._Date {
      color: inherit;
      text-decoration: none;
      /* &:after {
        content: "ꜛ";
        visibility: hidden;
      } */
      &:hover {
        text-decoration: underline;
        /* &:after {
          visibility: visible;
        } */
      }
    }
  }

  & ._Content {
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
</style>
