const Joi = require("joi");

const updateUserSchema = Joi.object().keys({
  firstName: Joi.string(),
  lastName: Joi.string(),
  profileImage: Joi.string(),
  profileThumbnail: Joi.string(),
});

const getUserSchema = Joi.object().keys({
  userId: Joi.string().required(),
});

module.exports = {
  updateUserSchema,
  getUserSchema,
};
