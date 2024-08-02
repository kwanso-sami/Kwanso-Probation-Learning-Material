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
const { STATUS_CODE, ERROR_TYPE,ERROR_MESSAGE } = require("../constants");

module.exports = async function sendEmail(link, recipientEmail) {
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
      subject: "Password Reset",
      html: `
      <p>Hello,</p>
      <p>We received a request to reset your password. Click the button below to reset it.</p>
      <a href="${link}">
        <button style="padding: 10px 20px; background-color: #007BFF; color: #ffffff; border: none; border-radius: 5px; text-decoration: none; cursor: pointer; font-weight: bold; font-size: 16px; transition: background-color 0.3s;">
          Reset Password
        </button>
      </a>
      <p>If you did not request this password reset, please ignore this email. The link is valid for a limited time.</p>
      <p>Thank you.</p>
    `,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return false;
      } 
    });
    return true;
  } catch (e) {
    logger.error(`${ERROR_TYPE.API_ERROR}: ${e.message}`);
    throw new APIError(
      ERROR_MESSAGE.PASSWORD_RESET_EMAIL_ERROR,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      ERROR_TYPE.API_ERROR
    );
  }
};
