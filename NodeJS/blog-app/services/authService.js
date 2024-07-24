const UserRepository = require("../repositories/userRepository");
const SaltRepository = require("../repositories/saltRepository");
const { CLIENT_URL } = require("../config");
const { APIError, STATUS_CODES } = require("../utils/appError");
const sendPasswordResetEmail = require("../utils/email/sendPasswordResetEmail");
const {
  signAccessToken,
  signRefreshToken,
  signPasswordResetToken,
} = require("../utils/jwtHelper");

const genSalt = require("../utils/generateSalt");
const bcrypt = require("bcryptjs");

class AuthService {
  constructor() {
    this.UserRepository = new UserRepository();
    this.SaltRepository = new SaltRepository();
  }

  async SignUp({ name, email, password }) {
    try {
      const oldUser = await this.UserRepository.FindUserByEmail(email);
      if (oldUser) {
        throw new APIError("User Already Exists.", STATUS_CODES.NOT_FOUND);
      }
      const salt = await genSalt();
      const encryptedPassword = await bcrypt.hash(password, salt);

      const user = await this.UserRepository.CreateUser({
        name,
        email,
        password: encryptedPassword,
      });

      await this.SaltRepository.CreateSalt({
        userId: user.id,
        salt: salt,
      });

      const accessToken = await signAccessToken({ id: user.id });
      const refreshToken = await signRefreshToken({ id: user.id });
      return { accessToken, refreshToken };
    } catch (err) {
      throw new APIError(`AUTH API ERROR : ${err.message}`, err.statusCode);
    }
  }

  async SignIn({ email, password }) {
    try {
      const user = await this.UserRepository.FindUserByEmail(email);

      if (!user) {
        throw new APIError("User Not Found", STATUS_CODES.NOT_FOUND);
      }

      const { salt } = await this.SaltRepository.FindSaltByUserId(user.id);
      if (!salt) {
        throw new APIError("Salt Not Found", STATUS_CODES.NOT_FOUND);
      }

      const inputPasswordHash = await bcrypt.hash(password, salt);

      const { password: currentPasswordHash } = user;

      if (inputPasswordHash !== currentPasswordHash) {
        throw new APIError("Invalid Password", STATUS_CODES.NOT_FOUND);
      }

      const accessToken = await signAccessToken({ id: user.id });
      const refreshToken = await signRefreshToken({ id: user.id });
      return {
        accessToken,
        refreshToken,
        name: user.name,
        email: user.email,
        id: user.id,
      };
    } catch (err) {
      throw new APIError(`AUTH API ERROR : ${err.message}`, err.statusCode);
    }
  }

  async ForgotPassword(email) {
    try {
      const oldUser = await this.UserRepository.FindUserByEmail(email);
      if (!oldUser) {
        throw new APIError("User Not Exists.", STATUS_CODES.NOT_FOUND);
      }
      const { id: userId, email: userEmail } = oldUser;
      const resetToken = await signPasswordResetToken({ id: userId });

      const link = `${CLIENT_URL}/password-reset?token=${resetToken}`;

      const emailSent = await sendPasswordResetEmail(link, userEmail);
      if (!emailSent) {
        throw new APIError(
          "Unable to Send Password Reset Email",
          STATUS_CODES.INTERNAL_SERVER_ERROR
        );
      }
      return link;
    } catch (err) {
      throw new APIError(`AUTH API ERROR : ${err.message}`, err.statusCode);
    }
  }

  async ResetPassword(userId, newPassword) {
    try {
      const salt = await genSalt();
      const encryptedPassword = await bcrypt.hash(newPassword, salt);

      await this.UserRepository.UpdateUser(
        { password: encryptedPassword },
        userId
      );

      await this.SaltRepository.UpdateSalt(userId, salt);
    } catch (err) {
      throw new APIError(`AUTH API ERROR : ${err.message}`, err.statusCode);
    }
  }

  async ChangeCurrentPassword(user, oldPassword, newPassword) {
    try {
      const { id: userId, password: currentPasswordHash } = user;

      const { salt } = await this.SaltRepository.FindSaltByUserId(userId);
      if (!salt) {
        throw new APIError("Salt Not Found", STATUS_CODES.NOT_FOUND);
      }

      const oldPasswordHash = await bcrypt.hash(oldPassword, salt);
      if (oldPasswordHash !== currentPasswordHash) {
        throw new APIError("Invalid Old Password", STATUS_CODES.BAD_REQUEST);
      }
      await this.ResetPassword(userId, newPassword);
    } catch (err) {
      throw new APIError(`USERS API ERROR : ${err.message}`, err.statusCode);
    }
  }
}

module.exports = AuthService;
