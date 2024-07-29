const { User } = require("../models");
const { APIError, STATUS_CODES } = require("../utils/appError");

class UserRepository {
  constructor() {
    this.Model = User;
  }

  async CreateUser(newUser) {
    try {
      const user = await this.Model.create(newUser);
      return user;
    } catch (err) {
      throw new APIError("Unable to Create User", STATUS_CODES.INTERNAL_ERROR);
    }
  }

  async FindUserByEmail(email) {
    try {
      const user = await this.Model.findOne({
        where: { email },
      });
      return user;
    } catch (err) {
      console.log(err.message);
      throw new APIError("Unable to Find User", STATUS_CODES.INTERNAL_ERROR);
    }
  }

  async FindUserById(id) {
    try {
      const user = await this.Model.findOne({
        where: { id },
      });
      return user;
    } catch (err) {
      throw new APIError("Unable to Find User", STATUS_CODES.INTERNAL_ERROR);
    }
  }

  async UpdateUser(toUpdate, userId) {
    try {
      const [updatedUser] = await this.Model.update(toUpdate, {
        where: { id: userId },
        returning: true,
      });
      return updatedUser[0];
    } catch (err) {
      throw new APIError("Unable to Update User", STATUS_CODES.INTERNAL_ERROR);
    }
  }
}

module.exports = UserRepository;
