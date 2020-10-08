'use strict';

(() => {

  const XHR_SOURCE_DATA_URL = `https://21.javascript.pages.academy/keksobooking/data`;
  const XHR_ERROR_CODE_400 = `Неверный запрос`;
  const XHR_ERROR_CODE_401 = `Пользователь не авторизован`;
  const XHR_ERROR_CODE_404 = `Ничего не найдено`;
  const XHR_ERROR_GENERIC = `Произошла ошибка соединения`;


  const load = () => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = `json`;
    xhr.addEventListener(`load`, () => onLoad(xhr));
    xhr.addEventListener(`error`, onError);
    xhr.addEventListener(`load`, () => onTimeout(xhr));

    xhr.open(`GET`, XHR_SOURCE_DATA_URL);
    xhr.send();
  };

  const onLoad = (xhr) => {
    let error;

    switch (xhr.status) {
      case 200:
        onSuccess(xhr.response);
        break;
      case 400:
        error = XHR_ERROR_CODE_400;
        break;
      case 401:
        error = XHR_ERROR_CODE_401;
        break;
      case 404:
        error = XHR_ERROR_CODE_404;
        break;
      default:
        getDefaultResponse(xhr);
    }

    if (error) {
      onFailure(error);
    }
  };

  const getDefaultResponse = (xhr) => `Статус ответа: ${xhr.status} ${xhr.statusText}`;

  const onSuccess = (data) => data;

  const onFailure = (message) => message;

  const onError = () => XHR_ERROR_GENERIC;

  const onTimeout = (xhr) => {
    onFailure(`Запрос не успел выполниться за ${xhr.timeout} мс`);
  };

  window.http = {
    load
  };

  load();

})();
