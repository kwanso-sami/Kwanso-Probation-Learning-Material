const PostService = require("../services/postService");
const catchAsync = require("../utils/catchAsync");
const logger = require("../utils/loggers/appLogger");
const { APIError, STATUS_CODES } = require("../utils/appError");
const {
  getPostsSchema,
  createPostSchema,
  updatePostSchema,
  deletePostSchema,
} = require("../validations/postsValidator");
const { SORT, ORDER } = require("../utils/constants");

const service = new PostService();

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const { error } = getPostsSchema.validate(req.query, {
    abortEarly: false,
  });

  if (error) {
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'GET_ALL_POSTS'. Error details: ${error.message}`
    );
    return next(new APIError(error.message, STATUS_CODES.BAD_REQUEST));
  }
  const {
    page = 1,
    perPage = 10,
    sortBy = SORT.CREATED_AT,
    orderBy = ORDER.DESC,
    searchBy,
  } = req.query;

  const posts = await service.GetAllPosts({
    page,
    perPage,
    sortBy,
    orderBy,
    searchBy,
  });

  res.status(200).json({
    status: "success",
    ...posts,
  });
});

exports.getUserPosts = catchAsync(async (req, res, next) => {
  const { error } = getPostsSchema.validate(
    {
      ...req.query,
      userId: req.params.userId,
    },
    {
      abortEarly: false,
    }
  );

  if (error) {
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'GET_POSTS_OF_USER'. Error details: ${error.message}`
    );
    return next(new APIError(error.message, STATUS_CODES.BAD_REQUEST));
  }

  const { userId } = req.params;
  const {
    page = 1,
    perPage = 10,
    sortBy = SORT.CREATED_AT,
    orderBy = ORDER.DESC,
    searchBy,
  } = req.query;

  const userPosts = await service.GetAllPosts({
    page,
    perPage,
    sortBy,
    orderBy,
    searchBy,
    userId,
  });

  res.status(200).json({
    status: "success",
    ...userPosts,
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const { error } = getPostsSchema.validate(req.params, {
    abortEarly: false,
  });

  if (error) {
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'GET_A_POST'. Error details: ${error.message}`
    );
    return next(new APIError(error.message, STATUS_CODES.BAD_REQUEST));
  }

  const { postId } = req.params;

  const post = await service.GetAPost(postId);

  res.status(200).json({
    status: "success",
    data: post,
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  const { error } = createPostSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'CREATE_A_POST'. Error details: ${error.message}`
    );
    return next(new APIError(error.message, STATUS_CODES.BAD_REQUEST));
  }

  const {
    title,
    readDuration,
    body,
    categoryId,
    coverImage,
    coverThumbnail,
  } = req.body;
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

  res.status(201).json({
    status: "success",
    data: newPost,
  });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const { error } = updatePostSchema.validate(
    {
      ...req.body,
      postId: req.params.postId,
    },
    {
      abortEarly: false,
    }
  );

  if (error) {
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'UPDATE_A_POST'. Error details: ${error.message}`
    );
    return next(new APIError(error.message, STATUS_CODES.BAD_REQUEST));
  }

  const updateFields = req.body;
  const { postId } = req.params;
  const { id: userId } = req.user;

  const updatedPost = await service.UpdateAPost(userId, updateFields, postId);

  res.status(200).json({
    status: "success",
    data: updatedPost,
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const { error } = deletePostSchema.validate(req.params, {
    abortEarly: false,
  });

  if (error) {
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'DELETE_A_POST'. Error details: ${error.message}`
    );
    return next(new APIError(error.message, STATUS_CODES.BAD_REQUEST));
  }

  const { postId } = req.params;
  const { id: userId } = req.user;

  await service.DeleteAPost(userId, postId);

  res.status(200).json({
    status: "success",
  });
});

exports.getAllCategories = catchAsync(async (req, res, next) => {
  const postCategories = await service.GetAllCategories();

  res.status(200).json({
    status: "success",
    data: postCategories,
  });
});
