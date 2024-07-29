const PostService = require("../services/postService");
const catchAsync = require("../utils/catchAsync");
const logger = require("../utils/loggers/appLogger");
const { APIError, STATUS_CODES } = require("../utils/appError");
const { getPostSchema,createPostSchema } = require("../validations/postsValidator");
const { SORT, ORDER } = require("../utils/constants");

const service = new PostService();

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const { error } = getPostSchema.validate(req.query, {
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

exports.getAPost = catchAsync(async (req, res, next) => {
  const { error } = getPostSchema.validate(req.params, {
    abortEarly: false,
  });

  if (error) {
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'GET_A_POST'. Error details: ${error.message}`
    );
    return next(new APIError(error.message, STATUS_CODES.BAD_REQUEST));
  }

  const { postId } = req.params;

  const post = await service.GetAPost({
    postId,
  });

  res.status(200).json({
    status: "success",
    data: post,
  });
});



exports.createAPost = catchAsync(async (req, res, next) => {
    const { error } = createPostSchema.validate(req.body, {
      abortEarly: false,
    });
  
    if (error) {
      logger.error(
        `Unable to validate arguments in [ENDPOINT] 'CREATE_A_POST'. Error details: ${error.message}`
      );
      return next(new APIError(error.message, STATUS_CODES.BAD_REQUEST));
    }
  
    const { title,readDuration,body,categoryId,coverImage,coverThumbnail } = req.body;
    const { userId } = req.user;
  
    await service.CreateAPost({
        title,readDuration,body,categoryId,coverImage,coverThumbnail,userId
    });
  
    res.status(201).json({
      status: "success",
    });
  });
