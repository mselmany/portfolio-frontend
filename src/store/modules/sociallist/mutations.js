import { ADD } from "./types";
import { error, is, sort, modify } from "@/helpers";

export default {
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
