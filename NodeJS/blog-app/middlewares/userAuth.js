const catchAsync = require("../utils/catchAsync");
const { APIError } = require("../utils/appError");
const { verifyToken } = require("../utils/jwtHelper");
const UserService = require("../services/userService");
const { STATUS_CODE, ERROR } = require("../utils/constants");

module.exports = catchAsync(async (req, res, next) => {
  let token;
  const authHeader = req.headers["authorization"];

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return next(
      new APIError(
        "Token Not Found",
        STATUS_CODE.UNAUTHORIZED,
        ERROR.AUTHENTICATION_ERROR
      )
    );
  }

  const tokenPayload = await verifyToken(token);

  if (!tokenPayload) {
    return next(
      new APIError(
        "Access Token Expired",
        STATUS_CODE.UNAUTHORIZED,
        ERROR.AUTHENTICATION_ERROR
      )
    );
  }
  const { id: userId } = tokenPayload;
  const rootUser = await new UserService().FindUser(userId);

  req.user = rootUser;

  next();
});
