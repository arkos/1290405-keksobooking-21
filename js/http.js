'use strict';

(() => {

  const XHR_ERROR_CODE_400 = `Неверный запрос`;
  const XHR_ERROR_CODE_401 = `Пользователь не авторизован`;
  const XHR_ERROR_CODE_404 = `Ничего не найдено`;
  const XHR_ERROR_GENERIC = `Произошла ошибка соединения`;

  const load = (url, onSuccess, onFailure) => {

    const onLoad = () => {
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

    const getDefaultResponse = () => `Статус ответа: ${xhr.status} ${xhr.statusText}`;

    const onError = () => XHR_ERROR_GENERIC;

    const onTimeout = () => {
      onFailure(`Запрос не успел выполниться за ${xhr.timeout} мс`);
    };

    const xhr = new XMLHttpRequest();
    xhr.responseType = `json`;
    xhr.addEventListener(`load`, onLoad);
    xhr.addEventListener(`error`, onError);
    xhr.addEventListener(`timeout`, () => onTimeout(xhr));

    xhr.open(`GET`, url);
    xhr.send();
  };

  window.http = {
    load
  };
})();
