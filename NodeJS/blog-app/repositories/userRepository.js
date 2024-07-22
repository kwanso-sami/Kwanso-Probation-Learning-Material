const User = require("../models/userModel");
const Salt = require("../models/saltModel");
const {
  APIError,
  STATUS_CODES,
} = require("../utils/appError").default.default;

class UserRepository {
  constructor() {
    this.UserModel = User;
    this.SaltModel = Salt;
  }
  async CreateUser({ name, email, password }) {
    try {
      const user = await this.UserModel.create({
        name,
        email,
        password,
      });
      return user;
    } catch (err) {
      throw new APIError("Unable to Create User", STATUS_CODES.INTERNAL_ERROR);
    }
  }
  async CreateSalt({ userId, salt }) {
    try {
      const Salt = await this.SaltModel.create({
        userId,
        salt,
      });
      return Salt;
    } catch (err) {
      throw new APIError(
        "Unable to Create Password Salt",
        STATUS_CODES.INTERNAL_ERROR
      );
    }
  }

  async FindUser(email) {
    try {
      const user = await this.UserModel.findOne({
        email,
      }).lean();
      return user;
    } catch (err) {
      throw new APIError("Unable to Find User", STATUS_CODES.INTERNAL_ERROR);
    }
  }
  async FindSalt(userId) {
    try {
      const salt = await this.SaltModel.findOne({
        userId,
      }).lean();
      return salt;
    } catch (err) {
      throw new APIError(
        "Unable to Find Password Salt",
        STATUS_CODES.INTERNAL_ERROR
      );
    }
  }

  async FindUserById(_id) {
    try {
      const user = await this.UserModel.findById({
        _id,
      }).lean();
      return user;
    } catch (err) {
      throw new APIError("Unable to Find User", STATUS_CODES.INTERNAL_ERROR);
    }
  }

  async UpdateUser(toUpdate, userId) {
    try {
      const user = await this.UserModel.findByIdAndUpdate(
        { _id: userId },
        toUpdate,
        {
          new: true,
          runValidators: true,
        }
      );
      return user;
    } catch (err) {
      throw new APIError("Unable to Update User", STATUS_CODES.INTERNAL_ERROR);
    }
  }
}

module.exports = UserRepository;
