'use strict';

(() => {

  const MAP_PIN_WIDTH = 50;
  const MAP_PIN_HEIGHT = 70;

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

  window.pin = {
    createPinElement,
  };

})();
