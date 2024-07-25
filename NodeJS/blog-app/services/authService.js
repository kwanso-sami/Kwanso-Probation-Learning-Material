const UserRepository = require("../repositories/userRepository");
const OtpRepository = require("../repositories/otpRepository");
const { CLIENT_URL } = require("../config");
const { APIError, STATUS_CODES } = require("../utils/appError");
const sendPasswordResetEmail = require("../utils/email/sendPasswordResetEmail");
const {
  signAccessToken,
  signRefreshToken,
  signPasswordResetToken,
  verifyToken,
} = require("../utils/jwtHelper");

const {
  generateEncryptedPassword,
  verifyHashedPassword,
} = require("../utils/bycryptHelper");

const { generateOTP, verifyOTP } = require("../utils/otpHelper");

class AuthService {
  constructor() {
    this.UserRepository = new UserRepository();
    this.OtpRepository = new OtpRepository();
  }

  async sendOTP({ email }) {
    try {
      const oldUser = await this.UserRepository.FindUserByEmail(email);
      if (oldUser) {
        throw new APIError("User Already Exists.", STATUS_CODES.CONFLICT);
      }
      let OTP = await generateOTP();
      let result = await this.OtpRepository.FindOTP(OTP);

      while (result) {
        OTP = await generateOTP();
        result = await this.OtpRepository.FindOTP(OTP);
      }
      await this.OtpRepository.CreateOTP(email, OTP);
      return OTP;
    } catch (err) {
      throw new APIError(`AUTH API ERROR : ${err.message}`);
    }
  }

  async SignUp({ name, email, password, OTP: inputOTP }) {
    try {
      const oldUser = await this.UserRepository.FindUserByEmail(email);
      if (oldUser) {
        throw new APIError("User Already Exists.", STATUS_CODES.CONFLICT);
      }

      const otp = await this.OtpRepository.GetOTPByEmail(email);

      if (!otp) {
        throw new APIError("OTP has been expired", STATUS_CODES.NOT_FOUND);
      }

      const { OTP: actualOTP } = otp;

      const isOTPVerified = await verifyOTP(actualOTP, inputOTP);

      if (!isOTPVerified) {
        throw new APIError(
          "OTP Verification Failed!",
          STATUS_CODES.BAD_REQUEST
        );
      }

      const { encryptedPassword, salt } = await generateEncryptedPassword(
        password
      );

      await this.UserRepository.CreateUser({
        name,
        email,
        password: encryptedPassword,
        salt,
      });
    } catch (err) {
      throw new APIError(`AUTH API ERROR : ${err.message}`, err.statusCode);
    }
  }

  async SignIn({ email, password: inputPassword }) {
    try {
      const user = await this.UserRepository.FindUserByEmail(email);

      if (!user) {
        throw new APIError("User Not Found", STATUS_CODES.NOT_FOUND);
      }

      const { password: currentPasswordHash, salt: currentPasswordSalt } = user;

      const isPasswordVerified = await verifyHashedPassword(
        inputPassword,
        currentPasswordHash,
        currentPasswordSalt
      );

      if (!isPasswordVerified) {
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
      const { encryptedPassword, salt } = await generateEncryptedPassword(
        newPassword
      );

      await this.UserRepository.UpdateUser(
        { password: encryptedPassword, salt },
        userId
      );
    } catch (err) {
      throw new APIError(`AUTH API ERROR : ${err.message}`, err.statusCode);
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
        throw new APIError("Invalid Old Password", STATUS_CODES.NOT_FOUND);
      }
      await this.ResetPassword(userId, newPassword);
    } catch (err) {
      throw new APIError(`USERS API ERROR : ${err.message}`, err.statusCode);
    }
  }

  async GenerateNewToken({ currentRefreshToken }) {
    try {
      const tokenPayload = await verifyToken(currentRefreshToken);

      if (tokenPayload) {
        const { id: userId } = tokenPayload;

        const user = await this.UserRepository.FindUserById(userId);

        if (!user) {
          throw new APIError(
            "Invalid Refresh Token",
            STATUS_CODES.UNAUTHORIZED
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
          STATUS_CODES.UNAUTHORIZED
        );
      }
    } catch (err) {
      throw new APIError(`USERS API ERROR : ${err.message}`, err.statusCode);
    }
  }
}

module.exports = AuthService;
