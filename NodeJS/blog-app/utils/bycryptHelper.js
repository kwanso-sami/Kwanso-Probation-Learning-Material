const bcrypt = require("bcryptjs");
const { APIError, STATUS_CODES } = require("./appError");

module.exports = {
  generateEncryptedPassword: async (password) => {
    try {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const encryptedPassword = await bcrypt.hash(password, salt);
      return { encryptedPassword, salt };
    } catch (e) {
      throw new APIError(
        "Failed to Generate Encrypted Password",
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  },

  verifyHashedPassword: async (
    inputPassword,
    currentPasswordHash,
    currentPasswordSalt
  ) => {
    const inputPasswordHash = await bcrypt.hash(
      inputPassword,
      currentPasswordSalt
    );

    if (inputPasswordHash !== currentPasswordHash) {
      return false;
    }

    return true;
  },
};
