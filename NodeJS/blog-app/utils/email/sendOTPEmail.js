const nodemailer = require("nodemailer");
const logger = require("../loggers/appLogger");
const { APIError } = require("../appError");
const {
  EMAIL_USER,
  EMAIL_PASSWORD,
  EMAIL_HOST,
  EMAIL_SERVICE,
  EMAIL_PORT,
} = require("../../config");
const { STATUS_CODE, ERROR } = require("../constants");

module.exports = async function sendEmail(recipientEmail, OTP) {
  try {
    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      service: EMAIL_SERVICE,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: "noreply@gmail.com",
      to: recipientEmail,
      subject: "OTP Verification Code",
      html: `
    <p style="font-size: 16px; margin-bottom: 20px;">To complete the verification process and ensure the security of your account, please use the following One-Time Password (OTP) code:</p>
    <p style="font-size: 20px; margin-bottom: 20px; ">OTP Code: ${OTP}</p>
    <p style="font-size: 16px; margin-bottom: 20px;">The OTP is valid for a limited time.</p>
    <p style="font-size: 16px; margin-bottom: 20px;">Thank you</p>
    `,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        logger.error(
          `Error occurred while sending OTP email: ${error.message}`
        );
        return false;
      } else {
        logger.info(`OTP Email sent successfully to ${recipientEmail}`);
      }
    });
    return true;
  } catch (e) {
    throw new APIError(
      "Failed to Send OTP Email to User",
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      ERROR.API_ERROR
    );
  }
};
