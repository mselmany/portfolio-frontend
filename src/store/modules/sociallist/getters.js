import { filter } from "@/helpers";

export default {
  filtered({ list }) {
    return by => filter(list, by);
  },
  filteredLength({}, { filtered }) {
    return by => filtered(by).length;
  }
};
