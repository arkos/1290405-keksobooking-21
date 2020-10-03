'use strict';

(() => {

  const CAPACITY_RULES_MAP = {
    [100]: [0],
    [1]: [1],
    [2]: [1, 2],
    [3]: [1, 2, 3]
  };

  const adForm = document.querySelector(`.ad-form`);

  const enableAdForm = () => {
    adForm.classList.remove(`ad-form--disabled`);

    const roomsNumber = adForm.querySelector(`#room_number`);
    roomsNumber.addEventListener(`change`, onRoomsNumberChange);

    const guestsNumber = adForm.querySelector(`#capacity`);
    guestsNumber.addEventListener(`change`, onGuestNumberChange);

    enableAdFilters();
    setMainPinCoordinates();

    setCapacityValidity(roomsNumber);
  };

  const disableAdForm = () => {
    adForm.classList.add(`ad-form--disabled`);

    const roomsNumber = adForm.querySelector(`#room_number`);
    roomsNumber.removeEventListener(`change`, onRoomsNumberChange);

    const guestsNumber = adForm.querySelector(`#capacity`);
    guestsNumber.removeEventListener(`change`, onGuestNumberChange);

    disableAdFilters();
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

  const setMainPinCoordinates = () => {
    const addressElement = document.querySelector(`#address`);
    const {x, y} = window.map.calcMainPinCoords();
    addressElement.value = `${x}, ${y}`;
  };


  window.form = {
    enableAdForm,
    disableAdForm,
    setMainPinCoordinates
  };

})();

