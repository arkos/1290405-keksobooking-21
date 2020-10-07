'use strict';

(() => {

  const AD_ACCOMODATION_TYPES_RU = {
    [`palace`]: `Дворец`,
    [`flat`]: `Квартира`,
    [`house`]: `Дом`,
    [`bungalow`]: `Бунгало`
  };

  const create = (adTemplate, ad) => {
    const popup = adTemplate.cloneNode(true);

    const popupTitle = popup.querySelector(`.popup__title`);
    popupTitle.textContent = ad.offer.title;

    const popupAddress = popup.querySelector(`.popup__text--address`);
    popupAddress.textContent = ad.offer.address;

    const popupPrice = popup.querySelector(`.popup__text--price`);
    popupPrice.textContent = `${ad.offer.price}₽/ночь`;

    const popupType = popup.querySelector(`.popup__type`);
    popupType.textContent = getAccomodationTypeRu(ad.offer.type);

    const popupCapacity = popup.querySelector(`.popup__text--capacity`);
    popupCapacity.textContent = getCapacityDescription(ad.offer);

    const popupCheckInOut = popup.querySelector(`.popup__text--time`);
    popupCheckInOut.textContent = `Заезд после ${ad.offer.checkin}, выезд до ${ad.offer.checkout}`;

    renderFeatures(popup, ad.offer.features);

    const popupDescription = popup.querySelector(`.popup__description`);
    popupDescription.textContent = ad.offer.description;

    renderPhotos(popup, ad.offer.photos);

    const popupAvatar = popup.querySelector(`.popup__avatar`);
    popupAvatar.src = ad.author.avatar;

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
      fragment.appendChild(currentPhoto);
    });

    popupPhotos.appendChild(fragment);
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
      fragment.appendChild(featureElement);
    });

    popupFeatures.appendChild(fragment);
  };

  const close = (popup) => {
    if (popup) {
      popup.remove();
    }
  };

  const getAccomodationTypeRu = (type) => AD_ACCOMODATION_TYPES_RU[type];

  window.card = {
    create,
    close
  };

})();
