const Joi = require("joi");

const createCommentSchema = Joi.object().keys({
  postId: Joi.string().required(),
  body: Joi.string()
    .trim()
    .required(),
  parentCommentId: Joi.string(),
});

const getCommentsSchema = Joi.object().keys({
  postId: Joi.string().trim(),
  page: Joi.number().integer(),
  perPage: Joi.number().integer(),
  sortBy: Joi.string().trim(),
  orderBy: Joi.string().trim(),
});

const deleteCommentSchema = Joi.object().keys({
  commentId: Joi.string()
    .trim()
    .required(),
});

const getRepliesSchema = Joi.object().keys({
  commentId: Joi.string()
    .trim()
    .required(),
    sortBy: Joi.string().trim(),
    orderBy: Joi.string().trim(),
});

const updateCommentSchema = Joi.object().keys({
  commentId: Joi.string()
    .trim()
    .required(),
  body: Joi.string()
    .trim()
    .required(),
});

module.exports = {
  createCommentSchema,
  getCommentsSchema,
  deleteCommentSchema,
  updateCommentSchema,
  getRepliesSchema
};
