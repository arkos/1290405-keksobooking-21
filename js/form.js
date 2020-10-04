'use strict';

(() => {

  const CAPACITY_RULES_MAP = {
    [100]: [0],
    [1]: [1],
    [2]: [1, 2],
    [3]: [1, 2, 3]
  };

  const adForm = document.querySelector(`.ad-form`);

  const enable = () => {
    adForm.classList.remove(`ad-form--disabled`);

    const roomsNumber = adForm.querySelector(`#room_number`);
    roomsNumber.addEventListener(`change`, onRoomsNumberChange);

    const guestsNumber = adForm.querySelector(`#capacity`);
    guestsNumber.addEventListener(`change`, onGuestNumberChange);

    enableFilters();
    setMainPinCoordinates();

    setCapacityValidity(roomsNumber);
  };

  const disable = () => {
    adForm.classList.add(`ad-form--disabled`);

    const roomsNumber = adForm.querySelector(`#room_number`);
    roomsNumber.removeEventListener(`change`, onRoomsNumberChange);

    const guestsNumber = adForm.querySelector(`#capacity`);
    guestsNumber.removeEventListener(`change`, onGuestNumberChange);

    disableFilters();
    setMainPinCoordinates();
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

  const onRoomsNumberChange = (evt) => {
    setCapacityValidity(evt.target);
  };

  const onGuestNumberChange = (evt) => {
    setCapacityValidity(evt.target);
  };

  const enableFilters = () => {
    for (const filter of adForm.children) {
      filter.disabled = false;
    }
  };

  const disableFilters = () => {
    for (const filter of adForm.children) {
      filter.disabled = true;
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

