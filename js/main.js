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


const MAIN_PIN_WIDTH = 65;
const MAIN_PIN_ACTIVE_HEIGHT = 84;
const MAIN_PIN_INACTIVE_HEIGHT = 65;

const CAPACITY_RULES_MAP = {
  [100]: [0],
  [1]: [1],
  [2]: [1, 2],
  [3]: [1, 2, 3]
};

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
  map.classList.remove(`map--faded`);
};

const hideMap = () => {
  map.classList.add(`map--faded`);
};

const enableAdForm = () => {
  adForm.classList.remove(`ad-form--disabled`);

  const roomsNumber = adForm.querySelector(`#room_number`);
  roomsNumber.addEventListener(`change`, onRoomsNumberChange);

  const guestsNumber = adForm.querySelector(`#capacity`);
  guestsNumber.addEventListener(`change`, onGuestNumberChange);

  setCapacityValidity(roomsNumber);
};

const disableAdForm = () => {
  adForm.classList.add(`ad-form--disabled`);

  const roomsNumber = adForm.querySelector(`#room_number`);
  roomsNumber.removeEventListener(`change`, onRoomsNumberChange);

  const guestsNumber = adForm.querySelector(`#capacity`);
  guestsNumber.removeEventListener(`change`, onGuestNumberChange);
};

const enableAdFilters = () => {
  for (let filter of adForm.children) {
    filter.disabled = false;
  }
};

const disableAdFilters = () => {
  for (let filter of adForm.children) {
    filter.disabled = true;
  }
};

const activatePage = () => {
  isActive = true;

  mapPinMain.removeEventListener(`mousedown`, onMainPinInactiveMouseDown);
  mapPinMain.removeEventListener(`keydown`, onMainPinInactiveKeyDown);

  mapPinMain.addEventListener(`mousedown`, onMainPinActiveMouseDown);

  showMap();
  enableAdForm();
  enableMapFilters();
  enableAdFilters();
  renderPinElements(sampleAds);
  setMainPinCoordinates();
};

const deactivatePage = () => {
  isActive = false;
  hideMap();
  disableAdForm();
  disableMapFilters();
  disableAdFilters();
  setMainPinCoordinates();
};

const enableMapFilters = () => {
  for (const filter of mapFilters.children) {
    filter.disabled = false;
  }
};

const disableMapFilters = () => {
  for (const filter of mapFilters.children) {
    filter.disabled = true;
  }
};

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

const validateRoomCapacity = (rooms, guests) => CAPACITY_RULES_MAP[rooms].includes(guests);

const setCapacityValidity = (target) => {
  const roomsNumber = adForm.querySelector(`#room_number`);
  const guestsNumber = adForm.querySelector(`#capacity`);
  const isValid = validateRoomCapacity(+roomsNumber.value, +guestsNumber.value);

  roomsNumber.setCustomValidity(``);
  guestsNumber.setCustomValidity(``);

  if (!isValid) {
    target.setCustomValidity(`Количество комнат не соответствует количеству гостей`);
  }

  target.reportValidity();
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
  const popupPhoto = popupPhotos.querySelector(`img`);
  popupPhotos.innerHTML = ``;

  if (!photos || photos.length === 0) {
    popupPhotos.hidden = true;
    return;
  }

  const fragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    let currentPhoto = popupPhoto.cloneNode();
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
  popupCapacity.textContent = getCapacityDescription(ad.offer);

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

const getCapacityDescription = (offer) => {
  let roomsDescription = `комнаты`;
  let guestsDescription = `гостей`;

  if (offer.rooms !== 11 && offer.rooms % 10 === 1) {
    roomsDescription = `комната`;
  } else if ((offer.rooms % 10 >= 5) || (offer.rooms >= 11 && offer.rooms <= 14) || (offer.rooms % 10 === 0)) {
    roomsDescription = `комнат`;
  }

  if (offer.guests !== 11 && offer.guests % 10 === 1) {
    guestsDescription = `гостя`;
  }

  return `${offer.rooms} ${roomsDescription} для ${offer.guests} ${guestsDescription}`;
};

const renderAdPopup = (ad) => {
  const popupTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);
  map.insertBefore(createPopupAdElement(popupTemplate, ad), mapFiltersContainer);
};

// Event handlers

const onMainPinInactiveMouseDown = (evt) => {
  if (evt.button === 0) {
    activatePage();
  }
};

const onMainPinInactiveKeyDown = (evt) => {
  if (evt.key === `Enter`) {
    activatePage();
  }
};

const onMainPinActiveMouseDown = () => {
  // Placeholder to support main pin dragging across the map
};

const onRoomsNumberChange = (evt) => {
  setCapacityValidity(evt.target);
};

const onGuestNumberChange = (evt) => {
  setCapacityValidity(evt.target);
};

// Main script

let isActive = false;

const sampleAds = mockAds(MOCK_ELEMENTS_COUNT);

const map = document.querySelector(`.map`);
const adForm = document.querySelector(`.ad-form`);

const mapFiltersContainer = document.querySelector(`.map__filters-container`);
const mapFilters = mapFiltersContainer.querySelector(`.map__filters`);

const mapPinMain = document.querySelector(`.map__pin--main`);
mapPinMain.addEventListener(`mousedown`, onMainPinInactiveMouseDown);
mapPinMain.addEventListener(`keydown`, onMainPinInactiveKeyDown);

renderAdPopup(sampleAds[0]);

deactivatePage();

