exports.success = (response) => {
  return {
    status: "success",
    ...response,
  };
};

exports.error = (status, message) => {
  return {
    status,
    message,
  };
};
