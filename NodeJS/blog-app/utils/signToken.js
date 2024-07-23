const jwt = require("jsonwebtoken");
const {
  JWT_SECRET,
  JWT_EXPIRE_TIME,
} = require("../config");
const { APIError, STATUS_CODES } = require("./appError");

exports.signToken = (tokenEntity) => {
  try {
    return jwt.sign(tokenEntity, JWT_SECRET, {
      expiresIn: JWT_EXPIRE_TIME,
    });
  } catch (e) {
    throw new APIError(
      "Failed to Sign Auth Token",
      STATUS_CODES.INTERNAL_SERVER_ERROR
    );
  }
};


