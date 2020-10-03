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
  const {util} = window;
  util.isMainMouseButtonEvent(evt, activatePage);
};

const onMainPinInactiveKeyDown = (evt) => {
  const {util} = window;
  util.isEnterEvent(evt, activatePage);
};

const onMainPinActiveMouseDown = () => {
  // Placeholder to support main pin dragging across the map
};

// Main script
const {map} = window;

map.addOnMainPinMouseDown(onMainPinInactiveMouseDown);
map.addOnMainPinKeyDown(onMainPinInactiveKeyDown);

deactivatePage();

