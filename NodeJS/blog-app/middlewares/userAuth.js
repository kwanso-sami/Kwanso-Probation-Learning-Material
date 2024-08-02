const catchAsync = require("../utils/catchAsync");
const { APIError } = require("../utils/appError");
const { verifyToken } = require("../utils/jwtHelper");
const UserService = require("../services/userService");
const { STATUS_CODE, ERROR_TYPE,ERROR_MESSAGE } = require("../utils/constants");

module.exports = catchAsync(async (req, res, next) => {
  let token;
  const authHeader = req.headers["authorization"];

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    logger.error(`${ERROR_TYPE.AUTHENTICATION_ERROR}`);
    return next(
      new APIError(
        ERROR_MESSAGE.TOKEN_NOT_FOUND,
        STATUS_CODE.UNAUTHORIZED,
        ERROR_TYPE.AUTHENTICATION_ERROR
      )
    );
  }

  const tokenPayload = await verifyToken(token);

  if (!tokenPayload) {
    logger.error(`${ERROR_TYPE.AUTHENTICATION_ERROR}`);
    return next(
      new APIError(
        ERROR_MESSAGE.ACCESS_TOKEN_EXPIRED,
        STATUS_CODE.UNAUTHORIZED,
        ERROR_TYPE.AUTHENTICATION_ERROR
      )
    );
  }
  const { id: userId } = tokenPayload;
  const rootUser = await new UserService().FindUser(userId);

  req.user = rootUser;

  next();
});
