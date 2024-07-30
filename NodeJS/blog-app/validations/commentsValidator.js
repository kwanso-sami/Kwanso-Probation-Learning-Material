const createCommentSchema = Joi.object().keys({
  postId: Joi.string().required(),
  body: Joi.string().required(),
  parentCommentId: Joi.string(),
});

module.exports = {
  createCommentSchema,
};
