const { APIError } = require("../utils/appError");
const { User } = require("../models");
const { STATUS_CODE, ERROR_TYPE,ERROR_MESSAGE } = require("../utils/constants");

class UserService {
  constructor() {
    this.UserModel = User;
  }

  async FindUser(userId) {
    try {
      const user = await this.UserModel.findByPk(userId);
      if (!user) {
        throw new APIError(
          ERROR_MESSAGE.USER_NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
          ERROR_TYPE.API_ERROR
        );
      }
      return user;
    } catch (err) {
      logger.error(`${ERROR_TYPE.API_ERROR}: ${err.message}`);
      throw new APIError(err.message, err.statusCode, ERROR_TYPE.API_ERROR);
    }
  }

  async UpdateUser(updateFields, userId) {
    try {
      const [updatedUser] = await this.UserModel.update(updateFields, {
        where: { id: userId },
        returning: true,
      });
      return updatedUser[0];
    } catch (err) {
      logger.error(`${ERROR_TYPE.API_ERROR}: ${err.message}`);
      throw new APIError(err.message, err.statusCode, ERROR_TYPE.API_ERROR);
    }
  }
}
module.exports = UserService;
