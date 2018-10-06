import { ADD } from "./types";
import { INIT } from "@/store/modules/common/types";

import { error, is, sort, modify } from "@/helpers/utils";

export default {
  [INIT](state, { data = error("'data' is missing!") }) {
    state.raw = data;
    let list = Object.values(data).filter(({ success }) => success);
    /* .reduce((arr0, { data }) => {
        const ddd = Object.values(data).reduce((arr, part) => {
          const __class = part.class.split(".")[0];
          const __type = part.class.split(".")[1];
          if (part.data instanceof Array) {
            const data_arr = part.data.map(item => {
              item.__class = __class;
              item.__type = __type;
              return item;
            });
            return arr.concat(data_arr);
          } else {
            return arr;
          }
        }, []);
        return arr0.concat(ddd);
      }, []); */
    console.log(list);
  },
  [ADD](state, { data = error("'data' is missing!"), to = "bottom" }) {
    is("Array", data);
    state.list = sort(
      [
        ...(to === "top" ? modify(data) : []),
        ...state.list,
        ...(to === "bottom" ? modify(data) : [])
      ],
      [
        { type: "date", ascending: false },
        { type: "type", ascending: true },
        { type: "action", ascending: true }
      ]
    );
  }
};
