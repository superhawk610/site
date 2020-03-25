export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const atRandom = <T>(items: T[]) => {
  if (items.length === 0) return null;

  return items[getRandomInt(0, items.length - 1)];
};
