const CommentService = require("../services/commentService");
const catchAsync = require("../utils/catchAsync");
const logger = require("../utils/loggers/appLogger");
const { APIError } = require("../utils/appError");
const {
  createCommentSchema,
  getCommentsSchema,
  deleteCommentSchema,
  updateCommentSchema,
  getRepliesSchema,
} = require("../validations/commentsValidator");
const { success } = require("../utils/apiResponse");
const { SORT, ORDER, STATUS_CODE, ERROR_TYPE,SUCCESS_MESSAGE} = require("../utils/constants");

const service = new CommentService();

exports.createComment = catchAsync(async (req, res, next) => {
  const { error, value: validatedParams } = createCommentSchema.validate(
    req.body,
    {
      abortEarly: false,
    }
  );

  if (error) {
    logger.error(`${ERROR_TYPE.VALIDATION_ERROR}: ${ERROR_TYPE.message}`);

    return next(
      new APIError(
        error.message,
        STATUS_CODE.BAD_REQUEST,
        ERROR_TYPE.VALIDATION_ERROR
      )
    );
  }

  const { body, postId, parentCommentId } = validatedParams;
  const { id: userId } = req.user;

  const newComment = await service.CreateComment({
    body,
    postId,
    parentCommentId,
    userId,
  });

  res.status(STATUS_CODE.CREATED).json(
    success({
      message: SUCCESS_MESSAGE.COMMENT_CREATED,
      response: newComment,
    })
  );
});

exports.getAllComments = catchAsync(async (req, res, next) => {
  const { error, value: validatedParams } = getCommentsSchema.validate(
    req.query,
    {
      abortEarly: false,
    }
  );

  if (error) {
    logger.error(`${ERROR_TYPE.VALIDATION_ERROR}: ${ERROR_TYPE.message}`);
    return next(
      new APIError(
        error.message,
        STATUS_CODE.BAD_REQUEST,
        ERROR_TYPE.VALIDATION_ERROR
      )
    );
  }


  const {
    page = 1,
    perPage = 10,
    sortBy = SORT.CREATED_AT,
    orderBy = ORDER.DESC,
    withReplies = false,
    postId,
  } = validatedParams;

  const comments = await service.GetAllComments({
    page,
    perPage,
    sortBy,
    orderBy,
    postId,
    withReplies,
  });

  res.status(STATUS_CODE.OK).json(
    success({
      message: SUCCESS_MESSAGE.COMMENTS_FETCHED,
      response: comments,
    })
  );
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const { error, value: validatedParams } = deleteCommentSchema.validate(
    req.params,
    {
      abortEarly: false,
    }
  );

  if (error) {
    logger.error(`${ERROR_TYPE.VALIDATION_ERROR}: ${ERROR_TYPE.message}`);
    return next(
      new APIError(
        error.message,
        STATUS_CODE.BAD_REQUEST,
        ERROR_TYPE.VALIDATION_ERROR
      )
    );
  }

  const { commentId } = validatedParams;

  await service.DeleteComment(commentId);

  res.status(STATUS_CODE.OK).json(
    success({
      message: SUCCESS_MESSAGE.COMMENT_DELETED,
    })
  );
});

exports.updateComment = catchAsync(async (req, res, next) => {
  const { error, value: validatedParams } = updateCommentSchema.validate(
    {
      ...req.body,
      ...req.params,
    },
    {
      abortEarly: false,
    }
  );

  if (error) {
    logger.error(`${ERROR_TYPE.VALIDATION_ERROR}: ${ERROR_TYPE.message}`);
    return next(
      new APIError(
        error.message,
        STATUS_CODE.BAD_REQUEST,
        ERROR_TYPE.VALIDATION_ERROR
      )
    );
  }

  const updateFields = req.body;
  const { commentId } = validatedParams;

  const updatedComment = await service.UpdateComment(updateFields, commentId);

  res.status(STATUS_CODE.OK).json(
    success({
      message: SUCCESS_MESSAGE.COMMENT_UPDATED,
      response: updatedComment,
    })
  );
});

exports.getCommentReplies = catchAsync(async (req, res, next) => {
  const { error, value: validatedParams } = getRepliesSchema.validate(
    {
      ...req.params,
      ...req.query,
    },
    {
      abortEarly: false,
    }
  );

  if (error) {
    logger.error(`${ERROR_TYPE.VALIDATION_ERROR}: ${ERROR_TYPE.message}`);
    return next(
      new APIError(
        error.message,
        STATUS_CODE.BAD_REQUEST,
        ERROR_TYPE.VALIDATION_ERROR
      )
    );
  }

  const {
    commentId,
    sortBy = SORT.CREATED_AT,
    orderBy = ORDER.DESC,
  } = validatedParams;

  const commentReplies = await service.GetCommentReplies(commentId, {
    sortBy,
    orderBy,
  });

  res.status(STATUS_CODE.OK).json(
    success({
      message: SUCCESS_MESSAGE.REPLIES_FETCHED,
      response: commentReplies,
    })
  );
});
