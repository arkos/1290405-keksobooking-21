'use strict';

(() => {
  const ALLOWED_FILE_TYPES = [
    `gif`, `jpg`, `jpeg`, `png`
  ];

  const subscribe = (fileChooser, cb) => {
    const onFileChooserChange = () => {
      Array.from(fileChooser.files).forEach((file) => {
        const fileName = file.name.toLowerCase();

        const matches = ALLOWED_FILE_TYPES.some((extension) => fileName.endsWith(extension));

        if (matches) {
          const reader = new FileReader();

          const onReaderLoad = () => {
            cb(reader.result);
            reader.removeEventListener(`load`, onReaderLoad);
          };

          reader.addEventListener(`load`, onReaderLoad);
          reader.readAsDataURL(file);
        }
      });
    };

    fileChooser.addEventListener(`change`, onFileChooserChange);
  };


  window.preview = {
    subscribe
  };

})();
