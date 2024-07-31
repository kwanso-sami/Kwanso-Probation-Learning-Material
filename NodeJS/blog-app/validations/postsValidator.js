const Joi = require("joi");

const getPostsSchema = Joi.object().keys({
  userId: Joi.string().trim(),
  postId: Joi.string().trim(),
  page: Joi.number().integer(),
  perPage: Joi.number().integer(),
  sortBy: Joi.string().trim(),
  orderBy: Joi.string().trim(),
  searchBy: Joi.string().trim(),
});

const createPostSchema = Joi.object().keys({
  title: Joi.string()
    .max(255)
    .trim()
    .required(),
  readDuration: Joi.number()
    .integer()
    .required(),
  body: Joi.string()
    .trim()
    .required(),
  categoryId: Joi.string().trim().required(),
  coverImage: Joi.string().required(),
  coverThumbnail: Joi.string().required(),
});

const updatePostSchema = Joi.object().keys({
  title: Joi.string()
    .max(255)
    .trim(),
  readDuration: Joi.number().integer(),
  body: Joi.string().trim(),
  categoryId: Joi.string().trim(),
  coverImage: Joi.string(),
  coverThumbnail: Joi.string(),
  postId: Joi.string().trim().required(),
});

const deletePostSchema = Joi.object().keys({
  postId: Joi.string().trim().required(),
});

module.exports = {
  getPostsSchema,
  createPostSchema,
  updatePostSchema,
  deletePostSchema,
};
