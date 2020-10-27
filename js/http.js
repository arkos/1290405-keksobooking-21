'use strict';

const XHR_ERROR_CODE_400 = `Неверный запрос`;
const XHR_ERROR_CODE_401 = `Пользователь не авторизован`;
const XHR_ERROR_CODE_404 = `Ничего не найдено`;
const XHR_ERROR_GENERIC = `Произошла ошибка соединения`;

const StatusCode = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404
};

const load = (url, onSuccess, onFailure) => {

  const onLoad = () => {
    let error;

    switch (xhr.status) {
      case StatusCode.OK:
        onSuccess(xhr.response);
        break;
      case StatusCode.BAD_REQUEST:
        error = XHR_ERROR_CODE_400;
        break;
      case StatusCode.UNAUTHORIZED:
        error = XHR_ERROR_CODE_401;
        break;
      case StatusCode.NOT_FOUND:
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

  const onError = () => onFailure(XHR_ERROR_GENERIC);

  const onTimeout = () => {
    onFailure(`Запрос не успел выполниться за ${xhr.timeout} мс`);
  };

  const xhr = new XMLHttpRequest();
  xhr.responseType = `json`;
  xhr.timeout = 1;
  xhr.addEventListener(`load`, onLoad);
  xhr.addEventListener(`error`, onError);
  xhr.addEventListener(`timeout`, () => onTimeout(xhr));

  xhr.open(`GET`, url);
  xhr.send();
};

const upload = (url, data, onSuccess, onFailure) => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = `json`;
  xhr.addEventListener(`load`, () => {
    onSuccess(xhr.response);
  });

  xhr.addEventListener(`error`, () => {
    onFailure();
  });

  xhr.addEventListener(`timeout`, () => {
    onFailure();
  });

  xhr.open(`POST`, url);
  xhr.send(data);
};

window.http = {
  load,
  upload
};
