'use strict';

(() => {
  const {map, form, util} = window;

  const activatePage = () => {
    map.removeOnMainPinMouseDown(onMainPinInactiveMouseDown);
    map.removeOnMainPinKeyDown(onMainPinInactiveKeyDown);

    form.enable();
    map.show();

    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const deactivatePage = () => {
    form.disable();
    map.hide();

    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  // Event handlers

  const onEscKeyDown = (evt) => {
    util.isEscEvent(evt, map.closePopup);
  };

  const onMainPinInactiveMouseDown = (evt) => {
    util.isMainMouseButtonEvent(evt, activatePage);
  };

  const onMainPinInactiveKeyDown = (evt) => {
    util.isEnterEvent(evt, activatePage);
  };

  // Main script
  map.addOnMainPinMouseDown(onMainPinInactiveMouseDown);
  map.addOnMainPinKeyDown(onMainPinInactiveKeyDown);

  deactivatePage();

})();

