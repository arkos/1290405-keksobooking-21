'use strict';



const CAPACITY_RULES_MAP = {
  [100]: [0],
  [1]: [1],
  [2]: [1, 2],
  [3]: [1, 2, 3]
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
  window.pin.renderPinElements(sampleAds);
  window.pin.setMainPinCoordinates();
};

const deactivatePage = () => {
  isActive = false;
  hideMap();
  disableAdForm();
  disableMapFilters();
  disableAdFilters();
  window.pin.setMainPinCoordinates();
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

const sampleAds = window.data.mockAds();

const map = document.querySelector(`.map`);
const adForm = document.querySelector(`.ad-form`);

const mapFiltersContainer = document.querySelector(`.map__filters-container`);
const mapFilters = mapFiltersContainer.querySelector(`.map__filters`);

const mapPinMain = document.querySelector(`.map__pin--main`);
mapPinMain.addEventListener(`mousedown`, onMainPinInactiveMouseDown);
mapPinMain.addEventListener(`keydown`, onMainPinInactiveKeyDown);

window.card.renderAdPopup(sampleAds[0]);

deactivatePage();

