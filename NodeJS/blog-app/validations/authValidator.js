const Joi = require("joi");

const signupSchema = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(4)
    .required(),
  OTP: Joi.number()
    .integer()
    .required(),
});

const loginSchema = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const updateUserSchema = Joi.object().keys({
  name: Joi.string().required(),
});

const forgotPasswordSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required(),
});

const resetPasswordSchema = Joi.object().keys({
  password: Joi.string()
    .min(4)
    .required(),
});

const changePasswordSchema = Joi.object().keys({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
});

const refreshTokenSchema = Joi.object().keys({
  refreshToken: Joi.string().required(),
});

const otpSchema = Joi.object().keys({
  email: Joi.string()
    .email()
    .required(),
});

module.exports = {
  signupSchema,
  loginSchema,
  updateUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  refreshTokenSchema,
  otpSchema,
};
