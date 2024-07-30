const Joi = require("joi");

const getPostsSchema = Joi.object().keys({
  userId: Joi.string(),
  postId: Joi.string(),
  page: Joi.number().integer(),
  perPage: Joi.number().integer(),
  sortBy: Joi.string(),
  orderBy: Joi.string(),
  searchBy: Joi.string(),
});

const createPostSchema = Joi.object().keys({
  title: Joi.string().required(),
  readDuration: Joi.number()
    .integer()
    .required(),
  body: Joi.string().required(),
  categoryId: Joi.string().required(),
  coverImage: Joi.string().required(),
  coverThumbnail: Joi.string().required(),
});

const updatePostSchema = Joi.object().keys({
  title: Joi.string(),
  readDuration: Joi.number().integer(),
  body: Joi.string(),
  categoryId: Joi.string(),
  coverImage: Joi.string(),
  coverThumbnail: Joi.string(),
  postId: Joi.string().required(),
});

const deletePostSchema = Joi.object().keys({
  postId: Joi.string().required(),
});

module.exports = {
  getPostsSchema,
  createPostSchema,
  updatePostSchema,
  deletePostSchema,
};
