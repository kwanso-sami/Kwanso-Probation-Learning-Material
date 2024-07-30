const CommentService = require("../services/commentService");
const catchAsync = require("../utils/catchAsync");
const logger = require("../utils/loggers/appLogger");
const { APIError, STATUS_CODES } = require("../utils/appError");
const { createCommentSchema } = require("../validations/commentsValidator");
const { SORT, ORDER } = require("../utils/constants");

const service = new CommentService();

exports.createComment = catchAsync(async (req, res, next) => {
  const { error } = createCommentSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'CREATE_A_COMMENT'. Error details: ${error.message}`
    );
    return next(new APIError(error.message, STATUS_CODES.BAD_REQUEST));
  }

  const { body, postId, parentCommentId } = req.body;
  const { userId } = req.user;

  await service.CreateAComment({
    body,
    postId,
    parentCommentId,
    userId,
  });

  res.status(201).json({
    status: "success",
  });
});
