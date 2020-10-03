'use strict';

(() => {
  const getRandomInRange = (min, max) => Math.floor(Math.random() * Math.floor(max - min)) + min;

  const getRandomItem = (items) => items[getRandomInRange(0, items.length - 1)];

  const getRandomItems = (items) => {
    const randomLength = getRandomInRange(1, items.length);
    const shuffledItems = shuffleItems(items);
    return shuffledItems.slice(0, randomLength);
  };

  const shuffleItems = (items) => {
    const shuffledItems = [...items];
    for (let i = shuffledItems.length - 1; i >= 1; i--) {
      const randomIndex = getRandomInRange(0, i);
      const swap = shuffledItems[i];
      shuffledItems[i] = shuffledItems[randomIndex];
      shuffledItems[randomIndex] = swap;
    }
    return shuffledItems;
  };

  window.util = {
    getRandomInRange,
    getRandomItem,
    getRandomItems
  };

})();
