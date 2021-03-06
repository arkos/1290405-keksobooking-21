'use strict';

const adAccomodationTypesRu = {
  [`palace`]: `Дворец`,
  [`flat`]: `Квартира`,
  [`house`]: `Дом`,
  [`bungalow`]: `Бунгало`
};

const popupTemplate = document
  .querySelector(`#card`)
  .content.querySelector(`.map__card`);

let sendPopupClose;

const renderTextContent = (element, predicate, content) => {

  if (!element) {
    return;
  }

  if (predicate) {
    element.textContent = content;
  } else {
    element.hidden = true;
  }
};

const create = (ad) => {
  const popup = popupTemplate.cloneNode(true);

  popup.dataset.key = ad.key;

  const popupTitle = popup.querySelector(`.popup__title`);
  renderTextContent(popupTitle, ad.offer.title, ad.offer.title);

  const popupAddress = popup.querySelector(`.popup__text--address`);
  renderTextContent(popupAddress, ad.offer.address, ad.offer.address);

  const popupPrice = popup.querySelector(`.popup__text--price`);
  renderTextContent(popupPrice, ad.offer.price, `${ad.offer.price}₽/ночь`);

  const popupType = popup.querySelector(`.popup__type`);
  renderTextContent(popupType, ad.offer.type, getAccomodationTypeRu(ad.offer.type));

  const popupCapacity = popup.querySelector(`.popup__text--capacity`);
  renderTextContent(popupCapacity, ad.offer.rooms && ad.offer.guests, getCapacityDescription(ad.offer));

  const popupCheckInOut = popup.querySelector(`.popup__text--time`);
  renderTextContent(popupCheckInOut, ad.offer.checkin && ad.offer.checkout, `Заезд после ${ad.offer.checkin}, выезд до ${ad.offer.checkout}`);

  renderFeatures(popup, ad.offer.features);

  const popupDescription = popup.querySelector(`.popup__description`);
  renderTextContent(popupDescription, ad.offer.description, ad.offer.description);

  renderPhotos(popup, ad.offer.photos);

  const popupAvatar = popup.querySelector(`.popup__avatar`);

  if (ad.author && ad.author.avatar) {
    popupAvatar.src = ad.author.avatar;
  }

  return popup;
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

const renderPhotos = (adElement, photos) => {
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
    fragment.append(currentPhoto);
  });

  popupPhotos.append(fragment);
};

const renderFeatures = (adElement, features) => {
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
    fragment.append(featureElement);
  });

  popupFeatures.append(fragment);
};

const subscribeToPopupClose = (cb) => {
  sendPopupClose = cb;
};

const onPopupCloseClick = (evt) => {
  if (sendPopupClose) {
    sendPopupClose(evt.target.parentElement);
  }
};

const getAccomodationTypeRu = (type) => adAccomodationTypesRu[type];

window.card = {
  create,
  close: (popup) => {
    if (popup) {
      const popupClose = popup.querySelector(`.popup__close`);
      popupClose.removeEventListener(`click`, onPopupCloseClick);
      popup.remove();
    }
  },

  open: (popup, elementBefore) => {
    elementBefore.before(popup);
    const popupClose = popup.querySelector(`.popup__close`);
    popupClose.addEventListener(`click`, onPopupCloseClick);
  },
  subscribeToPopupClose
};
