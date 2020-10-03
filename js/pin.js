'use strict';

(() => {

  const MAP_PIN_WIDTH = 50;
  const MAP_PIN_HEIGHT = 70;

  const MAIN_PIN_WIDTH = 65;
  const MAIN_PIN_ACTIVE_HEIGHT = 84;
  const MAIN_PIN_INACTIVE_HEIGHT = 65;

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

  const setMainPinCoordinates = () => {
    const addressElement = document.querySelector(`#address`);
    const {x, y} = calcMainPinCoords();
    addressElement.value = `${x}, ${y}`;
  };

  const createPinElement = (pinTemplate, ad) => {
    const pinElement = pinTemplate.cloneNode(true);

    const pinLeftPosition = ad.location.x - Math.floor(MAP_PIN_WIDTH / 2);
    const pinTopPosition = ad.location.y - MAP_PIN_HEIGHT;

    pinElement.style.left = `${pinLeftPosition}px`;
    pinElement.style.top = `${pinTopPosition}px`;

    const pinImage = pinElement.querySelector(`img`);
    pinImage.src = ad.author.avatar;
    pinImage.alt = ad.offer.title;

    return pinElement;
  };

  const renderPinElements = (ads) => {
    const pinTemplate = document
      .querySelector(`#pin`)
      .content.querySelector(`.map__pin`);

    const fragment = document.createDocumentFragment();
    ads.forEach((ad) => fragment.appendChild(createPinElement(pinTemplate, ad)));

    const mapPins = document.querySelector(`.map__pins`);
    mapPins.appendChild(fragment);
  };

  window.pin = {
    renderPinElements,
    setMainPinCoordinates
  };
})();
