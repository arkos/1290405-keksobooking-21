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
const AD_ACCOMODATION_LOCATION_Y_MAX = 630;

const MAP_PIN_WIDTH = 50;
const MAP_PIN_HEIGHT = 70;

const getRandomInRange = (min, max) => Math.floor(Math.random() * Math.floor(max - min)) + min;

const getRandomItem = (items) => items[getRandomInRange(0, items.length - 1)];

const getRandomItems = (items) => {
  const randomLength = getRandomInRange(1, items.length);
  const shuffledItems = shuffleItems(items);
  return shuffledItems.slice(0, randomLength);
};

const shuffleItems = (items) => {
  const shuffledItems = [...items];
  for (let i = shuffledItems.length - 1; i >= 1; i--) {
    const randomIndex = getRandomInRange(0, i);
    const swap = shuffledItems[i];
    shuffledItems[i] = shuffledItems[randomIndex];
    shuffledItems[randomIndex] = swap;
  }
  return shuffledItems;
};

const mockAvatar = (index) => {
  const padIndex = String(index).padStart(INDEX_PAD_LENGTH, `0`);
  return `img/avatars/user${padIndex}.png`;
};

const mockAds = (length) => {
  const ads = [];

  for (let i = 1; i <= length; i++) {
    const locationX = getRandomInRange(AD_ACCOMODATION_LOCATION_X_MIN, AD_ACCOMODATION_LOCATION_X_MAX);
    const locationY = getRandomInRange(AD_ACCOMODATION_LOCATION_Y_MIN, AD_ACCOMODATION_LOCATION_Y_MAX);

    const ad = {
      author: {
        avatar: mockAvatar(i)
      },
      offer: {
        title: `Title number #${i}`,
        address: `${locationX}, ${locationY}`,
        price: getRandomInRange(AD_ACCOMODATION_PRICE_MIN, AD_ACCOMODATION_PRICE_MAX),
        type: getRandomItem(AD_ACCOMODATION_TYPES),
        rooms: getRandomInRange(AD_ACCOMODATION_ROOMS_MIN, AD_ACCOMODATION_ROOMS_MAX),
        guests: getRandomInRange(AD_ACCOMODATION_GUESTS_MIN, AD_ACCOMODATION_GUESTS_MAX),
        checkin: getRandomItem(AD_CHECKIN_TIMES),
        checkout: getRandomItem(AD_CHECKOUT_TIMES),
        features: getRandomItems(AD_ACCOMODATION_FEATURES),
        description: `Description number #${i}`,
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

const showMap = () => {
  const map = document.querySelector(`.map`);
  map.classList.remove(`map--faded`);
};

const sampleAds = mockAds(MOCK_ELEMENTS_COUNT);
showMap();
renderPinElements(sampleAds);
