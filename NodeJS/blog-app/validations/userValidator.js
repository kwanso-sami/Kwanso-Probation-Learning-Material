const Joi = require("joi");

const updateUserSchema = Joi.object().keys({
  firstName: Joi.string()
    .max(255)
    .trim(),
  lastName: Joi.string()
    .max(255)
    .trim(),
  profileImage: Joi.string(),
  profileThumbnail: Joi.string(),
});

const getUserSchema = Joi.object().keys({
  userId: Joi.string().trim().required(),
});

module.exports = {
  updateUserSchema,
  getUserSchema,
};
