<template>
  <section
    class="SidebarMenu"
    :class="{'__Active': isMenuActive, '__FilterActive': isFilterActive}"
  >
    <slot name="toolbox"/>
    <div class="_Cirles">
      <div class="_Circle" v-for="i of 6" :key="i" :class="['__'+i]"></div>
    </div>
    <ol class="_Menu">
      <li class="_Item" v-for="(item, index) in sidebarmenu.routes" :key="index">
        <router-link :to="{name: item.name}" active-class="__Active" class="_Link">
          <div class="_Name" :data-currentpage="$t('CURRENT_PAGE')">{{$t(item.title)}}</div>
          <div class="_Description">{{$t(item.description)}}</div>
        </router-link>
      </li>
    </ol>
    <header class="_Header">
      <div class="_JobTitle">{{sidebarmenu.header.jobTitle}}</div>
      <div class="_SiteName">{{sidebarmenu.header.siteName}}</div>
      <div class="_WorkingAt">
        <template v-if="$locale === 'tr'">
          <span v-html="sidebarmenu.header.workingAt"></span>
          {{$t("WORKING_AT")}}
        </template>
        <template v-else>
          {{$t("WORKING_AT")}}
          <span v-html="sidebarmenu.header.workingAt"></span>
        </template>
      </div>
    </header>
  </section>
</template>

<script>
// TODO@4:  ALL_IN_ONE sayfası altında her social media ile ilgili alt sayfa oluştur.

import { mapState, mapGetters } from "vuex";

export default {
  name: "SidebarMenu",
  langs: {
    ALL: {
      tr: "Tümü",
      en: "All"
    },
    ALL_IN_ONE: {
      tr: "Hepsi bir arada",
      en: "All in one"
    },
    SOCIAL_MEDIA: {
      tr: "Sosyal medya",
      en: "Social media"
    },
    TIMELINE: {
      tr: "Zaman çizelgesi",
      en: "Timeline"
    },
    RESUME: {
      tr: "Öz geçmiş",
      en: "Resume"
    },
    SEE_MY_EXPERIENCE: {
      tr: "Gözat",
      en: "See my experience"
    },
    PROJECTS: {
      tr: "Projeler",
      en: "Projects"
    },
    LOOK_MY_PROJECTS: {
      tr: "Fikirler",
      en: "Look my projects"
    },
    ARTICLES: {
      tr: "Makaleler",
      en: "Articles"
    },
    READ_MY_POSTS: {
      tr: "Oku",
      en: "Read my posts"
    },
    WORKING_AT: {
      tr: " için çalışıyor...",
      en: "working at"
    },
    CURRENT_PAGE: {
      tr: "Mevcut sayfa",
      en: "Current page"
    }
  },
  computed: {
    ...mapState("common", ["sidebarmenu"]),
    ...mapGetters("toolbox", ["activeButton"]),
    isMenuActive() {
      return this.activeButton && this.activeButton.name === "menu";
    },
    isFilterActive() {
      return this.activeButton && this.activeButton.name === "filter";
    }
  }
};
</script>

