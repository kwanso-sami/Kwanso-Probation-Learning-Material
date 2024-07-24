const jwt = require("jsonwebtoken");
const {
  JWT_SECRET,
  JWT_PASSWORD_RESET_TOKEN_EXPIRE_TIME,
  JWT_REFRESH_TOKEN_EXPIRE_TIME,
  JWT_ACCESS_TOKEN_EXPIRE_TIME,
} = require("../config");
const { APIError, STATUS_CODES } = require("./appError");

module.exports = {
  signAccessToken: (tokenEntity) => {
    try {
      return jwt.sign(tokenEntity, JWT_SECRET, {
        expiresIn: JWT_ACCESS_TOKEN_EXPIRE_TIME,
      });
    } catch (e) {
      throw new APIError(
        "Failed to Sign Access Token",
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  },

  signRefreshToken: (tokenEntity) => {
    try {
      return jwt.sign(tokenEntity, JWT_SECRET, {
        expiresIn: JWT_REFRESH_TOKEN_EXPIRE_TIME,
      });
    } catch (e) {
      throw new APIError(
        "Failed to Sign Refresh Token",
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  },

  signPasswordResetToken: (tokenEntity) => {
    try {
      return jwt.sign(tokenEntity, JWT_SECRET, {
        expiresIn: JWT_PASSWORD_RESET_TOKEN_EXPIRE_TIME,
      });
    } catch (e) {
      throw new APIError(
        "Failed to Sign Password Reset Token",
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  },

  verifyToken: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET, (err, res) => {
        if (err) {
          return null;
        }
        return res;
      });
    } catch (e) {
      throw new APIError(
        "Failed to Verify Token",
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  },
};
