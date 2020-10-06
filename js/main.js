'use strict';

(() => {
  const {map, form, util} = window;

  const activatePage = () => {
    map.removeOnMainPinMouseDown(onMainPinInactiveMouseDown);
    map.removeOnMainPinKeyDown(onMainPinInactiveKeyDown);

    map.show();
    form.enable();

    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const deactivatePage = () => {
    map.hide();
    form.disable();

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

