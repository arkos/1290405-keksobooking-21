'use strict';

(() => {

  const MAIN_PIN_WIDTH = 65;
  const MAIN_PIN_ACTIVE_HEIGHT = 84;
  const MAIN_PIN_INACTIVE_HEIGHT = 65;

  const map = document.querySelector(`.map`);
  const mapPinMain = map.querySelector(`.map__pin--main`);

  const mapFiltersContainer = document.querySelector(`.map__filters-container`);
  const mapFilters = mapFiltersContainer.querySelector(`.map__filters`);

  const mainPinPointer = {
    x: Math.floor(MAIN_PIN_WIDTH / 2),
    y: Math.floor(MAIN_PIN_INACTIVE_HEIGHT / 2)
  };

  const sampleAds = window.data.mockAds();

  const show = () => {
    map.classList.remove(`map--faded`);

    mainPinPointer.y = MAIN_PIN_ACTIVE_HEIGHT;

    renderpins(sampleAds);
    renderPopup(sampleAds[0]);
    enableFilters();
  };

  const hide = () => {
    map.classList.add(`map--faded`);

    mainPinPointer.y = Math.floor(MAIN_PIN_INACTIVE_HEIGHT / 2);

    disableFilters();

  };

  const enableFilters = () => {
    for (const filter of mapFilters.children) {
      filter.disabled = false;
    }
  };

  const disableFilters = () => {
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

  const renderPopup = (ad) => {
    const popupTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);
    map.insertBefore(window.card.create(popupTemplate, ad), mapFiltersContainer);
  };

  const getMainPinCoords = () => {
    const coords = {};

    const mainPinLeft = parseInt(mapPinMain.style.left, 10);
    const mainPinTop = parseInt(mapPinMain.style.top, 10);

    coords.x = mainPinLeft + mainPinPointer.x;
    coords.y = mainPinTop + mainPinPointer.y;

    return coords;
  };

  const renderpins = (ads) => {
    const pinTemplate = document
      .querySelector(`#pin`)
      .content.querySelector(`.map__pin`);

    const fragment = document.createDocumentFragment();
    ads.forEach((ad) => fragment.appendChild(window.pin.create(pinTemplate, ad)));

    const mapPins = document.querySelector(`.map__pins`);
    mapPins.appendChild(fragment);
  };

  window.map = {
    show,
    hide,
    addOnMainPinMouseDown,
    addOnMainPinKeyDown,
    removeOnMainPinMouseDown,
    removeOnMainPinKeyDown,
    getMainPinCoords
  };

})();

