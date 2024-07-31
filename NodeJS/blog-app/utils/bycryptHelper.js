const bcrypt = require("bcryptjs");
const { APIError } = require("./appError");
const { ERROR, STATUS_CODE } = require("./constants");

module.exports = {
  generateEncryptedPassword: async (password) => {
    try {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const encryptedPassword = await bcrypt.hash(password, salt);
      return { encryptedPassword, salt };
    } catch (err) {
      throw new APIError(
        "Failed to Generate Encrypted Password",
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        ERROR.API_ERROR
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
      throw new APIError(
        "Failed to verify password",
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        ERROR.API_ERROR
      );
    }
  },
};
