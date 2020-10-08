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

  const adForm = document.querySelector(`.ad-form`);
  const title = adForm.querySelector(`#title`);
  const type = adForm.querySelector(`#type`);
  const price = adForm.querySelector(`#price`);
  const roomsNumber = adForm.querySelector(`#room_number`);
  const guestsNumber = adForm.querySelector(`#capacity`);

  const enable = () => {
    adForm.classList.remove(`ad-form--disabled`);

    title.addEventListener(`invalid`, onTitleInvalid);
    title.addEventListener(`input`, onTitleInput);

    price.addEventListener(`input`, onPriceInput);

    type.addEventListener(`change`, onTypeChange);

    roomsNumber.addEventListener(`change`, onRoomsNumberChange);
    guestsNumber.addEventListener(`change`, onGuestNumberChange);

    enableFilters();
    setMainPinCoordinates();

    setCapacityValidity(roomsNumber);
    setPricePlaceholder();
    setPriceValidity(type);
  };

  const disable = () => {
    adForm.classList.add(`ad-form--disabled`);

    title.removeEventListener(`invalid`, onTitleInvalid);
    title.removeEventListener(`input`, onTitleInput);

    price.removeEventListener(`input`, onPriceInput);

    type.removeEventListener(`change`, onTypeChange);
    price.removeEventListener(`change`, onPriceChange);

    roomsNumber.removeEventListener(`change`, onRoomsNumberChange);
    guestsNumber.removeEventListener(`change`, onGuestNumberChange);

    disableFilters();
    setMainPinCoordinates();
  };

  const setPricePlaceholder = () => {
    price.placeholder = PRICE_RULES_MAP[type.value];
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
    setPricePlaceholder();
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

  const setMainPinCoordinates = () => {
    const addressElement = document.querySelector(`#address`);
    const {x, y} = window.map.getMainPinCoords();
    addressElement.value = `${x}, ${y}`;
  };

  window.form = {
    enable,
    disable,
  };

})();

