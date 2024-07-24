const Joi = require("joi");

const signupSchema = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(8)
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
    .min(8)
    .required(),
});

module.exports = {
  signupSchema,
  loginSchema,
  updateUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
