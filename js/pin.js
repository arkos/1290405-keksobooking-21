'use strict';

const MAP_PIN_WIDTH = 50;
const MAP_PIN_HEIGHT = 70;

const create = (pinTemplate, ad, key) => {

  if (!ad || !ad.offer) {
    return null;
  }

  const pin = pinTemplate.cloneNode(true);

  pin.dataset.key = key;

  const pinLeftPosition = ad.location.x - Math.floor(MAP_PIN_WIDTH / 2);
  const pinTopPosition = ad.location.y - MAP_PIN_HEIGHT;

  pin.style.left = `${pinLeftPosition}px`;
  pin.style.top = `${pinTopPosition}px`;

  const pinImage = pin.querySelector(`img`);

  if (ad.author && ad.author.avatar) {
    pinImage.src = ad.author && ad.author.avatar;
  }

  pinImage.alt = ad.offer.title;

  return pin;
};
window.pin = {
  create,
};
