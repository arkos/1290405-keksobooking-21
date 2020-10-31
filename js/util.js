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

window.util = {
  isEnterEvent,
  isMainMouseButtonEvent,
  isEscEvent
};
