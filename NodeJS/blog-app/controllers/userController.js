const UserService = require("../services/userService");
const catchAsync = require("../utils/catchAsync");
const logger = require("../utils/loggers/appLogger");
const { APIError, STATUS_CODES } = require("../utils/appError");
const {
  updateUserSchema,
  getUserSchema,
} = require("../validations/userValidator");

const service = new UserService();

exports.getUser = catchAsync(async (req, res, next) => {
  const { error } = getUserSchema.validate(req.params, {
    abortEarly: false,
  });
  if (error) {
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'UPDATE_USER'. Error details: ${error.message}`
    );
    return next(new APIError(error.message, STATUS_CODES.BAD_REQUEST));
  }

  const { userId } = req.params;
  const { id, firstName, lastName, email,profileThumbnail,profileImage } = await service.FindUser(userId);

  res.status(200).json({
    status: "success",
    data: {
      id, firstName, lastName, email,profileThumbnail,profileImage
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { error } = updateUserSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'UPDATE_USER'. Error details: ${error.message}`
    );
    return next(new APIError(error.message, STATUS_CODES.BAD_REQUEST));
  }
  const updateFields = req.body;
  const { id: userId } = req.user;
  const updatedUser = await service.UpdateUser(updateFields, userId);
  res.status(200).json({
    status: "success",
    data:updatedUser,
  });
});
