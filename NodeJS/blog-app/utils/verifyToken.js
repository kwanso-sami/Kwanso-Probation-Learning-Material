const jwt = require("jsonwebtoken");
const { APIError, STATUS_CODES } = require("./appError").default.default;
const { JWT_SECRET } = require("../../config");
module.exports = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET, (err, res) => {
      if (err) {
        return "expired";
      }
      return res;
    });
  } catch (e) {
    throw new APIError(
      "Failed to Verify Auth Token",
      STATUS_CODES.INTERNAL_SERVER_ERROR
    );
  }
};
