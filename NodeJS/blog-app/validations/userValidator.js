const Joi = require("joi");

const updateUserSchema = Joi.object().keys({
  name: Joi.string().required()
});

module.exports = {
  updateUserSchema
};
