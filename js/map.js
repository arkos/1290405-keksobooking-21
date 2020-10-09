"use strict";

(() => {
  const MAIN_PIN_WIDTH = 65;
  const MAIN_PIN_ACTIVE_HEIGHT = 84;
  const MAIN_PIN_INACTIVE_HEIGHT = 65;

  const MAP_COORD_MIN_X = 0;
  const MAP_COORD_MAX_X = 1200;
  const MAP_COORD_MIN_Y = 130;
  const MAP_COORD_MAX_Y = 630;

  const SOURCE_DATA_URL = `https://21.javascript.pages.academy/keksobooking/data`;

  const {util, card, http} = window;

  const map = document.querySelector(`.map`);
  const mapMainPin = map.querySelector(`.map__pin--main`);

  const mapFiltersContainer = document.querySelector(`.map__filters-container`);
  const mapFilters = mapFiltersContainer.querySelector(`.map__filters`);

  const mainPinPointer = {
    x: Math.floor(MAIN_PIN_WIDTH / 2),
    y: Math.floor(MAIN_PIN_INACTIVE_HEIGHT / 2),
  };

  let sendMainPinUpdated;

  let ads;

  const show = () => {
    map.classList.remove(`map--faded`);

    mainPinPointer.y = Math.floor(MAIN_PIN_ACTIVE_HEIGHT);

    sendMainPinUpdated(getMainPinPointerCoords());

    http.load(SOURCE_DATA_URL, onLoadSuccess, onLoadFailure);

    map.addEventListener(`mousedown`, onMapMouseDown);
    map.addEventListener(`keydown`, onMapKeyDown);
    mapMainPin.addEventListener(`mousedown`, onMainPinMouseDown);
  };

  const hide = () => {
    map.classList.add(`map--faded`);

    mainPinPointer.y = Math.floor(MAIN_PIN_INACTIVE_HEIGHT / 2);

    sendMainPinUpdated(getMainPinPointerCoords());
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
    mapMainPin.addEventListener(`mousedown`, cb);
  };

  const addOnMainPinKeyDown = (cb) => {
    mapMainPin.addEventListener(`keydown`, cb);
  };

  const removeOnMainPinMouseDown = (cb) => {
    mapMainPin.removeEventListener(`mousedown`, cb);
  };

  const removeOnMainPinKeyDown = (cb) => {
    mapMainPin.removeEventListener(`keydown`, cb);
  };

  const renderPopup = (ad) => {
    const popup = card.create(ad);
    card.open(popup, mapFiltersContainer);
  };

  const getMainPinPointerCoords = () => {
    const coords = {};

    const mainPinLeft = parseInt(mapMainPin.style.left, 10);
    const mainPinTop = parseInt(mapMainPin.style.top, 10);

    coords.x = mainPinLeft + mainPinPointer.x;
    coords.y = mainPinTop + mainPinPointer.y;

    return coords;
  };

  const renderPins = () => {
    const pinTemplate = document
      .querySelector(`#pin`)
      .content.querySelector(`.map__pin`);

    const fragment = document.createDocumentFragment();
    ads.forEach((ad, key) =>
      fragment.append(window.pin.create(pinTemplate, ad, key))
    );

    const mapPins = document.querySelector(`.map__pins`);
    mapPins.append(fragment);
  };

  const onMapMouseDown = (evt) => {
    util.isMainMouseButtonEvent(evt, () => openPopup(evt));
  };

  const onMapKeyDown = (evt) => {
    util.isEnterEvent(evt, () => openPopup(evt));
  };

  const onMainPinMouseDown = (evt) => {
    evt.preventDefault();

    const startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    const onMouseMove = (moveEvt) => {
      const shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      const {x, y} = getMainPinPointerCoords();

      if (x - shift.x >= MAP_COORD_MIN_X && x - shift.x <= MAP_COORD_MAX_X) {
        startCoords.x = moveEvt.clientX;
        mapMainPin.style.left = `${mapMainPin.offsetLeft - shift.x}px`;
      }

      if (y - shift.y >= MAP_COORD_MIN_Y && y - shift.y <= MAP_COORD_MAX_Y) {
        startCoords.y = moveEvt.clientY;
        mapMainPin.style.top = `${mapMainPin.offsetTop - shift.y}px`;
      }

      sendMainPinUpdated(getMainPinPointerCoords());
    };

    const onMouseUp = (upEvt) => {
      upEvt.preventDefault();
      sendMainPinUpdated(getMainPinPointerCoords());
      document.removeEventListener(`mousemove`, onMouseMove);
      document.removeEventListener(`mouseup`, onMouseUp);
    };

    document.addEventListener(`mousemove`, onMouseMove);
    document.addEventListener(`mouseup`, onMouseUp);
  };

  const closePopup = (popup) => {
    if (!popup) {
      popup = map.querySelector(`.map__card`);
    }

    if (popup) {
      card.close(popup);
    }
  };

  const openPopup = (evt) => {
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

    const popupData = ads.get(+pinElement.dataset.key);
    renderPopup(popupData);
  };

  const onLoadSuccess = (data) => {
    ads = createAds(data);
    mainPinPointer.y = MAIN_PIN_ACTIVE_HEIGHT;
    renderPins(ads);
    enableFilters();
  };

  const onLoadFailure = () => {
    // Future error handling
  };

  const createAds = (data) => {
    if (!data || data.length === 0) {
      return null;
    }

    const storage = new Map();
    for (let i = 1; i <= data.length; i++) {
      storage.set(i, data[i - 1]);
    }
    return storage;
  };

  const subscribeToMainPinUpdates = (cb) => {
    sendMainPinUpdated = cb;
  };

  window.map = {
    show,
    hide,
    addOnMainPinMouseDown,
    addOnMainPinKeyDown,
    removeOnMainPinMouseDown,
    removeOnMainPinKeyDown,
    subscribeToMainPinUpdates,
    closePopup
  };
})();
