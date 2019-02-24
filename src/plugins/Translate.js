/*
const langs = {
    LABEL: {
      tr: "'$2 $1 @FROM $0' cümlesi.",
      en: "A sentence about '$0 @FROM $1 $2'."
    },
    FROM: {
      tr: "'dan",
      en: "from"
    },
    RETWEETED: {
      tr: "retweetlendi",
      en: "retweeted"
    }
  };

{{$t("RETWEETED")}}
{{$t("LABEL", ["@RETWEETED", "Twitter", "3 ay önce"])}}
*/

import languages from "@/languages";
import global from "@/global";

export default {
  install(Vue, options) {
    Vue.prototype.$t = translate;
    Vue.prototype.$locale = options.locale;
  }
};

export function translate(label, parameters) {
  let langs = (this && this.$options && this.$options.langs) || languages;
  let locale = (this && this.$locale) || global.language;
  if (
    !label ||
    typeof label !== "string" ||
    !label.trim().length ||
    !langs ||
    !langs.hasOwnProperty(label)
  )
    return label;

  let string = langs[label][locale];

  if (
    string.length &&
    parameters &&
    parameters.length &&
    string.includes("$") &&
    !parameters.includes(`${label}`)
  ) {
    parameters.forEach((value, index) => {
      string = string.replace(new RegExp(`\\$${index}`, "g"), value);
    });
    if (string.includes("@")) {
      string = string.replace(/@([A-Z0-9_]+)/g, function(match, label) {
        return langs.hasOwnProperty(label) ? langs[label][locale] : match;
      });
    }
  }

  return string;
}
