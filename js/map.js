'use strict';

(() => {

  const mapPinMain = document.querySelector(`.map__pin--main`);

  let isActive = false;

  const sampleAds = window.data.mockAds();

  const MAIN_PIN_WIDTH = 65;
  const MAIN_PIN_ACTIVE_HEIGHT = 84;
  const MAIN_PIN_INACTIVE_HEIGHT = 65;

  const map = document.querySelector(`.map`);

  const mapFiltersContainer = document.querySelector(`.map__filters-container`);
  const mapFilters = mapFiltersContainer.querySelector(`.map__filters`);

  const showMap = () => {
    map.classList.remove(`map--faded`);

    isActive = true;

    renderPinElements(sampleAds);
    renderAdPopup(sampleAds[0]);
    enableMapFilters();
  };

  const hideMap = () => {
    map.classList.add(`map--faded`);

    isActive = false;

    disableMapFilters();

  };

  const enableMapFilters = () => {
    for (const filter of mapFilters.children) {
      filter.disabled = false;
    }
  };

  const disableMapFilters = () => {
    for (const filter of mapFilters.children) {
      filter.disabled = true;
    }
  };

  const addOnMainPinMouseDown = (cb) => {
    mapPinMain.addEventListener(`mousedown`, cb);
  };

  const addOnMainPinKeyDown = (cb) => {
    mapPinMain.addEventListener(`keydown`, cb);
  };

  const removeOnMainPinMouseDown = (cb) => {
    mapPinMain.removeEventListener(`mousedown`, cb);
  };

  const removeOnMainPinKeyDown = (cb) => {
    mapPinMain.removeEventListener(`keydown`, cb);
  };

  const renderAdPopup = (ad) => {
    const popupTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);
    map.insertBefore(window.card.createPopupAdElement(popupTemplate, ad), mapFiltersContainer);
  };

  const calcMainPinCoords = () => {
    const coords = {};

    const mainPinLeft = parseInt(mapPinMain.style.left, 10);
    const mainPinTop = parseInt(mapPinMain.style.top, 10);

    coords.x = mainPinLeft + Math.floor(MAIN_PIN_WIDTH / 2);

    if (isActive) {
      coords.y = mainPinTop + MAIN_PIN_ACTIVE_HEIGHT;
    } else {
      coords.y = mainPinTop + Math.floor(MAIN_PIN_INACTIVE_HEIGHT / 2);
    }

    return coords;
  };

  const renderPinElements = (ads) => {
    const pinTemplate = document
      .querySelector(`#pin`)
      .content.querySelector(`.map__pin`);

    const fragment = document.createDocumentFragment();
    ads.forEach((ad) => fragment.appendChild(window.pin.createPinElement(pinTemplate, ad)));

    const mapPins = document.querySelector(`.map__pins`);
    mapPins.appendChild(fragment);
  };

  window.map = {
    showMap,
    hideMap,
    addOnMainPinMouseDown,
    addOnMainPinKeyDown,
    removeOnMainPinMouseDown,
    removeOnMainPinKeyDown
  };
})();

