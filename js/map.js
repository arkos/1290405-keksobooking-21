"use strict";

(() => {
  const MAIN_PIN_WIDTH = 65;
  const MAIN_PIN_ACTIVE_HEIGHT = 84;
  const MAIN_PIN_INACTIVE_HEIGHT = 65;
  const MAIN_PIN_INITIAL_X = 570;
  const MAIN_PIN_INITIAL_Y = 375;

  const MAP_COORD_MIN_X = 0;
  const MAP_COORD_MAX_X = 1200;
  const MAP_COORD_MIN_Y = 130;
  const MAP_COORD_MAX_Y = 630;

  const MAX_PINS_COUNT = 5;

  const LOW_OFFER_PRICE = 10000;
  const HIGH_OFFER_PRICE = 50000;

  const SOURCE_DATA_URL = `https://21.javascript.pages.academy/keksobooking/data`;

  const {util, pin, card, http, decorator} = window;

  const map = document.querySelector(`.map`);
  const mainPin = map.querySelector(`.map__pin--main`);

  const filtersContainer = document.querySelector(`.map__filters-container`);
  const filters = filtersContainer.querySelector(`.map__filters`);
  const filterByAccType = filters.querySelector(`#housing-type`);
  const filterByPriceRange = filters.querySelector(`#housing-price`);
  const filterByRoomCount = filters.querySelector(`#housing-rooms`);
  const filterByGuestCount = filters.querySelector(`#housing-guests`);

  const featuresContainer = filters.querySelector(`.map__features`);

  const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);
  const mapPins = document.querySelector(`.map__pins`);

  const mainPinSpikeOffset = {
    x: Math.floor(MAIN_PIN_WIDTH / 2),
    y: Math.floor(MAIN_PIN_INACTIVE_HEIGHT / 2),
  };

  let sendMainPinUpdated;

  let ads;

  const activateMainPin = (status) => {
    mainPinSpikeOffset.y = status ? Math.floor(MAIN_PIN_ACTIVE_HEIGHT)
      : Math.floor(MAIN_PIN_INACTIVE_HEIGHT / 2);
  };

  const activate = () => {
    map.classList.remove(`map--faded`);

    activateMainPin(true);

    sendMainPinUpdated(getMainPinSpikeCoords());

    http.load(SOURCE_DATA_URL, onLoadSuccess, onLoadFailure);

    map.addEventListener(`mousedown`, onMapMouseDown);
    map.addEventListener(`keydown`, onMapKeyDown);
    mainPin.addEventListener(`mousedown`, onMainPinMouseDown);
  };

  const deactivate = () => {
    map.classList.add(`map--faded`);
    removeCurrentPins();
    closePopup();

    activateMainPin(false);

    moveMainPinTo(MAIN_PIN_INITIAL_X, MAIN_PIN_INITIAL_Y);

    sendMainPinUpdated(getMainPinSpikeCoords());
    disableFilters();

    sendMainPinUpdated = null;
  };

  const enableFilters = () => {
    for (const filter of filters.children) {
      filter.disabled = false;
    }

    filterByAccType.addEventListener(`change`, onAccomodationTypeChange);
    filterByPriceRange.addEventListener(`change`, onPriceRangeChange);
    filterByRoomCount.addEventListener(`change`, onRoomCountChange);
    filterByGuestCount.addEventListener(`change`, onGuestCountChange);
    featuresContainer.addEventListener(`click`, onFeatureClick);
  };

  const disableFilters = () => {
    for (const filter of filters.children) {
      filter.disabled = true;
    }

    filterByAccType.removeEventListener(`change`, onAccomodationTypeChange);
    filterByPriceRange.removeEventListener(`change`, onPriceRangeChange);
    filterByRoomCount.removeEventListener(`change`, onRoomCountChange);
    filterByGuestCount.removeEventListener(`change`, onGuestCountChange);
    featuresContainer.addEventListener(`click`, onFeatureClick);
  };

  const addOnMainPinMouseDown = (cb) => {
    mainPin.addEventListener(`mousedown`, cb);
  };

  const addOnMainPinKeyDown = (cb) => {
    mainPin.addEventListener(`keydown`, cb);
  };

  const removeOnMainPinMouseDown = (cb) => {
    mainPin.removeEventListener(`mousedown`, cb);
  };

  const removeOnMainPinKeyDown = (cb) => {
    mainPin.removeEventListener(`keydown`, cb);
  };

  const renderPopup = (ad) => {
    const popup = card.create(ad);
    card.open(popup, filtersContainer);
  };

  const getMainPinSpikeCoords = () => {
    const coords = {};

    const mainPinLeft = parseInt(mainPin.style.left, 10);
    const mainPinTop = parseInt(mainPin.style.top, 10);

    coords.x = mainPinLeft + mainPinSpikeOffset.x;
    coords.y = mainPinTop + mainPinSpikeOffset.y;

    return coords;
  };

  const renderPins = (pinsToRender) => {
    const pinElements = [];
    pinsToRender.forEach((pinToRender, key) => pinElements.push(pin.create(pinTemplate, pinToRender, key)));

    removeCurrentPins();

    mapPins.append(...pinElements);
  };

  const removeCurrentPins = () => {
    const currentPinElements = mapPins.querySelectorAll(`.map__pin:not([class*="map__pin--main"])`);
    currentPinElements.forEach((element) => element.remove());
  };

  const updatePins = () => {
    const filteredPins = applyFiltersToPins();
    const filteredAds = Array.from(filteredPins).slice(0, MAX_PINS_COUNT);
    renderPins(new Map(filteredAds));
  };

  const applyFiltersToPins = () => {
    const fromAds = Array.from(ads);

    const filteredAds = fromAds.filter((fromAd) => {
      const ad = fromAd[1];
      return applyFilterByAccType(ad) &&
        applyFilterByPriceRange(ad) &&
        applyFilterByRoomCount(ad) &&
        applyFilterByGuestCount(ad) &&
        applyFilterByFeature(ad);
    });

    return new Map(filteredAds);
  };

  const applyFilterByAccType = (ad) => filterByAccType.value === `any` || filterByAccType.value === ad.offer.type;

  const applyFilterByPriceRange = (ad) => {
    return filterByPriceRange.value === `any` ||
      (filterByPriceRange.value === `low` && ad.offer.price < LOW_OFFER_PRICE) ||
      (filterByPriceRange.value === `middle` && (ad.offer.price >= LOW_OFFER_PRICE && ad.offer.price <= HIGH_OFFER_PRICE)) ||
      (filterByPriceRange.value === `high` && ad.offer.price > HIGH_OFFER_PRICE);
  };

  const applyFilterByRoomCount = (ad) => filterByRoomCount.value === `any` || +filterByRoomCount.value === ad.offer.rooms;

  const applyFilterByGuestCount = (ad) => filterByGuestCount.value === `any` || +filterByGuestCount.value === ad.offer.guests;

  const applyFilterByFeature = (ad) => {
    const checkedFeatures = featuresContainer.querySelectorAll(`.map__checkbox:checked`);

    if (checkedFeatures.length === 0) {
      return true;
    }

    return Array.from(checkedFeatures)
      .every((checkedFeature) => ad.offer.features.includes(checkedFeature.value));
  };

  const filterEventHandler = () => {
    updatePins();
    closePopup();
  };

  const onAccomodationTypeChange = decorator.debounce(filterEventHandler);

  const onPriceRangeChange = decorator.debounce(filterEventHandler);

  const onRoomCountChange = decorator.debounce(filterEventHandler);

  const onGuestCountChange = decorator.debounce(filterEventHandler);

  const onFeatureClick = decorator.debounce(filterEventHandler);

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

      const {x: currentPointerLeft, y: currentPointerTop} = getMainPinSpikeCoords();

      let movePointerLeftTo = currentPointerLeft - shift.x;
      let movePointerTopTo = currentPointerTop - shift.y;

      if (movePointerLeftTo < MAP_COORD_MIN_X) {
        movePointerLeftTo = MAP_COORD_MIN_X;
      } else if (movePointerLeftTo > MAP_COORD_MAX_X) {
        movePointerLeftTo = MAP_COORD_MAX_X;
      }

      if (movePointerTopTo < MAP_COORD_MIN_Y) {
        movePointerTopTo = MAP_COORD_MIN_Y;
      } else if (movePointerTopTo > MAP_COORD_MAX_Y) {
        movePointerTopTo = MAP_COORD_MAX_Y;
      }

      startCoords.x = moveEvt.clientX;
      startCoords.y = moveEvt.clientY;

      if ((currentPointerLeft !== movePointerLeftTo) || (currentPointerTop !== movePointerTopTo)) {
        moveMainPinSpikeTo(movePointerLeftTo, movePointerTopTo);
        if (sendMainPinUpdated) {
          sendMainPinUpdated(getMainPinSpikeCoords());
        }
      }

    };

    const onMouseUp = (upEvt) => {
      upEvt.preventDefault();
      sendMainPinUpdated(getMainPinSpikeCoords());
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
    mainPinSpikeOffset.y = MAIN_PIN_ACTIVE_HEIGHT;
    updatePins();
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

  const moveMainPinSpikeTo = (moveLeftTo, moveTopTo) => {
    const {x: currentLeft, y: currentTop} = getMainPinSpikeCoords();

    const shiftLeft = currentLeft - moveLeftTo;
    const shiftTop = currentTop - moveTopTo;

    const destLeft = mainPin.offsetLeft - shiftLeft;
    const destTop = mainPin.offsetTop - shiftTop;

    moveMainPinTo(destLeft, destTop);
  };

  const moveMainPinTo = (moveLeftTo, moveTopTo) => {
    mainPin.style.left = `${moveLeftTo}px`;
    mainPin.style.top = `${moveTopTo}px`;
  };

  window.map = {
    activate,
    deactivate,
    addOnMainPinMouseDown,
    addOnMainPinKeyDown,
    removeOnMainPinMouseDown,
    removeOnMainPinKeyDown,
    subscribeToMainPinUpdates,
    closePopup
  };
})();
