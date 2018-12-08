export function getRandomByTypeAsync(mock, type) {
  const delay = Math.round(Math.random() * 3) * 1000;
  return new Promise(resolve => {
    setTimeout(() => resolve(getRandomByType(mock, type)), delay);
  });
}

export function getRandomByType(mock, type) {
  let filtered;
  if (type) {
    filtered = mock.filter(item => {
      if (item.type === type) return item;
    });
  }
  return randomFrom(filtered || mock);
}

export function randomFrom(list) {
  return list[Math.round(Math.random() * (list.length - 1))];
}
