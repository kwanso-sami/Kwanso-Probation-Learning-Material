const { APIError } = require("../utils/appError");
const { User } = require("../models");
const { STATUS_CODE, ERROR } = require("../utils/constants");

class UserService {
  constructor() {
    this.UserModel = User;
  }

  async FindUser(userId) {
    try {
      const user = await this.UserModel.findByPk(userId);
      if (!user) {
        throw new APIError(
          "User Not Found",
          STATUS_CODE.NOT_FOUND,
          ERROR.API_ERROR
        );
      }
      return user;
    } catch (err) {
      throw new APIError(err.message, err.statusCode, ERROR.API_ERROR);
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
      throw new APIError(err.message, err.statusCode, ERROR.API_ERROR);
    }
  }
}
module.exports = UserService;
