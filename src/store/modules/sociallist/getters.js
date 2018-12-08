import { filter } from "@/helpers/utils";

export default {
  filtered({ viewed }) {
    return by => filter(viewed, by);
  },
  filteredLength(_, { filtered }) {
    return by => filtered(by).length;
  }
};
