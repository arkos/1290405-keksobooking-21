'use strict';

const activatePage = () => {
  isActive = true;

  const {map, form, pin} = window;

  mapPinMain.removeEventListener(`mousedown`, onMainPinInactiveMouseDown);
  mapPinMain.removeEventListener(`keydown`, onMainPinInactiveKeyDown);

  mapPinMain.addEventListener(`mousedown`, onMainPinActiveMouseDown);

  map.showMap();
  form.enableAdForm();
  map.enableMapFilters();
  form.enableAdFilters();
  pin.renderPinElements(sampleAds);
  pin.setMainPinCoordinates();
};

const deactivatePage = () => {
  isActive = false;

  const {map, form, pin} = window;

  map.hideMap();
  form.disableAdForm();
  map.disableMapFilters();
  form.disableAdFilters();
  pin.setMainPinCoordinates();
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

let isActive = false;

const sampleAds = window.data.mockAds();

const mapPinMain = document.querySelector(`.map__pin--main`);
mapPinMain.addEventListener(`mousedown`, onMainPinInactiveMouseDown);
mapPinMain.addEventListener(`keydown`, onMainPinInactiveKeyDown);

window.card.renderAdPopup(sampleAds[0]);

deactivatePage();

