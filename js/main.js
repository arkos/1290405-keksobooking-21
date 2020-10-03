'use strict';

const activatePage = () => {
  const {map, form} = window;

  map.removeOnMainPinMouseDown(onMainPinInactiveMouseDown);
  map.removeOnMainPinKeyDown(onMainPinInactiveKeyDown);

  map.addOnMainPinMouseDown(onMainPinActiveMouseDown);

  map.showMap();
  form.enableAdForm();
};

const deactivatePage = () => {
  const {map, form} = window;

  map.hideMap();
  form.disableAdForm();
};

// Event handlers

const onMainPinInactiveMouseDown = (evt) => {
  if (evt.button === 0) {
    activatePage();
  }
};

const onMainPinInactiveKeyDown = (evt) => {
  if (evt.key === `Enter`) {
    activatePage();
  }
};

const onMainPinActiveMouseDown = () => {
  // Placeholder to support main pin dragging across the map
};

// Main script
window.map.addOnMainPinMouseDown(onMainPinInactiveMouseDown);
window.map.addOnMainPinKeyDown(onMainPinInactiveKeyDown);

deactivatePage();

