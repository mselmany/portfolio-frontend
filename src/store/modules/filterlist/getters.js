export default {
  selectedList({ lists }) {
    return lists.filter(s => s.selected === true);
  },
  selectedListTypes({}, { selectedList }) {
    return selectedList.map(item => item.type);
  },
  isSelected({}, { selectedListTypes }) {
    return type => selectedListTypes.includes(type);
  }
};
