const {SUCCESS_MESSAGE} = require("./constants");

exports.success = (response) => {
  return {
    status: SUCCESS_MESSAGE.DEFAULT,
    ...response,
  };
};

exports.error = (status, message) => {
  return {
    status,
    message,
  };
};
