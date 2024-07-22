const bcrypt = require("bcryptjs");
const logger = require("./loggers/appLogger");
module.exports = async () => {
  try{
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  return salt;
  }
  catch(e){
    throw new APIError("Failed to generate salt", STATUS_CODES.INTERNAL_SERVER_ERROR);
  }
};
