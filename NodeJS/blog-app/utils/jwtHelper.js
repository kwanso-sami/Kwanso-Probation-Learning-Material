const jwt = require("jsonwebtoken");
const {
  JWT_SECRET,
  JWT_PASSWORD_RESET_TOKEN_EXPIRE_TIME,
  JWT_REFRESH_TOKEN_EXPIRE_TIME,
  JWT_ACCESS_TOKEN_EXPIRE_TIME,
} = require("../config");
const { APIError } = require("./appError");
const logger = require("./loggers/appLogger");
const { ERROR_TYPE, STATUS_CODE, ERROR_MESSAGE } = require("./constants");

module.exports = {
  signAccessToken: async (tokenEntity) => {
    try {
      return jwt.sign(tokenEntity, JWT_SECRET, {
        expiresIn: JWT_ACCESS_TOKEN_EXPIRE_TIME,
      });
    } catch (e) {
      logger.error(`${ERROR_TYPE.API_ERROR}: ${e.message}`);
      throw new APIError(
        ERROR_MESSAGE.ACCESS_TOKEN_SIGN_ERROR,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        ERROR_TYPE.API_ERROR
      );
    }
  },

  signRefreshToken: async (tokenEntity) => {
    try {
      return jwt.sign(tokenEntity, JWT_SECRET, {
        expiresIn: JWT_REFRESH_TOKEN_EXPIRE_TIME,
      });
    } catch (e) {
      logger.error(`${ERROR_TYPE.API_ERROR}: ${e.message}`);
      throw new APIError(
        ERROR_MESSAGE.REFRESH_TOKEN_SIGN_ERROR,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        ERROR_TYPE.API_ERROR
      );
    }
  },

  signPasswordResetToken: async (tokenEntity) => {
    try {
      return jwt.sign(tokenEntity, JWT_SECRET, {
        expiresIn: JWT_PASSWORD_RESET_TOKEN_EXPIRE_TIME,
      });
    } catch (e) {
      logger.error(`${ERROR_TYPE.API_ERROR}: ${e.message}`);
      throw new APIError(
        ERROR_MESSAGE.PASSWORD_RESET_TOKEN_SIGN_ERROR,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        ERROR_TYPE.API_ERROR
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
      logger.error(`${ERROR_TYPE.API_ERROR}: ${e.message}`);
      throw new APIError(
        ERROR_MESSAGE.TOKEN_VERIFICATION_ERROR,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        ERROR_TYPE.API_ERROR
      );
    }
  },
};
