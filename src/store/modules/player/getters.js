export default {
  getMedia({ all }) {
    return _id => all.find(({ id }) => id === _id);
  }
};
