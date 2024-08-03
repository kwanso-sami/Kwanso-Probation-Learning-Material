const { APIError } = require("./appError");
const { OTP_LENGTH } = require("../config");
const { ERROR_TYPE, STATUS_CODE, ERROR_MESSAGE } = require("./constants");
const logger = require("./loggers/appLogger");
const otpGenerator = require("otp-generator");

module.exports = {
  generateOTP: async () => {
    try {
      return otpGenerator.generate(OTP_LENGTH, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
    } catch (e) {
      logger.error(`${ERROR_TYPE.API_ERROR}: ${e.message}`);
      throw new APIError(
        ERROR_MESSAGE.OTP_CREATION_ERROR,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        ERROR_TYPE.API_ERROR
      );
    }
  },

  verifyOTP: async (actualOTP, inputOTP) => {
    try {
      if (actualOTP.length === 0 || inputOTP !== actualOTP) {
        return false;
      }

      return true;
    } catch (e) {
      logger.error(`${ERROR_TYPE.API_ERROR}: ${e.message}`);
      throw new APIError(
        ERROR_MESSAGE.OTP_VERIFICATION_FAILED,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        ERROR_TYPE.API_ERROR
      );
    }
  },
};
