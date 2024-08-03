const { CLIENT_URL } = require("../config");
const { User, OTP } = require("../models");
const { APIError } = require("../utils/appError");
const logger = require("../utils/loggers/appLogger");
const sendPasswordResetEmail = require("../utils/email/sendPasswordResetEmail");
const {
  signAccessToken,
  signRefreshToken,
  signPasswordResetToken,
  verifyToken,
} = require("../utils/jwtHelper");
const {
  STATUS_CODE,
  ERROR_TYPE,
  ERROR_MESSAGE,
  ORDER,SORT
} = require("../utils/constants");
const {
  generateEncryptedPassword,
  verifyHashedPassword,
} = require("../utils/bycryptHelper");

const { generateOTP, verifyOTP } = require("../utils/otpHelper");

class AuthService {
  constructor() {
    this.UserModel = User;
    this.OtpModel = OTP;
  }

  async sendOTP(email) {
    try {
      const oldUser = await this.UserModel.findOne({
        where: { email },
      });

      if (oldUser) {
        throw new APIError(
          ERROR_MESSAGE.USER_ALREADY_EXIST,
          STATUS_CODE.CONFLICT,
          ERROR_TYPE.API_ERROR
        );
      }

      let OTP = await generateOTP();

      const existingOTP = await this.OtpModel.findOne({
        where: { OTP },
      });

      while (existingOTP) {
        OTP = await generateOTP();
        existingOTP = await this.OtpModel.findOne({
          where: { OTP },
        });
      }

      await this.OtpModel.create({
        email,
        OTP,
      });

      return OTP;
    } catch (err) {
      logger.error(`${ERROR_TYPE.API_ERROR}: ${err.message}`);
      throw new APIError(err.message, err.statusCode, ERROR_TYPE.API_ERROR);
    }
  }

  async SignUp({ firstName, lastName, email, password, OTP: inputOTP }) {
    try {
      const oldUser = await this.UserModel.findOne({
        where: { email },
      });

      if (oldUser) {
        throw new APIError(
          ERROR_MESSAGE.USER_ALREADY_EXIST,
          STATUS_CODE.CONFLICT,
          ERROR_TYPE.API_ERROR
        );
      }

      const otp = await this.OtpModel.findOne({
        where: { email },
        order: [[SORT.CREATED_AT, ORDER.DESC]],
      });

      if (!otp) {
        throw new APIError(
          ERROR_MESSAGE.OTP_EXPIRED,
          STATUS_CODE.NOT_FOUND,
          ERROR_TYPE.API_ERROR
        );
      }

      const { OTP: actualOTP } = otp;

      const isOTPVerified = await verifyOTP(actualOTP, inputOTP);

      if (!isOTPVerified) {
        throw new APIError(
          ERROR_MESSAGE.OTP_VERIFICATION_FAILED,
          STATUS_CODE.BAD_REQUEST,
          ERROR_TYPE.API_ERROR
        );
      }

      const { encryptedPassword, salt } = await generateEncryptedPassword(
        password
      );

      await this.UserModel.create({
        firstName,
        lastName,
        email,
        password: encryptedPassword,
        salt,
      });
    } catch (err) {
      logger.error(`${ERROR_TYPE.API_ERROR}: ${err.message}`);
      throw new APIError(err.message, err.statusCode, ERROR_TYPE.API_ERROR);
    }
  }

  async SignIn({ email, password: inputPassword }) {
    try {
      const user = await this.UserModel.findOne({
        where: { email },
      });

      if (!user) {
        throw new APIError(
          ERROR_MESSAGE.USER_NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
          ERROR_TYPE.API_ERROR
        );
      }

      const { password: currentPasswordHash, salt: currentPasswordSalt } = user;

      const isPasswordVerified = await verifyHashedPassword(
        inputPassword,
        currentPasswordHash,
        currentPasswordSalt
      );

      if (!isPasswordVerified) {
        throw new APIError(
          ERROR_MESSAGE.INVALID_PASSWORD,
          STATUS_CODE.NOT_FOUND,
          ERROR_TYPE.API_ERROR
        );
      }

      const accessToken = await signAccessToken({ id: user.id });
      const refreshToken = await signRefreshToken({ id: user.id });
      return {
        accessToken,
        refreshToken,
        user,
      };
    } catch (err) {
      logger.error(`${ERROR_TYPE.API_ERROR}: ${err.message}`);
      throw new APIError(err.message, err.statusCode, ERROR_TYPE.API_ERROR);
    }
  }

