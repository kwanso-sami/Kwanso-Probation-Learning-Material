const bcrypt = require("bcryptjs");
const { APIError } = require("./appError");
const logger = require("./loggers/appLogger");
const { ERROR_TYPE, STATUS_CODE, ERROR_MESSAGE } = require("./constants");

module.exports = {
  generateEncryptedPassword: async (password) => {
    try {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const encryptedPassword = await bcrypt.hash(password, salt);
      return { encryptedPassword, salt };
    } catch (err) {
      logger.error(`${ERROR_TYPE.API_ERROR}: ${err.message}`);
      throw new APIError(
        ERROR_MESSAGE.GENERATE_PASSWORD_ERROR,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        ERROR_TYPE.API_ERROR
      );
    }
  },

  verifyHashedPassword: async (
    inputPassword,
    currentPasswordHash,
    currentPasswordSalt
  ) => {
    try {
      const inputPasswordHash = await bcrypt.hash(
        inputPassword,
        currentPasswordSalt
      );

      if (inputPasswordHash !== currentPasswordHash) {
        return false;
      }

      return true;
    } catch (err) {
      logger.error(`${ERROR_TYPE.API_ERROR}: ${err.message}`);
      throw new APIError(
        ERROR_MESSAGE.PASSWORD_VERIFICATION_ERROR,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        ERROR_TYPE.API_ERROR
      );
    }
  },
};
