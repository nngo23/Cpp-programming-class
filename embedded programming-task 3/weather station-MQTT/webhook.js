const axios = require("axios");

function dispatchWebhook(url, message) {
  return axios.post(url, message)
    .catch(err => console.log("Webhook error:", err.message));
}

module.exports = dispatchWebhook