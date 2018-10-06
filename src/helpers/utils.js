import Vue from "vue";
import { format, distanceInWordsToNow } from "date-fns";
import en from "date-fns/locale/en";
import tr from "date-fns/locale/tr";
import global from "@/global";
import messages from "@/messages";

const locale = {
  en,
  tr
};

export function error(message) {
  throw new Error(message);
}

export function required(needed) {
  let missing = [];
  for (const field in needed) {
    if (needed.hasOwnProperty(field)) {
      if (typeof needed[field] === "undefined") {
        missing.push(field);
      }
    }
  }
  if (missing.length) {
    error(
      `${missing.length} ${messages.DATA_MISSING}: '${missing.join("', '")}'`
    );
  }
}

export function is(
  type = error("'type' is missing!"),
  value = error("'value' is missing!")
) {
  const rawType = Object.prototype.toString.call(value),
    result = rawType.includes(type);
  if (!result) error(`"${rawType}" is not equal to "${type}"`);
}

export function sort(
  data = error("'data' is missing!"),
  orders = [{ type: "date", ascending: true }]
) {
  is("Array", data);
  return data.sort((a, b) => {
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      if (a[order.type] > b[order.type]) return order.ascending ? 1 : -1;
      if (a[order.type] < b[order.type]) return order.ascending ? -1 : 1;
    }
    return 0;
  });
}

export function modify(data = error("'data' is missing!")) {
  is("Array", data);
  return data.map(item => {
    const date = new Date(item.date);
    const id = generateId();
    const groupName = format(date, "dddd, D MMMM YYYY", {
      locale: locale[Vue.prototype.$locale || global.language]
    });
    const timeAgo = distanceInWordsToNow(date, {
      includeSeconds: true,
      addSuffix: true,
      locale: locale[Vue.prototype.$locale || global.language]
    });
    return { ...item, id, groupName, timeAgo };
  });
  /* return data.map((item, index, list) => {
    const date = new Date(item.date);
    item.id = String(performance.now()).replace(".", "");
    item.groupName = format(date, "dddd, D MMMM YYYY", {
      locale: locale[Vue.prototype.$locale || global.language]
    });
    item.timeAgo = distanceInWordsToNow(date, {
      includeSeconds: true,
      addSuffix: true,
      locale: locale[Vue.prototype.$locale || global.language]
    });
    return item;
  }); */
}

export function filter(
  data = error("'data' is missing!"),
  types = ["twitter"]
) {
  is("Array", data);
  is("Array", types);
  if (!types.length) return data;
  return data.filter(item => types.includes(item.type));
}

export function generateId() {
  if ("performance" in window) {
    return "" + performance.now();
  } else {
    return Date.now().toString();
  }
}
