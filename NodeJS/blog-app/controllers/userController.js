const UserService = require("../services/userService");
const catchAsync = require("../utils/catchAsync");
const logger = require("../utils/loggers/appLogger");
const {
  APIError,
  STATUS_CODES,
} = require("../utils/appError").default.default;
const { updateUserSchema } = require("../validations/userValidator");

const service = new UserService();

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
  const { _id } = req.user;
  const data = await service.UpdateUser({ name, userId: _id });
  res.status(200).json({
    status: "success",
    data: data,
  });
});
