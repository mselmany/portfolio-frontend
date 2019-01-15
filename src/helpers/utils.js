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

export const raf =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };

export function inViewport(el) {
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  // if element is not smaller than window size
  if (el.clientWidth >= windowWidth || el.clientHeight >= windowHeight) {
    return false;
  }

  const rect = el.getBoundingClientRect();
  // const p = v => (v * 33) / 100;

  // is element in vertical view
  const vertInView =
    rect.top /* + p(rect.height) */ >= 0 &&
    rect.bottom /* - p(rect.height) */ <= windowHeight;

  // is element in horizontal view
  const horInView =
    rect.left /* + p(rect.width) */ >= 0 &&
    rect.right /* - p(rect.width) */ <= windowWidth;

  // detect offset direction (for placing floated element)
  let direction = "";

  if (rect.top <= 0) {
    direction += "top";
  } else if (rect.bottom >= windowHeight) {
    direction += "bottom";
  }

  if (rect.left <= 0) {
    direction += "left";
  } else if (rect.right >= windowWidth) {
    direction += "right";
  }

  return { inview: vertInView && horInView, direction };
}

export function formatTime(time) {
  if (!parseInt(time)) return "00:00";

  let hours = parseInt(time / 3600, 10);
  let minutes = parseInt((time / 60) % 60, 10);
  let seconds = parseInt(time % 60, 10);

  if (!hours) {
    hours = "";
  } else if (hours < 10) {
    hours = "0" + hours + ":";
  } else {
    hours = hours + ":";
  }

  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  return `${hours}${minutes}:${seconds}`;
}
