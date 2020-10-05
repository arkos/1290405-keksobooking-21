'use strict';

(() => {

  const INDEX_PAD_LENGTH = 2;

  const MOCK_ELEMENTS_COUNT = 8;

  const AD_ACCOMODATION_TYPES = [
    `palace`,
    `flat`,
    `house`,
    `bungalow`
  ];

  const AD_CHECKIN_TIMES = [
    `12:00`,
    `13:00`,
    `14:00`
  ];

  const AD_CHECKOUT_TIMES = [
    `12:00`,
    `13:00`,
    `14:00`
  ];

  const AD_ACCOMODATION_FEATURES = [
    `wifi`,
    `dishwasher`,
    `parking`,
    `washer`,
    `elevator`,
    `conditioner`
  ];

  const AD_ACCOMODATION_PRICE_MIN = 500;
  const AD_ACCOMODATION_PRICE_MAX = 2000;

  const AD_ACCOMODATION_ROOMS_MIN = 1;
  const AD_ACCOMODATION_ROOMS_MAX = 4;

  const AD_ACCOMODATION_GUESTS_MIN = 1;
  const AD_ACCOMODATION_GUESTS_MAX = 4;

  const AD_ACCOMODATION_PHOTOS = [
    `http://o0.github.io/assets/images/tokyo/hotel1.jpg`,
    `http://o0.github.io/assets/images/tokyo/hotel2.jpg`,
    `http://o0.github.io/assets/images/tokyo/hotel3.jpg`
  ];

  const AD_ACCOMODATION_LOCATION_X_MIN = 0;
  const AD_ACCOMODATION_LOCATION_X_MAX = 1200;

  const AD_ACCOMODATION_LOCATION_Y_MIN = 130;
  const AD_ACCOMODATION_LOCATION_Y_MAX = 630;

  const mockAvatar = (index) => {
    const padIndex = String(index).padStart(INDEX_PAD_LENGTH, `0`);
    return `img/avatars/user${padIndex}.png`;
  };

  const mockAds = (length = MOCK_ELEMENTS_COUNT) => {
    const ads = new Map();

    for (let i = 1; i <= length; i++) {
      const locationX = window.util.getRandomInRange(AD_ACCOMODATION_LOCATION_X_MIN, AD_ACCOMODATION_LOCATION_X_MAX);
      const locationY = window.util.getRandomInRange(AD_ACCOMODATION_LOCATION_Y_MIN, AD_ACCOMODATION_LOCATION_Y_MAX);

      const ad = {
        author: {
          avatar: mockAvatar(i)
        },
        offer: {
          title: `Title number #${i}`,
          address: `${locationX}, ${locationY}`,
          price: window.util.getRandomInRange(AD_ACCOMODATION_PRICE_MIN, AD_ACCOMODATION_PRICE_MAX),
          type: window.util.getRandomItem(AD_ACCOMODATION_TYPES),
          rooms: window.util.getRandomInRange(AD_ACCOMODATION_ROOMS_MIN, AD_ACCOMODATION_ROOMS_MAX),
          guests: window.util.getRandomInRange(AD_ACCOMODATION_GUESTS_MIN, AD_ACCOMODATION_GUESTS_MAX),
          checkin: window.util.getRandomItem(AD_CHECKIN_TIMES),
          checkout: window.util.getRandomItem(AD_CHECKOUT_TIMES),
          features: window.util.getRandomItems(AD_ACCOMODATION_FEATURES),
          description: `Description number #${i}`,
          photos: window.util.getRandomItems(AD_ACCOMODATION_PHOTOS)
        },
        location: {
          x: locationX,
          y: locationY
        }
      };

      ads.set(i, ad);
    }
    return ads;
  };


  window.data = {
    mockAds
  };

})();

