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

  const { id: userId } = req.params;
  const { id, name, email } = await service.FindUser(userId);

  res.status(200).json({
    status: "success",
    data: {
      userID: id,
      userName: name,
      userEmail: email,
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
  const { name } = req.body;
  const { id } = req.user;
  const data = await service.UpdateUser({ name, userId: id });
  res.status(200).json({
    status: "success",
    data: data,
  });
});
