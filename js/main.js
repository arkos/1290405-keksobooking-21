'use strict';

(() => {
  const {map, form, util} = window;

  const activatePage = () => {
    map.removeOnMainPinMouseDown(onMainPinInactiveMouseDown);
    map.removeOnMainPinKeyDown(onMainPinInactiveKeyDown);

    map.addOnMainPinMouseDown(onMainPinActiveMouseDown);

    map.show();
    form.enable();
  };

  const deactivatePage = () => {
    map.hide();
    form.disable();
  };

  // Event handlers

  const onMainPinInactiveMouseDown = (evt) => {
    util.isMainMouseButtonEvent(evt, activatePage);
  };

  const onMainPinInactiveKeyDown = (evt) => {
    util.isEnterEvent(evt, activatePage);
  };

  const onMainPinActiveMouseDown = () => {
    // Placeholder to support main pin dragging across the map
  };

  // Main script
  map.addOnMainPinMouseDown(onMainPinInactiveMouseDown);
  map.addOnMainPinKeyDown(onMainPinInactiveKeyDown);

  deactivatePage();

})();

