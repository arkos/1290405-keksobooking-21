'use strict';

(() => {

  const CAPACITY_RULES_MAP = {
    [100]: [0],
    [1]: [1],
    [2]: [1, 2],
    [3]: [1, 2, 3]
  };

  const PRICE_RULES_MAP = {
    [`bungalow`]: 0,
    [`flat`]: 1000,
    [`house`]: 5000,
    [`palace`]: 10000
  };

  const UPLOAD_FORM_DATA_URL = `https://21.javascript.pages.academy/keksobooking`;

  const {map, http} = window;

  let sendUploadSuccess;
  let sendUploadFailure;

  const adForm = document.querySelector(`.ad-form`);
  const title = adForm.querySelector(`#title`);
  const type = adForm.querySelector(`#type`);
  const price = adForm.querySelector(`#price`);
  const roomsNumber = adForm.querySelector(`#room_number`);
  const guestsNumber = adForm.querySelector(`#capacity`);
  const checkIn = adForm.querySelector(`#timein`);
  const checkOut = adForm.querySelector(`#timeout`);
  const address = document.querySelector(`#address`);

  const enable = () => {
    adForm.classList.remove(`ad-form--disabled`);
    adForm.addEventListener(`submit`, onFormSubmit);

    title.addEventListener(`invalid`, onTitleInvalid);
    title.addEventListener(`input`, onTitleInput);

    price.addEventListener(`input`, onPriceInput);

    type.addEventListener(`change`, onTypeChange);

    checkIn.addEventListener(`change`, onCheckInChange);
    checkOut.addEventListener(`change`, onCheckOutChange);

    roomsNumber.addEventListener(`change`, onRoomsNumberChange);
    guestsNumber.addEventListener(`change`, onGuestNumberChange);

    enableFilters();
    map.subscribeToMainPinUpdates(setMainPinCoordinates);

    setCapacityValidity(roomsNumber);
    setPriceAttributes();
    setPriceValidity(type);
  };

  const disable = () => {
    adForm.classList.add(`ad-form--disabled`);
    adForm.removeEventListener(`submit`, onFormSubmit);

    title.removeEventListener(`invalid`, onTitleInvalid);
    title.removeEventListener(`input`, onTitleInput);

    price.removeEventListener(`input`, onPriceInput);

    type.removeEventListener(`change`, onTypeChange);
    price.removeEventListener(`change`, onPriceChange);

    checkIn.removeEventListener(`change`, onCheckInChange);
    checkOut.removeEventListener(`change`, onCheckOutChange);

    roomsNumber.removeEventListener(`change`, onRoomsNumberChange);
    guestsNumber.removeEventListener(`change`, onGuestNumberChange);

    adForm.reset();

    sendUploadSuccess = null;
    sendUploadFailure = null;

    disableFilters();
    map.subscribeToMainPinUpdates(setMainPinCoordinates);
  };

  const setPriceAttributes = () => {
    const priceValue = PRICE_RULES_MAP[type.value];
    price.placeholder = priceValue;
    price.min = priceValue;
  };

  const validateRoomCapacity = (rooms, guests) => CAPACITY_RULES_MAP[rooms].includes(guests);

  const setCapacityValidity = (target) => {
    const isValid = validateRoomCapacity(+roomsNumber.value, +guestsNumber.value);

    roomsNumber.setCustomValidity(``);
    guestsNumber.setCustomValidity(``);

    if (!isValid) {
      target.setCustomValidity(`Количество комнат не соответствует количеству гостей`);
    }

    target.reportValidity();
  };

  const onRoomsNumberChange = (evt) => {
    setCapacityValidity(evt.target);
  };

  const onGuestNumberChange = (evt) => {
    setCapacityValidity(evt.target);
  };

  const onTitleInvalid = () => {
    if (title.validity.tooShort) {
      title.setCustomValidity(`Заголовок объявления должен состоять минимум из 30 символов`);
    } else if (title.validity.tooLong) {
      title.setCustomValidity(`Заголовок объявления не должен превышать 100 символов`);
    } else if (title.validity.valueMissing) {
      title.setCustomValidity(`Заголовок объявления это обязательное поле`);
    } else {
      title.setCustomValidity(``);
    }
  };

  const onTitleInput = () => {
    title.setCustomValidity(``);
  };

  const onPriceInput = () => {
    setPriceValidity();
  };

  const onTypeChange = () => {
    setPriceAttributes();
    setPriceValidity();
  };

  const onPriceChange = () => {
    setPriceValidity();
  };

  const setPriceValidity = () => {

    if (price.validity.valueMissing) {
      price.setCustomValidity(`Цена за ночь это обязательное поле`);
    } else if (price.validity.rangeOverflow) {
      price.setCustomValidity(`Цена за ночь не должна превышать 1000000`);
    }

    if (price.validity.valueMissing || price.validity.rangeOverflow) {
      price.reportValidity();
      return;
    }

    const isValid = validatePriceType(type.value, price.value);

    if (!isValid) {
      price.setCustomValidity(`Цена за ночь должна быть минимум ${PRICE_RULES_MAP[type.value]} для данного типа жилья`);
    } else {
      price.setCustomValidity(``);
    }

    price.reportValidity();
  };

  const validatePriceType = (typeValue, priceNumber) => PRICE_RULES_MAP[typeValue] <= priceNumber;

  const enableFilters = () => {
    for (const filter of adForm.children) {
      if (!filter.matches(`#address`)) {
        filter.disabled = false;
      }
    }
  };

  const disableFilters = () => {
    for (const filter of adForm.children) {
      if (!filter.matches(`#address`)) {
        filter.disabled = true;
      }
    }
  };

  const syncCheckIn = () => {
    checkIn.value = checkOut.value;
  };

  const syncCheckOut = () => {
    checkOut.value = checkIn.value;
  };

  const onCheckInChange = () => {
    syncCheckOut();
  };

  const onCheckOutChange = () => {
    syncCheckIn();
  };

  const onFormSubmit = (evt) => {
    http.upload(UPLOAD_FORM_DATA_URL, new FormData(adForm), onUploadSuccess, onUploadFailure);
    evt.preventDefault();
  };

  const onUploadSuccess = (response) => {
    if (sendUploadSuccess) {
      sendUploadSuccess(response);
    }
  };

  const onUploadFailure = () => {
    if (sendUploadFailure) {
      sendUploadFailure();
    }
  };

  const setMainPinCoordinates = (coords) => {
    const {x, y} = coords;
    address.value = `${x}, ${y}`;
  };

  const subscribeToUploadSuccess = (cb) => {
    sendUploadSuccess = cb;
  };

  const subscribeToUploadFailure = (cb) => {
    sendUploadFailure = cb;
  };

  window.form = {
    enable,
    disable,
    subscribeToUploadSuccess,
    subscribeToUploadFailure
  };

})();

