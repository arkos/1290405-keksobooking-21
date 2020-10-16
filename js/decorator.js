'use strict';

(() => {

  const DEBOUNCE_INTERVAL = 500; // ms

  const debounce = (cb) => {
    let lastTimeout = null;

    return () => {
      if (lastTimeout) {
        clearTimeout(lastTimeout);
      }

      lastTimeout = setTimeout(() => {
        cb();
      }, DEBOUNCE_INTERVAL);
    };
  };

  window.decorator = {
    debounce
  };

})();