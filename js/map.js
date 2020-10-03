'use strict';

(() => {

  const map = document.querySelector(`.map`);

  const mapFiltersContainer = document.querySelector(`.map__filters-container`);
  const mapFilters = mapFiltersContainer.querySelector(`.map__filters`);

  const showMap = () => {
    map.classList.remove(`map--faded`);
  };

  const hideMap = () => {
    map.classList.add(`map--faded`);
  };

  const enableMapFilters = () => {
    for (const filter of mapFilters.children) {
      filter.disabled = false;
    }
  };

  const disableMapFilters = () => {
    for (const filter of mapFilters.children) {
      filter.disabled = true;
    }
  };

  window.map = {
    showMap,
    hideMap,
    enableMapFilters,
    disableMapFilters
  };
})();

