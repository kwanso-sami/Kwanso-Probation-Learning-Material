const Joi = require("joi");

const updateUserSchema = Joi.object().keys({
  firstName: Joi.string()
    .max(255)
    .trim(),
  lastName: Joi.string()
    .max(255)
    .trim(),
  profileImage: Joi.string().base64(),
  profileThumbnail: Joi.string().base64(),
});

const getUserSchema = Joi.object().keys({
  userId: Joi.string().trim().required(),
});

module.exports = {
  updateUserSchema,
  getUserSchema,
};
