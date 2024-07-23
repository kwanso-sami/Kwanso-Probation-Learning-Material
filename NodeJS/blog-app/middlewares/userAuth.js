const catchAsync = require("../utils/catchAsync");
const { APIError, STATUS_CODES } = require("../utils/appError");
const verifyToken = require("../utils/verifyToken");
const UserService = require("../services/userService");

module.exports = catchAsync(async (req, res, next) => {
  let token;
  const authHeader = req.headers["authorization"];

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return next(new APIError("Token Not Found", STATUS_CODES.UNAUTHORIZED));
  }

  const tokenPayload = verifyToken(token);

  if (tokenPayload) {
    const rootUser = await new UserService().FindUser({
      userId: tokenPayload.id,
    });
    req.user = rootUser;
  } else {
    return next(new APIError("Token Expired", STATUS_CODES.UNAUTHORIZED));
  }
  next();
});