  async ForgotPassword(email) {
    try {
      const oldUser = await this.UserModel.findOne({
        where: { email },
      });

      if (!oldUser) {
        throw new APIError(
          ERROR_MESSAGE.USER_NOT_FOUND,
          STATUS_CODE.NOT_FOUND,
          ERROR_TYPE.API_ERROR
        );
      }

      const { id: userId, email: userEmail } = oldUser;

      const resetToken = await signPasswordResetToken({ id: userId });

      const link = `${CLIENT_URL}/password-reset?access_token=${resetToken}`;

      const emailSent = await sendPasswordResetEmail(link, userEmail);
      if (!emailSent) {
        throw new APIError(
          ERROR_MESSAGE.PASSWORD_RESET_EMAIL_ERROR,
          STATUS_CODE.INTERNAL_SERVER_ERROR,
          ERROR_TYPE.API_ERROR
        );
      }
      return link;
    } catch (err) {
      logger.error(`${ERROR_TYPE.API_ERROR}: ${err.message}`);
      throw new APIError(err.message, err.statusCode, ERROR_TYPE.API_ERROR);
    }
  }

  async ResetPassword(userId, newPassword) {
    try {
      const { encryptedPassword, salt } = await generateEncryptedPassword(
        newPassword
      );

      await this.UserModel.update(
        { password: encryptedPassword, salt },
        {
          where: { id: userId },
          returning: true,
        }
      );
    } catch (err) {
      logger.error(`${ERROR_TYPE.API_ERROR}: ${err.message}`);
      throw new APIError(err.message, err.statusCode, ERROR_TYPE.API_ERROR);
    }
  }

  async ChangeCurrentPassword(user, oldPassword, newPassword) {
    try {
      const {
        id: userId,
        password: currentPasswordHash,
        salt: currentPasswordSalt,
      } = user;

      const isOldPasswordVerified = await verifyHashedPassword(
        oldPassword,
        currentPasswordHash,
        currentPasswordSalt
      );

      if (!isOldPasswordVerified) {
        throw new APIError(
          ERROR_MESSAGE.INVALID_OLD_PASSWORD,
          STATUS_CODE.NOT_FOUND,
          ERROR_TYPE.API_ERROR
        );
      }

      await this.ResetPassword(userId, newPassword);
    } catch (err) {
      logger.error(`${ERROR_TYPE.API_ERROR}: ${err.message}`);
      throw new APIError(err.message, err.statusCode, ERROR_TYPE.API_ERROR);
    }
  }

  async GenerateNewToken({ currentRefreshToken }) {
    try {
      const tokenPayload = await verifyToken(currentRefreshToken);

      if (tokenPayload) {
        const userId = tokenPayload.id;

        const user = await this.UserModel.findByPk(userId);

        if (!user) {
          throw new APIError(
            ERROR_MESSAGE.INVALID_REFRESH_TOKEN,
            STATUS_CODE.UNAUTHORIZED,
            ERROR_TYPE.API_ERROR
          );
        }

        const newAccessToken = await signAccessToken({ id: user.id });
        const newRefreshToken = await signRefreshToken({ id: user.id });

        return {
          newAccessToken,
          newRefreshToken,
        };
      } else {
        throw new APIError(
          ERROR_MESSAGE.REFRESH_TOKEN_EXPIRED,
          STATUS_CODE.UNAUTHORIZED,
          ERROR_TYPE.API_ERROR
        );
      }
    } catch (err) {
      logger.error(`${ERROR_TYPE.API_ERROR}: ${err.message}`);
      throw new APIError(err.message, err.statusCode, ERROR_TYPE.API_ERROR);
    }
  }
}

module.exports = AuthService;
