const { OTP } = require("../models");
const { APIError, STATUS_CODES } = require("../utils/appError");

class OtpRepository {
  constructor() {
    this.Model = OTP;
  }

  async CreateOTP(email, OTP) {
    try {
      const otp = await this.Model.create({
        email,
        OTP,
      });
      return otp;
    } catch (err) {
      throw new APIError("Unable to create OTP", STATUS_CODES.INTERNAL_ERROR);
    }
  }

  async FindOTP(OTP) {
    try {
      const otp = await this.Model.findOne({
        where: { OTP },
      });
      return otp;
    } catch (err) {
      console.log(err.message);
      throw new APIError("Unable to find OTP", STATUS_CODES.INTERNAL_ERROR);
    }
  }

  async GetOTPByEmail(email) {
    try {
      const otp = await this.Model.findOne({
        where: { email },
        order: [["createdAt", "DESC"]],
      });
      return otp;
    } catch (err) {
      throw new APIError("Unable to verify OTP", STATUS_CODES.INTERNAL_ERROR);
    }
  }
}

module.exports = OtpRepository;

