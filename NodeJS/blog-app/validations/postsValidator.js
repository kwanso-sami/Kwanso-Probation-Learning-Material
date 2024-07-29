const Joi = require("joi");

const getPostSchema = Joi.object().keys({
  userId: Joi.string(),
  postId: Joi.string(),
  page: Joi.number().integer(),
  perPage: Joi.number().integer(),
  sortBy: Joi.string(),
  orderBy: Joi.string(),
  searchBy: Joi.string(),
});

const createPostSchema=Joi.object().keys({
  userId: Joi.string(),
  postId: Joi.string(),
  page: Joi.number().integer(),
  perPage: Joi.number().integer(),
  sortBy: Joi.string(),
  orderBy: Joi.string(),
  searchBy: Joi.string(),
});


module.exports = {
  
  getPostSchema,
  createPostSchema
};
