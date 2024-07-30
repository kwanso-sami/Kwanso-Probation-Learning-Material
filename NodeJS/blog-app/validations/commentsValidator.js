const Joi = require("joi");

const createCommentSchema = Joi.object().keys({
  postId: Joi.string().required(),
  body: Joi.string().required(),
  parentCommentId: Joi.string(),
});

const getCommentsSchema = Joi.object().keys({
  postId: Joi.string(),
  page: Joi.number().integer(),
  perPage: Joi.number().integer(),
  sortBy: Joi.string(),
  orderBy: Joi.string(),
  isReply: Joi.boolean(),
});

module.exports = {
  createCommentSchema,
  getCommentsSchema,
};
