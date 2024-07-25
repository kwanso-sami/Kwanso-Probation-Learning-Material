const { APIError, STATUS_CODES } = require("./appError");
const { OTP_LENGTH, CLIENT_URL } = require("../config");
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
      throw new APIError(
        "Failed to Generate OTP",
        STATUS_CODES.INTERNAL_SERVER_ERROR
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
      throw new APIError(
        "Failed to Verify OTP",
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  },
};
