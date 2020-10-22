'use strict';

(() => {
  const ALLOWED_FILE_TYPES = [
    `gif`, `jpg`, `jpeg`, `png`
  ];

  const subscribeToReaderLoad = (fileChooser, onReaderLoad) => {
    fileChooser.addEventListener(`change`, onFileChooserChange);


    const onFileChooserChange = () => {
      const file = fileChooser.files[0];
      const fileName = file.name.toLowerCase();

      const matches = ALLOWED_FILE_TYPES.some((extension) => fileName.endsWith(extension));

      if (matches) {
        const reader = new FileReader();
        reader.addEventListener(`load`, () => {
          onReaderLoad(reader.result);
        });

        reader.readAsDataURL(file);
      }
    };
  };


  window.preview = {
    subscribeToReaderLoad
  };
})();
