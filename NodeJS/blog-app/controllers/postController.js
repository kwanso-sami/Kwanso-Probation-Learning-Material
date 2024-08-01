const PostService = require("../services/postService");
const catchAsync = require("../utils/catchAsync");
const logger = require("../utils/loggers/appLogger");
const { APIError } = require("../utils/appError");
const {
  getPostsSchema,
  createPostSchema,
  updatePostSchema,
  deletePostSchema,
} = require("../validations/postsValidator");
const { success } = require("../utils/apiResponse");
const { SORT, ORDER, STATUS_CODE, ERROR } = require("../utils/constants");

const service = new PostService();

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const { error, value: validatedParams } = getPostsSchema.validate(req.query, {
    abortEarly: false,
  });

  if (error) {
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'GET_ALL_POSTS'. Error details: ${error.message}`
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
    searchBy,
  } = validatedParams;

  const posts = await service.GetAllPosts({
    page,
    perPage,
    sortBy,
    orderBy,
    searchBy,
  });

  res.status(STATUS_CODE.OK).json(
    success({
      message: "Posts fetched successfully",
      response: posts,
    })
  );
});

exports.getUserPosts = catchAsync(async (req, res, next) => {
  const { error, value: validatedParams } = getPostsSchema.validate(
    {
      ...req.query,
      ...req.params,
    },
    {
      abortEarly: false,
    }
  );

  if (error) {
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'GET_POSTS_OF_USER'. Error details: ${error.message}`
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
    searchBy,
    userId,
  } = validatedParams;

  const userPosts = await service.GetAllPosts({
    page,
    perPage,
    sortBy,
    orderBy,
    searchBy,
    userId,
  });

  res.status(STATUS_CODE.OK).json(
    success({
      message: "User posts fetched successfully",
      response: userPosts,
    })
  );
});

exports.getPost = catchAsync(async (req, res, next) => {
  const { error, value: validatedParams } = getPostsSchema.validate(
    req.params,
    {
      abortEarly: false,
    }
  );

  if (error) {
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'GET_A_POST'. Error details: ${error.message}`
    );
    return next(
      new APIError(
        error.message,
        STATUS_CODE.BAD_REQUEST,
        ERROR.VALIDATION_ERROR
      )
    );
  }

  const { postId } = validatedParams;

  const post = await service.GetAPost(postId);

  res.status(STATUS_CODE.OK).json(
    success({
      message: "A post fetched successfully",
      response: post,
    })
  );
});

exports.createPost = catchAsync(async (req, res, next) => {
  const { error, value: validatedParams } = createPostSchema.validate(
    req.body,
    {
      abortEarly: false,
    }
  );

  if (error) {
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'CREATE_A_POST'. Error details: ${error.message}`
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
    title,
    readDuration,
    body,
    categoryId,
    coverImage,
    coverThumbnail,
  } = validatedParams;

  const { id: userId } = req.user;

  const newPost = await service.CreateAPost({
    title,
    readDuration,
    body,
    categoryId,
    coverImage,
    coverThumbnail,
    userId,
  });

  res.status(STATUS_CODE.CREATED).json(
    success({
      message: "Post created successfully",
      response: newPost,
    })
  );
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const { error, value: validatedParams } = updatePostSchema.validate(
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
      `Unable to validate arguments in [ENDPOINT] 'UPDATE_A_POST'. Error details: ${error.message}`
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
  const { postId } = validatedParams;

  const updatedPost = await service.UpdateAPost(updateFields, postId);

  res.status(STATUS_CODE.OK).json(
    success({
      message: "Post updated successfully",
      response: updatedPost,
    })
  );
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const { error, value: validatedParams } = deletePostSchema.validate(
    req.params,
    {
      abortEarly: false,
    }
  );

  if (error) {
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'DELETE_A_POST'. Error details: ${error.message}`
    );
    return next(
      new APIError(
        error.message,
        STATUS_CODE.BAD_REQUEST,
        ERROR.VALIDATION_ERROR
      )
    );
  }

  const { postId } = validatedParams;

  await service.DeleteAPost(postId);

  res.status(STATUS_CODE.OK).json(
    success({
      message: "Post deleted successfully",
    })
  );
});

exports.getAllCategories = catchAsync(async (req, res, next) => {
  const postCategories = await service.GetAllCategories();
  res.status(STATUS_CODE.OK).json(
    success({
      message: "Post Categories fetched successfully",
      response: postCategories,
    })
  );
});
