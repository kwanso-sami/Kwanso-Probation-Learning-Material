const UserService = require("../services/userService");
const catchAsync = require("../utils/catchAsync");
const logger = require("../utils/loggers/appLogger");
const { APIError } = require("../utils/appError");
const {
  updateUserSchema,
  getUserSchema,
} = require("../validations/userValidator");
const { success } = require("../utils/apiResponse");
const { STATUS_CODE, ERROR } = require("../utils/constants");

const service = new UserService();

exports.getUser = catchAsync(async (req, res, next) => {
  const { error } = getUserSchema.validate(req.params, {
    abortEarly: false,
  });
  if (error) {
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'UPDATE_USER'. Error details: ${error.message}`
    );
    return next(
      new APIError(
        error.message,
        STATUS_CODE.BAD_REQUEST,
        ERROR.VALIDATION_ERROR
      )
    );
  }

  const { userId } = req.params;
  const {
    id,
    firstName,
    lastName,
    email,
    profileThumbnail,
    profileImage,
  } = await service.FindUser(userId);

  res.status(STATUS_CODE.OK).json(
    success("User fetched successfully", {
      id,
      firstName,
      lastName,
      email,
      profileThumbnail,
      profileImage,
    })
  );
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { error } = updateUserSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'UPDATE_USER'. Error details: ${error.message}`
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
  const { id: userId } = req.user;
  const updatedUser = await service.UpdateUser(updateFields, userId);

  res
    .status(STATUS_CODE.OK)
    .json(success("User updated successfully", updatedUser));
});
