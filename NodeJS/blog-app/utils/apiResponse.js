exports.success = (message, data) => {
  const res = {
    status: "success",
    message,
  };

  if (data) {
    res.response = data;
  }

  return res;
};

exports.error = (status, message) => {
  return {
    status,
    message,
  };
};
