const path = require("path");

module.exports = {
  entry: [
    "./js/util.js",
    "./js/decorator.js",
    "./js/http.js",
    "./js/preview.js",
    "./js/pin.js",
    "./js/card.js",
    "./js/map.js",
    "./js/form.js",
    "./js/main.js",
  ],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname),
    iife: true
  },
  devtool: false
};
