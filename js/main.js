'use strict';

const INDEX_PAD_LENGTH = 2;

const MOCK_ELEMENTS_COUNT = 8;

const AD_ACCOMODATION_TYPES = [
  `palace`,
  `flat`,
  `house`,
  `bungalow`
];

const AD_CHECKIN_TIMES = [
  `12:00`,
  `13:00`,
  `14:00`
];

const AD_CHECKOUT_TIMES = [
  `12:00`,
  `13:00`,
  `14:00`
];

const AD_ACCOMODATION_FEATURES = [
  `wifi`,
  `dishwasher`,
  `parking`,
  `washer`,
  `elevator`,
  `conditioner`
];

const AD_ACCOMODATION_PRICE_MIN = 500;
const AD_ACCOMODATION_PRICE_MAX = 2000;

const AD_ACCOMODATION_ROOMS_MIN = 1;
const AD_ACCOMODATION_ROOMS_MAX = 4;

const AD_ACCOMODATION_GUESTS_MIN = 1;
const AD_ACCOMODATION_GUESTS_MAX = 4;

const AD_ACCOMODATION_PHOTOS = [
  `http://o0.github.io/assets/images/tokyo/hotel1.jpg`,
  `http://o0.github.io/assets/images/tokyo/hotel2.jpg`,
  `http://o0.github.io/assets/images/tokyo/hotel3.jpg`
];

const AD_ACCOMODATION_LOCATION_X_MIN = 0;
const AD_ACCOMODATION_LOCATION_X_MAX = 1200;

const AD_ACCOMODATION_LOCATION_Y_MIN = 130;
const AD_ACCOMODATION_LOCATION_Y_MAX = 500;

const getRandomInRange = function (min, max) {
  return Math.floor(Math.random() * Math.floor(max - min)) + min;
};

const getRandomItem = function (items) {
  return items[getRandomInRange(0, items.length - 1)];
};

const getRandomItems = function (items) {
  const randomLength = getRandomInRange(1, items.length - 1);
  const shuffledItems = shuffleItems(items);
  return shuffledItems.slice(0, randomLength);
};

const shuffleItems = function (items) {
  const shuffledItems = [...items];
  for (let i = items.length - 1; i >= 1; i--) {
    const randomIndex = getRandomInRange(0, i);
    const swap = items[i];
    items[i] = items[randomIndex];
    items[randomIndex] = swap;
  }
  return shuffledItems;
};

const mockAvatar = function (index) {
  const padIndex = String(index).padStart(INDEX_PAD_LENGTH, `0`);
  return `img/avatars/user${padIndex}.png`;
};

const mockAds = function (length) {
  const ads = [];

  for (let i = 0; i < length; i++) {
    const locationX = getRandomInRange(AD_ACCOMODATION_LOCATION_X_MIN, AD_ACCOMODATION_LOCATION_X_MAX);
    const locationY = getRandomInRange(AD_ACCOMODATION_LOCATION_Y_MIN, AD_ACCOMODATION_LOCATION_Y_MAX);

    const ad = {
      author: {
        avatar: mockAvatar(i + 1)
      },
      offer: {
        title: `Title number #${i + 1}`,
        address: `${locationX}, ${locationY}`,
        price: getRandomInRange(AD_ACCOMODATION_PRICE_MIN, AD_ACCOMODATION_PRICE_MAX),
        type: getRandomItem(AD_ACCOMODATION_TYPES),
        rooms: getRandomInRange(AD_ACCOMODATION_ROOMS_MIN, AD_ACCOMODATION_ROOMS_MAX),
        guests: getRandomInRange(AD_ACCOMODATION_GUESTS_MIN, AD_ACCOMODATION_GUESTS_MAX),
        checkin: getRandomItem(AD_CHECKIN_TIMES),
        checkout: getRandomItem(AD_CHECKOUT_TIMES),
        features: getRandomItems(AD_ACCOMODATION_FEATURES),
        description: `Description number #${i + 1}`,
        photos: getRandomItems(AD_ACCOMODATION_PHOTOS)
      },
      location: {
        x: locationX,
        y: locationY
      }
    };

    ads.push(ad);
  }
  return ads;
};

const createPinElement = function (pinTemplate, ad) {
  const pinElement = pinTemplate.cloneNode(true);

  const pinLeftPosition = ad.location.x;
  const pinTopPosition = ad.location.y;

  pinElement.style.left = `${pinLeftPosition}px`;
  pinElement.style.top = `${pinTopPosition}px`;

  const pinImage = pinElement.querySelector(`img`);
  pinImage.src = ad.author.avatar;
  pinImage.alt = ad.offer.title;

  return pinElement;
};

const createPinElements = function (pinTemplate, ads) {
  const fragment = document.createDocumentFragment();
  ads.forEach((ad) => fragment.appendChild(createPinElement(pinTemplate, ad)));
  return fragment;
};

window.renderAds = function () {
  const map = document.querySelector(`.map`);
  map.classList.remove(`map--faded`);

  const pinTemplate = document
    .querySelector(`#pin`)
    .content.querySelector(`.map__pin`);

  const sampleAds = mockAds(MOCK_ELEMENTS_COUNT);
  const pinElements = createPinElements(pinTemplate, sampleAds);

  const mapPins = document.querySelector(`.map__pins`);
  mapPins.appendChild(pinElements);
};

window.renderAds();
