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
const {
  SORT,
  ORDER,
  STATUS_CODE,
  ERROR_TYPE,
  SUCCESS_MESSAGE,
} = require("../utils/constants");

const service = new PostService();

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const { error, value: validatedParams } = getPostsSchema.validate(req.query, {
    abortEarly: false,
  });

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
      message: SUCCESS_MESSAGE.POSTS_FETCH,
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
      message: SUCCESS_MESSAGE.USER_POSTS_FETCH,
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
    logger.error(`${ERROR_TYPE.VALIDATION_ERROR}: ${ERROR_TYPE.message}`);
    return next(
      new APIError(
        error.message,
        STATUS_CODE.BAD_REQUEST,
        ERROR_TYPE.VALIDATION_ERROR
      )
    );
  }

  const { postId } = validatedParams;

  const post = await service.GetPost(postId);

  res.status(STATUS_CODE.OK).json(
    success({
      message: SUCCESS_MESSAGE.POSTS_FETCH,
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
    title,
    readDuration,
    body,
    categoryId,
    coverImage,
    coverThumbnail,
  } = validatedParams;

  const { id: userId } = req.user;

  const newPost = await service.CreatePost({
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
      message: SUCCESS_MESSAGE.POST_CREATED,
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
  const { postId } = validatedParams;

  const updatedPost = await service.UpdatePost(updateFields, postId);

  res.status(STATUS_CODE.OK).json(
    success({
      message: SUCCESS_MESSAGE.POST_UPDATED,
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
    logger.error(`${ERROR_TYPE.VALIDATION_ERROR}: ${ERROR_TYPE.message}`);
    return next(
      new APIError(
        error.message,
        STATUS_CODE.BAD_REQUEST,
        ERROR_TYPE.VALIDATION_ERROR
      )
    );
  }

  const { postId } = validatedParams;

  await service.DeletePost(postId);

  res.status(STATUS_CODE.OK).json(
    success({
      message: SUCCESS_MESSAGE.POST_DELETED,
    })
  );
});

exports.getAllCategories = catchAsync(async (req, res, next) => {
  const postCategories = await service.GetAllCategories();
  res.status(STATUS_CODE.OK).json(
    success({
      message: SUCCESS_MESSAGE.POST_CATEGORIES_FETCH,
      response: postCategories,
    })
  );
});
