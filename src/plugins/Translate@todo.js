export default {
  install(Vue, options) {
    Vue.mixin({
      beforeCreate() {
        console.log(this, " beforeCreate");
      },
      created() {
        console.log(this, " created");
      },
      beforeMount() {
        console.log(this, " beforeMount");
      },
      mounted() {
        console.log(this, " mounted");
        const el = this.$el;
        const langs = this.$options.langs;
        if (!langs || !el) return;
        // console.log("mounted", this);
        // this.$vnode.elm.setAttribute("data-v-translate", "");
        // console.log(langs, el, this);
      },
      beforeUpdate() {
        console.log(this, " beforeUpdate");
      },
      updated() {
        console.log(this, " updated");
      },
      methods: {
        t(field) {
          if (!this.$options.langs.hasOwnProperty(field)) return;
          return this.$options.langs[field][options.locale] || "";
        },
        tWith(field, list) {
          if (!this.$options.langs.hasOwnProperty(field) || !list.length)
            return;
          let string = this.$options.langs[field][options.locale];
          list.forEach((item, index) => {
            if (
              this.$options.langs.hasOwnProperty(item) &&
              item === item.toUpperCase()
            ) {
              item = this.$options.langs[item][options.locale];
            }
            string = string.replace(new RegExp(`@${index}`, "g"), item);
          });
          return string;
        }
      }
    });
    /* Vue.directive("t", {
      bind(el, binding, vnode) {
        // el.textContent = translate.bind(vnode.context)(binding.value);
      }
    }); */
    Vue.prototype.$t = translate;
    Vue.prototype.$locale = "tr";
  }
};

var langs = {
  "@LABEL": {
    tr: "$0 $1 $2",
    // tr: "$2 $1 @FROM @DENEME $0",
    en: "$0 @FROM $1 $2"
  },
  "@DE2": {
    tr: "qq $0 qq",
    en: "qq $0 qq"
  },
  FROM: {
    tr: "'dan",
    en: "from"
  },
  RETWEETED: {
    tr: "retweetlendi",
    en: "retweeted"
  },
  UPLOADED: {
    tr: "yüklendi",
    en: "uploaded"
  },
  FORKED: {
    tr: "forklandı",
    en: "forked"
  },
  DENEME: {
    tr: "deneme",
    en: "denaame"
  }
};

/* 
v-t="'FROM'"
v-t="'@LABEL(bir, 2, üç)'"

{{$t("FROM")}}
{{$t("@LABEL", ["bir", "2", "üç"])}}
*/

// var str = translate("FROM");
// console.log(str);

// var str = translate("@LABEL", ["@FROM", "2", "üç"]);
// console.log(str);

var str = translateAsDirective("@LABEL(@DE2(1), b, @UPLOADED)");

// var str = translateAsDirective("FROM");

console.log(str);

function translateAsDirective(key, parametersMode) {
  parametersMode =
    typeof parametersMode === "undefined" || parametersMode ? true : false;
  let locale = "tr";

  if (!key || typeof key !== "string" || !key.trim().length || !langs)
    return key;

  if (!key.includes("@")) {
    return langs.hasOwnProperty(key) ? langs[key][locale] : key;
  } else {
    return key.replace(/@([A-Z0-9_]+)(?:\((.*?)\))?/g, function(
      match,
      label,
      parameters,
      offset,
      str
    ) {
      label = parameters && parameters.trim().length ? `@${label}` : label;

      let string = langs.hasOwnProperty(label) ? langs[label][locale] : "";

      if (
        parametersMode &&
        string.length &&
        parameters &&
        parameters.trim().length &&
        string.includes("$") &&
        !parameters.includes(`${label}`)
      ) {
        parameters.split(",").map((value, index) => {
          string = string.replace(new RegExp(`\\$${index}`, "g"), value.trim());
        });

        if (string.includes("@")) {
          string = translateAsDirective(string, false);
        }
      }

      return string;
    });
  }
}

function translate(label, parameters) {
  // let langs = this.$options.langs || {};
  // let locale = this.$locale || "en";
  let locale = "tr";
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
      string = string.replace(new RegExp(`\\$${index}`, "g"), value.trim());
    });
    if (string.includes("@")) {
      string = replace(string, {
        langs,
        locale
      });
    }
  }

  return string;
}

function replace(string, { langs, locale }) {
  return string.replace(/@([A-Z0-9_]+)(?:\((.*?)\))?/g, function(
    match,
    label,
    parameters,
    offset,
    str
  ) {
    label = parameters && parameters.trim().length ? `@${label}` : label;
    return langs.hasOwnProperty(label) ? langs[label][locale] : match;
  });
}

/* function translator2(vnode) {
  // langs = this["[[Target]]"].$options.langs || langs || {};
  let langs = vnode.$options.langs || langs || {};
  let locale = vnode.$locale || locale || "en";
  console.log("aaa: ", this);
  // let str = vnode.elm.innerHTML;
  return (vnode.$el.innerHTML = vnode.$el.innerHTML.replace(
    /@([A-Z0-9_]+)(?:\((.*?)\))?/g,
    function(match, label, parameters, offset, str) {
      label = parameters ? `@${label}` : label;
      let translated = langs.hasOwnProperty(label) ? langs[label][locale] : "";

      if (
        translated.length &&
        parameters &&
        translated.includes("$") &&
        parameters.trim().length
      ) {
        translated.includes("@") && (translated = translator(vnode));

        parameters.split(",").map((value, index) => {
          translated = translated.replace(
            new RegExp(`\\$${index}`, "g"),
            () => (value.includes("@") ? (value = translator(vnode)) : value)
          );
        });
      }

      return translated || match;
    }
  ));
} */

/* 
function translator(vnode) {
  // langs = this["[[Target]]"].$options.langs || langs || {};
  let langs = vnode.$options.langs || langs || {};
  let locale = vnode.$locale || locale || "en";
  console.log("aaa: ", this);
  // let str = vnode.elm.innerHTML;
  return (vnode.$el.innerHTML = vnode.$el.innerHTML.replace(
    /@([A-Z0-9_]+)(?:\((.*?)\))?/g,
    function(match, label, parameters, offset, str) {
      label = parameters ? `@${label}` : label;
      let translated = langs.hasOwnProperty(label) ? langs[label][locale] : "";

      if (
        translated.length &&
        parameters &&
        translated.includes("$") &&
        parameters.trim().length
      ) {
        translated.includes("@") && (translated = translator(vnode));

        parameters.split(",").map((value, index) => {
          translated = translated.replace(
            new RegExp(`\\$${index}`, "g"),
            () => (value.includes("@") ? (value = translator(vnode)) : value)
          );
        });
      }

      return translated || match;
    }
  ));
} */