<style lang="postcss" scoped>
@import url("../styles/variables.css");
.SidebarMenu {
  --Size: var(--SidebarMenu_Size);
  --Color: var(--DefaultColor);
  --ColorContrast: var(--DefaultBackgroundColor);
  --BorderColor: var(--DefaultBorderColor);
  --Padding: var(--DefaultLayoutPadding);
  --FontSize: var(--SidebarMenu_FontSize);
  --DotSize: var(--SidebarMenu_DotSize);
  --_Menu-PaddingLeft: calc((var(--Padding) / 2) - var(--DotSize));
  --Transition: var(--DefaultTransition);
  font-size: 1rem;
  width: var(--Size);
  height: 100%;
  padding: var(--Padding);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  background-color: var(--ColorContrast);
  color: var(--Color);
  /* border-right: 1px solid var(--BorderColor); */
  user-select: none;
  transform: translateZ(0.1px);
  transition: var(--Transition);

  @media (--DesktopSmall) {
    & {
      transform: translateZ(0.1px) translateX(-100%);
      &.__Active.__Active {
        transform: translateZ(0.1px) translateX(0);
      }
      &.__FilterActive.__FilterActive {
        transform: translateZ(0.1px) translateX(-100%);
      }
    }
  }

  & ._Cirles {
    width: 100%;
    height: 100%;
    position: absolute;
    top: -6em;
    left: 0;
    z-index: 0;
    transition: var(--Transition);
    will-change: filter;
    & ._Circle {
      position: relative;
      border-radius: 50%;
      transition: var(--Transition);
      &:before {
        content: "";
        display: block;
        width: 100%;
        padding-top: 100%;
      }
      &.__1 {
        width: 22em;
        margin-left: -3.5em;
        border-top-left-radius: 0;
        background: linear-gradient(180deg, #ff8450 0%, #fb3538 100%);
      }
      &.__2 {
        width: 2em;
        margin-top: -6em;
        margin-left: 23em;
        background: linear-gradient(180deg, #888 0%, #bbb 98.9%);
      }
      &.__3 {
        width: 13em;
        margin-top: 2em;
        margin-left: 13em;
        background: linear-gradient(180deg, #ffb300 3.87%, #ffe900 99.45%);
      }
      &.__4 {
        width: 3em;
        margin-top: -8em;
        margin-left: 6em;
        background: linear-gradient(180deg, #56ccf2 3.87%, #009bd5 95.03%);
      }
      &.__5 {
        width: 8em;
        margin-top: 4em;
        margin-left: 6em;
        background: linear-gradient(180deg, #00ffb5 0%, #00c252 100%);
      }
      &.__6 {
        width: 5em;
        margin-top: -3em;
        margin-left: 18em;
        background: linear-gradient(180deg, #c051e0 1.1%, #6c00ff 98.34%);
      }
    }
  }
  & ._Menu {
    counter-reset: _Menu;
    margin: 0;
    padding: 0;
    padding-left: var(--_Menu-PaddingLeft);
    position: relative;
    z-index: 2;
    font-size: var(--FontSize);
    line-height: var(--FontSize);
    transition: var(--Transition);
    transform: translateX(-0.75em);
    will-change: transform, visibility, opacity;
    visibility: hidden;
    opacity: 0;
    & ._Item {
      counter-increment: _Menu;
      display: block;
      position: relative;
      &:not(:last-child) {
        margin-bottom: 1em;
      }
    }
    & ._Link {
      display: block;
      text-decoration: none;
      color: inherit;
      &::before {
        content: counter(_Menu, upper-latin);
        display: block;
        width: 100%;
        padding: 0.2em 0.4em;
        position: absolute;
        top: -0.2em;
        left: calc(var(--_Menu-PaddingLeft) / -1.75);
        transform: translateX(-100%) translateZ(0.1px);
        transition: var(--Transition);
        text-align: right;
        font-weight: 500;
        pointer-events: none;
      }
      &::after {
        content: "";
        display: block;
        width: var(--DotSize);
        height: var(--DotSize);
        border-radius: calc(var(--DotSize) / 2);
        position: absolute;
        top: calc(var(--FontSize) / 2);
        left: calc(
          (var(--_Menu-PaddingLeft) / (-1.75 * 2)) -
            (0.4em - (var(--DotSize) / 2))
        );
        transform: translateY(-50%) translateZ(0.1px);
        transition: var(--Transition);
        pointer-events: none;
        background-color: currentColor;
        will-change: width;
      }
      &:not(.__Active):hover {
        &::after {
          width: calc(var(--DotSize) * 5);
        }
        & * {
          transform: translateX(calc(var(--DotSize) * 4));
        }
      }
      &.__Active {
        pointer-events: none;
        &::before {
          content: counter(_Menu, decimal-leading-zero);
          background-color: var(--Color);
          color: var(--ColorContrast);
        }
        &::after {
          display: none;
        }
        & ._Name[data-currentpage]:after {
          content: attr(data-currentpage);
          display: inline-block;
          position: relative;
          top: calc(var(--FontSize) / 2.75 * -0.6);
          margin-left: var(--FontSize);
          font-size: calc(var(--FontSize) / 2.75);
          font-weight: 600;
          line-height: var(--FontSize);
          text-transform: uppercase;
          opacity: 0.5;
        }
      }
    }
    & ._Name {
      display: inline-block;
      position: relative;
      font-weight: 500;
      transition: var(--Transition);
      will-change: transform;
    }
    & ._Description {
      display: block;
      position: relative;
      font-family: "Playfair Display";
      font-style: italic;
      transition: var(--Transition);
      will-change: transform;
    }
  }
  & ._Header {
    width: 100%;
    padding: var(--Padding);
    padding-top: 0;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 1;
    transition: var(--Transition);
    transform: translateX(-0.75em);
    will-change: transform, visibility, opacity;
    transform: translateX(0);
    visibility: visible;
    opacity: 1;
    & ._JobTitle {
    }
    & ._SiteName {
      font-family: "Playfair Display";
      font-size: 3em;
      font-style: italic;
      line-height: 1.75em;
      padding-bottom: 0.25em;
    }
    & ._WorkingAt {
      & * {
        opacity: 0.5;
      }
    }
    & >>> a[href] {
      color: currentColor;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  /* @nest .__Active &, */
  &.__Active {
    box-shadow: calc(var(--DotSize) * -1) 0 calc(var(--Size) * 0.5)
      calc(var(--Size) * 0.25) var(--ColorContrast);
    & ._Cirles {
      filter: blur(4em);
    }
    & ._Menu {
      transform: translateX(0);
      visibility: visible;
      opacity: 1;
    }
    & ._Header {
      transform: translateX(0.75em);
      visibility: hidden;
      opacity: 0;
    }
  }
  &.__FilterActive {
    /* transform: translateZ(0.1px)
       translateX(calc((var(--Size) - (var(--Toolbox_Size) * 2)) * -1)); */
  }
}
</style>
