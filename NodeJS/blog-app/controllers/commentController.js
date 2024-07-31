const CommentService = require("../services/commentService");
const catchAsync = require("../utils/catchAsync");
const logger = require("../utils/loggers/appLogger");
const { APIError, STATUS_CODES } = require("../utils/appError");
const {
  createCommentSchema,
  getCommentsSchema,
  deleteCommentSchema,
  updateCommentSchema,
} = require("../validations/commentsValidator");
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
  const { id: userId } = req.user;

  const newComment = await service.CreateAComment({
    body,
    postId,
    parentCommentId,
    userId,
  });

  res.status(201).json({
    status: "success",
    data: newComment,
  });
});

exports.getAllComments = catchAsync(async (req, res, next) => {
  const { error } = getCommentsSchema.validate(req.query, {
    abortEarly: false,
  });

  if (error) {
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'GET_ALL_COMMENTS'. Error details: ${error.message}`
    );
    return next(new APIError(error.message, STATUS_CODES.BAD_REQUEST));
  }

  const {
    page = 1,
    perPage = 10,
    sortBy = SORT.CREATED_AT,
    orderBy = ORDER.DESC,
    withReply = false,
    postId,
  } = req.query;

  const comments = await service.GetAllComments({
    page,
    perPage,
    sortBy,
    orderBy,
    postId,
    withReply,
  });

  res.status(200).json({
    status: "success",
    ...comments,
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const { error } = deleteCommentSchema.validate(req.params, {
    abortEarly: false,
  });

  if (error) {
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'DELETE_A_COMMENT'. Error details: ${error.message}`
    );
    return next(new APIError(error.message, STATUS_CODES.BAD_REQUEST));
  }

  const { commentId } = req.params;
  const { id: userId } = req.user;

  await service.DeleteAComment(userId, commentId);

  res.status(200).json({
    status: "success",
  });
});

exports.updateComment = catchAsync(async (req, res, next) => {
  const { error } = updateCommentSchema.validate(
    {
      ...req.body,
      commentId: req.params.commentId,
    },
    {
      abortEarly: false,
    }
  );

  if (error) {
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'UPDATE_A_COMMENT'. Error details: ${error.message}`
    );
    return next(new APIError(error.message, STATUS_CODES.BAD_REQUEST));
  }

  const updateFields = req.body;
  const { commentId } = req.params;
  const { id: userId } = req.user;

  const updatedComment = await service.UpdateAComment(
    userId,
    updateFields,
    commentId
  );

  res.status(200).json({
    status: "success",
    data: updatedComment,
  });
});
