const { APIError, STATUS_CODES } = require("../utils/appError");
const { User } = require("../models");

class UserService {
  constructor() {
    this.UserModel = User;
  }

  async FindUser(userId) {
    try {
      const user = await this.UserModel.findByPk(userId, {
        attributes: { exclude: ['password', 'salt','createdAt','updatedAt'] }
      });
      if (!user) {
        throw new APIError("User Not Found", STATUS_CODES.NOT_FOUND);
      }
      return user;
    } catch (err) {
      throw new APIError(`USERS API ERROR : ${err.message}`, err.statusCode);
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
      throw new APIError(`USERS API ERROR : ${err.message}`, err.statusCode);
    }
  }
}
module.exports = UserService;
