const Joi = require("joi");

const signupSchema = Joi.object().keys({
  firstName: Joi.string()
    .max(255)
    .trim()
    .required(),
  lastName: Joi.string()
    .max(255)
    .trim()
    .required(),
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(4)
    .trim()
    .required(),
  OTP: Joi.number()
    .integer()
    .required(),
});

const loginSchema = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string()
    .min(4)
    .trim()
    .required(),
});

const forgotPasswordSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required(),
});

const resetPasswordSchema = Joi.object().keys({
  newPassword: Joi.string()
    .min(4)
    .trim()
    .required(),
});

const changePasswordSchema = Joi.object().keys({
  oldPassword: Joi.string()
    .min(4)
    .trim()
    .required(),
  newPassword: Joi.string()
    .min(4)
    .trim()
    .required(),
});

const refreshTokenSchema = Joi.object().keys({
  refreshToken: Joi.string()
    .trim()
    .required(),
});

const otpSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required(),
});

module.exports = {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  refreshTokenSchema,
  otpSchema,
};
