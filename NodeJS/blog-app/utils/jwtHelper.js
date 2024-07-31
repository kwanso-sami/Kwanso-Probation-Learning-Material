const jwt = require("jsonwebtoken");
const {
  JWT_SECRET,
  JWT_PASSWORD_RESET_TOKEN_EXPIRE_TIME,
  JWT_REFRESH_TOKEN_EXPIRE_TIME,
  JWT_ACCESS_TOKEN_EXPIRE_TIME,
} = require("../config");
const { APIError } = require("./appError");
const { ERROR, STATUS_CODE } = require("./constants");

module.exports = {
  signAccessToken: async (tokenEntity) => {
    try {
      return jwt.sign(tokenEntity, JWT_SECRET, {
        expiresIn: JWT_ACCESS_TOKEN_EXPIRE_TIME,
      });
    } catch (e) {
      throw new APIError(
        "Failed to Sign Access Token",
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        ERROR.API_ERROR
      );
    }
  },

  signRefreshToken: async (tokenEntity) => {
    try {
      return jwt.sign(tokenEntity, JWT_SECRET, {
        expiresIn: JWT_REFRESH_TOKEN_EXPIRE_TIME,
      });
    } catch (e) {
      throw new APIError(
        "Failed to Sign Refresh Token",
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        ERROR.API_ERROR
      );
    }
  },

  signPasswordResetToken: async (tokenEntity) => {
    try {
      return jwt.sign(tokenEntity, JWT_SECRET, {
        expiresIn: JWT_PASSWORD_RESET_TOKEN_EXPIRE_TIME,
      });
    } catch (e) {
      throw new APIError(
        "Failed to Sign Password Reset Token",
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        ERROR.API_ERROR
      );
    }
  },

  verifyToken: async (token) => {
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
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        ERROR.API_ERROR
      );
    }
  },
};
