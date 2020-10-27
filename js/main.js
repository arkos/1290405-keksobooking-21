'use strict';

const {map, form, util} = window;

const main = document.querySelector(`main`);
const successMessageTemplate = document.querySelector(`#success`)
  .content
  .querySelector(`.success`);

const errorMessageTemplate = document.querySelector(`#error`)
  .content
  .querySelector(`.error`);

const activatePage = () => {
  map.removeOnMainPinMouseDown(onMainPinInactiveMouseDown);
  map.removeOnMainPinKeyDown(onMainPinInactiveKeyDown);
  map.subscribeToLoadFailure(onLoadFailure);

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

const showErrorMessage = (customizer) => {
  let errorMessage;

  if (customizer) {
    errorMessage = document.createElement(`div`);
    errorMessage.classList.add(`error`);
    errorMessage.append(customizer);
  } else {
    errorMessage = errorMessageTemplate.cloneNode(true);
  }

  main.append(errorMessage);
  document.addEventListener(`click`, onErrorMessageClick);
  document.addEventListener(`keydown`, onErrorMessageEscKeyDown);
};

const removeErrorMessage = () => {
  const errorMessage = main.querySelector(`.error`);
  errorMessage.remove();
  document.removeEventListener(`click`, onErrorMessageClick);
  document.removeEventListener(`keydown`, onErrorMessageEscKeyDown);
};

const createCustomErrorMessage = () => {
  const errorMessage = document.createElement(`p`);
  errorMessage.textContent = `Ошибка запроса при загрузке данных сервера.`;
  errorMessage.classList.add(`error__message`);

  const actionButton = document.createElement(`button`);
  actionButton.classList.add(`error__button`);
  actionButton.textContent = `Закрыть`;

  const fragment = document.createDocumentFragment();
  fragment.append(errorMessage, actionButton);
  return fragment;
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

const onLoadFailure = () => {
  setTimeout(() => {
    showErrorMessage(createCustomErrorMessage());
  }, 100);
};

const onEscKeyDown = (evt) => {
  util.isEscEvent(evt, map.deactivateAnyPin);
};

const onMainPinInactiveMouseDown = (evt) => {
  util.isMainMouseButtonEvent(evt, activatePage);
};

const onMainPinInactiveKeyDown = (evt) => {
  util.isEnterEvent(evt, activatePage);
};

// Main script
deactivatePage();

