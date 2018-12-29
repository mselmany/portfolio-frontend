import Vue from "vue";
import { format, distanceInWordsToNow } from "date-fns";
import en from "date-fns/locale/en";
import tr from "date-fns/locale/tr";
import global from "@/global";
import messages from "@/messages";
import router from "@/router";

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
  else return true;
}

export function generateId() {
  return Math.random()
    .toString(36)
    .substr(2, 9);
}
export function timeAgo(date = error("'date' is missing!")) {
  const _locale = locale[Vue.prototype.$locale || global.language];
  return distanceInWordsToNow(new Date(date), {
    includeSeconds: true,
    addSuffix: true,
    locale: _locale
  });
}
export function formatDate(
  date = error("'date' is missing!"),
  pattern = "dddd, D MMMM YYYY"
) {
  const _locale = locale[Vue.prototype.$locale || global.language];
  return format(new Date(date), pattern, { locale: _locale });
}

export function sortBy(
  data = error("'data' is missing!"),
  orders = [{ type: "__createdAt", ascending: true }]
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

export function modify(item, index) {
  return {
    ...item,
    __computed: {
      id: generateId(),
      order: index,
      group: formatDate(item.__createdAt),
      timeAgo: timeAgo(item.__createdAt)
    }
  };
}

export function filter(data = error("'data' is missing!"), types) {
  is("Array", data);
  is("Array", types);
  if (!types.length) return data;
  return data.filter(({ __source }) => types.includes(__source.name));
}

export async function delay({ min = 250, max = 1000 } = {}) {
  const delay = Math.floor(Math.random() * (max - min)) + min;
  console.log(delay);
  return new Promise(resolve => {
    setTimeout(() => resolve(delay), delay);
  });
}

export function updateQuery(queries, replace = false) {
  router[replace ? "replace" : "push"]({
    query: { ...router.currentRoute.query, ...queries }
  });
}

export function fetchQuery(name) {
  const { query } = router.history.pending;
  return name ? query[name] : query;
}

export function markAsViewed({
  list = error("'list' is missing!"),
  types = null,
  amount = global.perpage,
  page = error("'page' is missing!")
}) {
  if (!list.length) return [];
  let markedItems = [];
  for (const item of list) {
    let { __computed, __source } = item;
    if (!amount) break;
    // if item is not viewed
    if (!__computed.viewed) {
      // if type filter exist and item is not filtered type
      if (types && !types.includes(__source.name)) {
        // then skip to next item
        continue;
      }
      // else store for viewed
      markedItems.push(item);
      --amount;
    }
  }
  if (markedItems.length) {
    ++page.count;
  }
  return markedItems.map(item => {
    // add needed fields/flags
    item.__computed.page = page.count;
    item.__computed.viewed = true;
    return item;
  });
}
