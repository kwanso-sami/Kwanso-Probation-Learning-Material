const Joi = require("joi");

const updateUserSchema = Joi.object().keys({
  name: Joi.string().required()
});

const getUserSchema = Joi.object().keys({
  id: Joi.string().required()
});

module.exports = {
  updateUserSchema,
  getUserSchema
};
