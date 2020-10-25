'use strict';

const {map, form, util} = window;

const main = document.querySelector(`main`);
const successMessageTemplate = document.querySelector(`#success`)
  .content
  .querySelector(`.success`);

const errorMessageTemplate = document.querySelector(`#error`)
  .content
  .querySelector(`.error`);

const errorTryAgain = errorMessageTemplate.querySelector(`.error__button`);

const activatePage = () => {
  map.removeOnMainPinMouseDown(onMainPinInactiveMouseDown);
  map.removeOnMainPinKeyDown(onMainPinInactiveKeyDown);
  form.subscribeToUploadSuccess(onUploadSuccess);
  form.subscribeToUploadFailure(onUploadFailure);
  form.subscribeToReset(onReset);

  form.enable();
  map.activate();

  document.addEventListener(`keydown`, onEscKeyDown);
};

const deactivatePage = () => {
  form.disable();
  map.deactivate();

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

const showErrorMessage = () => {
  const errorMessage = errorMessageTemplate.cloneNode(true);
  main.append(errorMessage);
  document.addEventListener(`click`, onErrorMessageClick);
  document.addEventListener(`keydown`, onErrorMessageEscKeyDown);
  errorTryAgain.addEventListener(`click`, onErrorMessageTryAgainClick);
};

const removeErrorMessage = () => {
  const errorMessage = main.querySelector(`.error`);
  errorMessage.remove();
  document.removeEventListener(`click`, onErrorMessageClick);
  document.removeEventListener(`keydown`, onErrorMessageEscKeyDown);
  errorTryAgain.removeEventListener(`click`, onErrorMessageTryAgainClick);
};


// Event handlers

const onSuccessMessageEscKeyDown = (evt) => {
  util.isEscEvent(evt, removeSuccessMessage);
};

const onSuccessMessageClick = () => {
  removeSuccessMessage();
};

const onErrorMessageEscKeyDown = (evt) => {
  util.isEscEvent(evt, removeErrorMessage);
};

const onErrorMessageClick = () => {
  removeErrorMessage();
};

const onErrorMessageTryAgainClick = () => {
  removeErrorMessage();
};

const onReset = () => {
  deactivatePage();
};

const onUploadSuccess = () => {
  deactivatePage();
  showSuccessMessage();
};

const onUploadFailure = () => {
  showErrorMessage();
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

