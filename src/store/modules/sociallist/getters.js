import { filter } from "@/helpers/utils";

export default {
  filtered({ list }) {
    return by => filter(list, by);
  },
  filteredLength({}, { filtered }) {
    return by => filtered(by).length;
  }
};
