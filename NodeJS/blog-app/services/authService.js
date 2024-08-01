const { CLIENT_URL } = require("../config");
const { User, OTP } = require("../models");
const { APIError} = require("../utils/appError");
const sendPasswordResetEmail = require("../utils/email/sendPasswordResetEmail");
const {
  signAccessToken,
  signRefreshToken,
  signPasswordResetToken,
  verifyToken,
} = require("../utils/jwtHelper");
const { STATUS_CODE, ERROR } = require("../utils/constants");
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
          "User Already Exists",
          STATUS_CODE.CONFLICT,
          ERROR.API_ERROR
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
      throw new APIError(err.message, err.statusCode, ERROR.API_ERROR);
    }
  }

  async SignUp({ firstName, lastName, email, password, OTP: inputOTP }) {
    try {
      const oldUser = await this.UserModel.findOne({
        where: { email },
      });

      if (oldUser) {
        throw new APIError(
          "User Already Exists",
          STATUS_CODE.CONFLICT,
          ERROR.API_ERROR
        );
      }

      const otp = await this.OtpModel.findOne({
        where: { email },
        order: [["createdAt", "DESC"]],
      });

      if (!otp) {
        throw new APIError(
          "OTP has been expired",
          STATUS_CODE.NOT_FOUND,
          ERROR.API_ERROR
        );
      }

      const { OTP: actualOTP } = otp;

      const isOTPVerified = await verifyOTP(actualOTP, inputOTP);

      if (!isOTPVerified) {
        throw new APIError(
          "OTP Verification Failed",
          STATUS_CODE.BAD_REQUEST,
          ERROR.API_ERROR
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
      throw new APIError(err.message, err.statusCode, ERROR.API_ERROR);
    }
  }

  async SignIn({ email, password: inputPassword }) {
    try {
      const user = await this.UserModel.findOne({
        where: { email },
      });

      if (!user) {
        throw new APIError(
          "User Not Found",
          STATUS_CODE.NOT_FOUND,
          ERROR.API_ERROR
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
          "Invalid Password",
          STATUS_CODE.NOT_FOUND,
          ERROR.API_ERROR
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
      throw new APIError(err.message, err.statusCode, ERROR.API_ERROR);
    }
  }

  async ForgotPassword(email) {
    try {
      const oldUser = await this.UserModel.findOne({
        where: { email },
      });

      if (!oldUser) {
        throw new APIError(
          "User Not Found.",
          STATUS_CODE.NOT_FOUND,
          ERROR.API_ERROR
        );
      }

      const { id: userId, email: userEmail } = oldUser;

      const resetToken = await signPasswordResetToken({ id: userId });

      const link = `${CLIENT_URL}/password-reset?access_token=${resetToken}`;

      const emailSent = await sendPasswordResetEmail(link, userEmail);
      if (!emailSent) {
        throw new APIError(
          "Failed to Send Password Reset Email",
          STATUS_CODE.INTERNAL_SERVER_ERROR,
          ERROR.API_ERROR
        );
      }
      return link;
    } catch (err) {
      throw new APIError(err.message, err.statusCode, ERROR.API_ERROR);
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
      throw new APIError(err.message, err.statusCode, ERROR.API_ERROR);
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
          "Invalid Old Password",
          STATUS_CODE.NOT_FOUND,
          ERROR.API_ERROR
        );
      }

      await this.ResetPassword(userId, newPassword);
    } catch (err) {
      throw new APIError(err.message, err.statusCode, ERROR.API_ERROR);
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
            "Invalid Refresh Token",
            STATUS_CODE.UNAUTHORIZED,
            ERROR.API_ERROR
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
          "Current Refresh Token Expired",
          STATUS_CODE.UNAUTHORIZED,
          ERROR.API_ERROR
        );
      }
    } catch (err) {
      throw new APIError(err.message, err.statusCode, ERROR.API_ERROR);
    }
  }
}

module.exports = AuthService;
