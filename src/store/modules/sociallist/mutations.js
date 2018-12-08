import { ADD, MARK_AS_VIEWED } from "./types";
import { INIT } from "@/store/modules/common/types";
import { error, is, sortBy, modify, markAsViewed } from "@/helpers/utils";

export default {
  [INIT](state, { data = error("'data' is missing!"), types }) {
    state.raw = data;
    let statics = {};
    let list = Object.values(data)
      // if successed (means has data)
      .filter(({ success }) => success)
      .reduce((total, { data: { staticitems, listitems }, source }) => {
        // store static items by its source name
        statics = { ...statics, [source.name]: staticitems };
        // store list items all in one
        return [...total, ...listitems];
      }, [])
      // sort by newest to older
      .sort((a, b) => b.__createdAt - a.__createdAt)
      // add some fields
      .map(modify);

    state.statics = statics;
    // mark first items as viewed
    state.viewed = markAsViewed({ list, types, page: state.page });
    state.list = list;
  },
  [ADD](state, { data = error("'data' is missing!"), to = "bottom" }) {
    is("Array", data);
    state.list = sortBy(
      [
        ...(to === "top" ? data.map(modify) : []),
        ...state.list,
        ...(to === "bottom" ? data.map(modify) : [])
      ],
      [{ type: "__createdAt", ascending: false }]
    );
  },
  [MARK_AS_VIEWED](state, { types, amount }) {
    state.viewed = [
      ...state.viewed,
      ...markAsViewed({
        list: state.list,
        types,
        amount,
        page: state.page
      })
    ];
  }
};
