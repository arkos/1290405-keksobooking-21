'use strict';

(() => {
  const {map, form, util} = window;

  const main = document.querySelector(`main`);
  const successMessageTemplate = document.querySelector(`#success`)
    .content
    .querySelector(`.success`);

  const activatePage = () => {
    map.removeOnMainPinMouseDown(onMainPinInactiveMouseDown);
    map.removeOnMainPinKeyDown(onMainPinInactiveKeyDown);
    form.subscribeToUploadSuccess(onUploadSuccess);

    form.enable();
    map.show();

    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const deactivatePage = () => {
    form.disable();
    map.hide();

    map.addOnMainPinMouseDown(onMainPinInactiveMouseDown);
    map.addOnMainPinKeyDown(onMainPinInactiveKeyDown);

    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const showSuccessMessage = () => {
    const successMessage = successMessageTemplate.cloneNode(true);
    main.append(successMessage);
    document.addEventListener(`click`, onSuccessMessageClick);
    document.addEventListener(`keydown`, onSuccessMessageEscKeyDown);
  };

  const removeSuccessMessage = () => {
    const successMessage = main.querySelector(`.success`);
    successMessage.remove();
    document.removeEventListener(`click`, onSuccessMessageClick);
    document.removeEventListener(`keydown`, onSuccessMessageEscKeyDown);
  };

  // Event handlers

  const onSuccessMessageEscKeyDown = (evt) => {
    util.isEscEvent(evt, removeSuccessMessage);
  };

  const onSuccessMessageClick = () => {
    removeSuccessMessage();
  };

  const onUploadSuccess = () => {
    showSuccessMessage();
    deactivatePage();
  };

  const onEscKeyDown = (evt) => {
    util.isEscEvent(evt, map.closePopup);
  };

  const onMainPinInactiveMouseDown = (evt) => {
    util.isMainMouseButtonEvent(evt, activatePage);
  };

  const onMainPinInactiveKeyDown = (evt) => {
    util.isEnterEvent(evt, activatePage);
  };

  // Main script
  deactivatePage();

})();

