'use strict';

const INDEX_PAD_LENGTH = 2;

const MOCK_ELEMENTS_COUNT = 8;

const AD_ACCOMODATION_TYPES = [
  `palace`,
  `flat`,
  `house`,
  `bungalow`
];

const AD_ACCOMODATION_TYPES_RU = {
  [`palace`]: `Дворец`,
  [`flat`]: `Квартира`,
  [`house`]: `Дом`,
  [`bungalow`]: `Бунгало`
};

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

const getAccomodationTypeRu = (type) => AD_ACCOMODATION_TYPES_RU[type];

const renderPopupFeatures = (adElement, features) => {
  const popupFeatures = adElement.querySelector(`.popup__features`);
  popupFeatures.innerHTML = ``;

  if (!features || features.length === 0) {
    popupFeatures.hidden = true;
    return;
  }

  const fragment = document.createDocumentFragment();

  features.forEach((feature) => {
    let featureElement = document.createElement(`li`);
    let classes = [`popup__feature`, `popup__feature--${feature}`];
    featureElement.classList.add(...classes);
    fragment.appendChild(featureElement);
  });

  popupFeatures.appendChild(fragment);
};

const renderPopupPhotos = (adElement, photos) => {
  const popupPhotos = adElement.querySelector(`.popup__photos`);
  const clonePopupPhoto = popupPhotos.querySelector(`img`).cloneNode();
  popupPhotos.innerHTML = ``;

  if (!photos || photos.length === 0) {
    popupPhotos.hidden = true;
    return;
  }

  const fragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    let currentPhoto = clonePopupPhoto.cloneNode();
    currentPhoto.src = photo;
    fragment.appendChild(currentPhoto);
  });

  popupPhotos.appendChild(fragment);
};

const createPopupAdElement = (adTemplate, ad) => {
  const popupAdElement = adTemplate.cloneNode(true);

  const popupTitle = popupAdElement.querySelector(`.popup__title`);
  popupTitle.textContent = ad.offer.title;

  const popupAddress = popupAdElement.querySelector(`.popup__text--address`);
  popupAddress.textContent = ad.offer.address;

  const popupPrice = popupAdElement.querySelector(`.popup__text--price`);
  popupPrice.textContent = `${ad.offer.price}₽/ночь`;

  const popupType = popupAdElement.querySelector(`.popup__type`);
  popupType.textContent = getAccomodationTypeRu(ad.offer.type);

  const popupCapacity = popupAdElement.querySelector(`.popup__text--capacity`);
  popupCapacity.textContent = `${ad.offer.rooms} комнаты для ${ad.offer.guests} гостей`;

  const popupCheckInOut = popupAdElement.querySelector(`.popup__text--time`);
  popupCheckInOut.textContent = `Заезд после ${ad.offer.checkin}, выезд до ${ad.offer.checkout}`;

  renderPopupFeatures(popupAdElement, ad.offer.features);

  const popupDescription = popupAdElement.querySelector(`.popup__description`);
  popupDescription.textContent = ad.offer.description;

  renderPopupPhotos(popupAdElement, ad.offer.photos);

  const popupAvatar = popupAdElement.querySelector(`.popup__avatar`);
  popupAvatar.src = ad.author.avatar;

  return popupAdElement;
};

const renderAdPopup = (ad) => {
  const popupTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);
  const map = document.querySelector(`.map`);
  const mapFiltersContainer = map.querySelector(`.map__filters-container`);
  map.insertBefore(createPopupAdElement(popupTemplate, ad), mapFiltersContainer);
};

const sampleAds = mockAds(MOCK_ELEMENTS_COUNT);
showMap();
renderPinElements(sampleAds);
renderAdPopup(sampleAds[0]);
