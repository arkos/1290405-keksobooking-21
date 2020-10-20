'use strict';

const ESC_KEY_CODE = 27;
const ENTER_KEY_CODE = 13;
const MAIN_MOUSE_BUTTON_DOWN_CODE = 0;

const isEnterEvent = (evt, action) => {
  if (evt.keyCode === ENTER_KEY_CODE) {
    action();
  }
};

const isMainMouseButtonEvent = (evt, action) => {
  if (evt.button === MAIN_MOUSE_BUTTON_DOWN_CODE) {
    action();
  }
};

const isEscEvent = (evt, action) => {
  if (evt.keyCode === ESC_KEY_CODE) {
    action();
  }
};

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
  getRandomItems,
  isEnterEvent,
  isMainMouseButtonEvent,
  isEscEvent
};
