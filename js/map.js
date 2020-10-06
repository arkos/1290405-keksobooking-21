"use strict";

(() => {
  const MAIN_PIN_WIDTH = 65;
  const MAIN_PIN_ACTIVE_HEIGHT = 84;
  const MAIN_PIN_INACTIVE_HEIGHT = 65;

  const map = document.querySelector(`.map`);
  const mapPinMain = map.querySelector(`.map__pin--main`);

  const {util} = window;

  const mapFiltersContainer = document.querySelector(`.map__filters-container`);
  const mapFilters = mapFiltersContainer.querySelector(`.map__filters`);

  const mainPinPointer = {
    x: Math.floor(MAIN_PIN_WIDTH / 2),
    y: Math.floor(MAIN_PIN_INACTIVE_HEIGHT / 2),
  };

  const sampleAds = window.data.mockAds();

  const show = () => {
    map.classList.remove(`map--faded`);

    mainPinPointer.y = MAIN_PIN_ACTIVE_HEIGHT;

    renderPins(sampleAds);
    enableFilters();

    map.addEventListener(`mousedown`, onMapMouseDown);
    map.addEventListener(`keydown`, onMapKeyDown);
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
    const popupTemplate = document
      .querySelector(`#card`)
      .content.querySelector(`.map__card`);
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

  const renderPins = (ads) => {
    const pinTemplate = document
      .querySelector(`#pin`)
      .content.querySelector(`.map__pin`);

    const fragment = document.createDocumentFragment();
    ads.forEach((ad, key) =>
      fragment.appendChild(window.pin.create(pinTemplate, ad, key))
    );

    const mapPins = document.querySelector(`.map__pins`);
    mapPins.appendChild(fragment);
  };

  const onMapMouseDown = (evt) => {
    util.isMainMouseButtonEvent(evt, () => handlePopup(evt));
  };

  const onMapKeyDown = (evt) => {
    util.isEnterEvent(evt, () => handlePopup(evt));
  };

  const closePopup = (popup) => {
    if (!popup) {
      popup = map.querySelector(`.map__card`);
    }

    if (popup) {
      popup.remove();
    }
  };

  const handlePopup = (evt) => {
    const {target} = evt;

    const isPin = target.classList.contains(`map__pin`);
    const isPinImg = target.matches(`.map__pin img`);

    if (!isPin && !isPinImg) {
      return;
    }

    closePopup();

    const pinElement = isPinImg ? target.parentElement : target;
    if (pinElement.classList.contains(`map__pin--main`)) {
      return;
    }

    const popupData = sampleAds.get(+pinElement.dataset.key);
    renderPopup(popupData);
  };

  window.map = {
    show,
    hide,
    addOnMainPinMouseDown,
    addOnMainPinKeyDown,
    removeOnMainPinMouseDown,
    removeOnMainPinKeyDown,
    getMainPinCoords,
    closePopup
  };
})();
