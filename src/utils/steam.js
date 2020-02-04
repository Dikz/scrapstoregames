const axios = require("axios");

module.exports = axios.create({
  baseURL: "https://store.steampowered.com/search/"
});
