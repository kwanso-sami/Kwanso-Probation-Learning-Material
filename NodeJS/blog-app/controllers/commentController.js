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
const { SORT, ORDER, STATUS_CODE, ERROR } = require("../utils/constants");

const service = new CommentService();

exports.createComment = catchAsync(async (req, res, next) => {
  const { error, value: validatedParams } = createCommentSchema.validate(
    req.body,
    {
      abortEarly: false,
    }
  );

  if (error) {
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'CREATE_A_COMMENT'. Error details: ${error.message}`
    );

    return next(
      new APIError(
        error.message,
        STATUS_CODE.BAD_REQUEST,
        ERROR.VALIDATION_ERROR
      )
    );
  }

  const { body, postId, parentCommentId } = validatedParams;
  const { id: userId } = req.user;

  const newComment = await service.CreateAComment({
    body,
    postId,
    parentCommentId,
    userId,
  });

  res.status(STATUS_CODE.CREATED).json(
    success({
      message: "Comment created successfully",
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
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'GET_ALL_COMMENTS'. Error details: ${error.message}`
    );
    return next(
      new APIError(
        error.message,
        STATUS_CODE.BAD_REQUEST,
        ERROR.VALIDATION_ERROR
      )
    );
  }

  const {
    page = 1,
    perPage = 10,
    sortBy = SORT.CREATED_AT,
    orderBy = ORDER.DESC,
    withReply = false,
    postId,
  } = validatedParams;

  const comments = await service.GetAllComments({
    page,
    perPage,
    sortBy,
    orderBy,
    postId,
    withReply,
  });

  res.status(STATUS_CODE.OK).json(
    success({
      message: "Comments fetched successfully",
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
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'DELETE_A_COMMENT'. Error details: ${error.message}`
    );
    return next(
      new APIError(
        error.message,
        STATUS_CODE.BAD_REQUEST,
        ERROR.VALIDATION_ERROR
      )
    );
  }

  const { commentId } = validatedParams;

  await service.DeleteAComment(commentId);

  res.status(STATUS_CODE.OK).json(
    success({
      message: "Comment deleted successfully",
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
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'UPDATE_A_COMMENT'. Error details: ${error.message}`
    );
    return next(
      new APIError(
        error.message,
        STATUS_CODE.BAD_REQUEST,
        ERROR.VALIDATION_ERROR
      )
    );
  }

  const updateFields = req.body;
  const { commentId } = validatedParams;

  const updatedComment = await service.UpdateAComment(updateFields, commentId);

  res.status(STATUS_CODE.OK).json(
    success({
      message: "Comment updated successfully",
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
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'GET_COMMENT_REPLIES'. Error details: ${error.message}`
    );
    return next(
      new APIError(
        error.message,
        STATUS_CODE.BAD_REQUEST,
        ERROR.VALIDATION_ERROR
      )
    );
  }

  const {
    commentId,
    sortBy = SORT.CREATED_AT,
    orderBy = ORDER.DESC,
  } = validatedParams;

  const commentReplies = await service.GetRepliesForComment(commentId, {
    sortBy,
    orderBy,
  });

  res.status(STATUS_CODE.OK).json(
    success({
      message: "Replies of comment fetched successfully",
      response: commentReplies,
    })
  );
});
