const AuthService = require("../services/authService");
const catchAsync = require("../utils/catchAsync");
const logger = require("../utils/loggers/appLogger");
const { APIError, STATUS_CODES } = require("../utils/appError");
const {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  refreshTokenSchema,
  otpSchema,
} = require("../validations/authValidator");
const { cookieOptions } = require("../config");

const service = new AuthService();

exports.signup = catchAsync(async (req, res, next) => {
  const { error } = signupSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'USER_SIGNUP'. Error details: ${error.message}`
    );
    return next(new APIError(error.message, STATUS_CODES.BAD_REQUEST));
  }

  const user = req.body;
  await service.SignUp(user);
  res.status(201).json({
    status: "success",
  });
});

exports.sendOTP = catchAsync(async (req, res, next) => {
  const { error } = otpSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'SEND_OTP'. Error details: ${error.message}`
    );
    return next(new APIError(error.message, STATUS_CODES.BAD_REQUEST));
  }

  const { email:userEmail } = req.body;
  const otpCode = await service.sendOTP(userEmail);
  res.status(200).json({
    status: "success",
    data: {
      otpCode,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { error } = loginSchema.validate(req.body, { abortEarly: false });
  if (error) {
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'USER_LOGIN'. Error details: ${error.message}`
    );
    return next(new APIError(error.message, STATUS_CODES.BAD_REQUEST));
  }
  const user = req.body;
  const { accessToken, refreshToken, name, email, id } = await service.SignIn(
    user
  );

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json({
      status: "success",
      data: {
        tokens: {
          accessToken,
          refreshToken,
        },
        user: {
          id,
          name,
          email,
        },
      },
    });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { error } = forgotPasswordSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'FORGOT_PASSWORD'. Error details: ${error.message}`
    );
    return next(new APIError(error.message, STATUS_CODES.BAD_REQUEST));
  }
  const { email } = req.body;
  const passwordResetLink = await service.ForgotPassword(email);
  res.status(200).json({
    status: "success",
    data: {
      passwordResetLink,
    },
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { error } = resetPasswordSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'RESET_PASSWORD'. Error details: ${error.message}`
    );
    return next(new APIError(error.message, STATUS_CODES.BAD_REQUEST));
  }

  const { password: newPassword } = req.body;
  const { id: userId } = req.user;
  await service.ResetPassword(userId, newPassword);

  res.status(200).json({
    status: "success",
  });
});

exports.changeCurrentPassword = catchAsync(async (req, res, next) => {
  const { error } = changePasswordSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'CHANGE_CURRENT_PASSWORD'. Error details: ${error.message}`
    );
    return next(new APIError(error.message, STATUS_CODES.BAD_REQUEST));
  }

  const { oldPassword, newPassword } = req.body;
  const { user } = req;
  await service.ChangeCurrentPassword(user, oldPassword, newPassword);

  res.status(200).json({
    status: "success",
  });
});

exports.refreshAccessToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.cookies || req.body;
  const { error } = refreshTokenSchema.validate(
    { refreshToken },
    {
      abortEarly: false,
    }
  );
  if (error) {
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'REFRESH_ACCESS_TOKEN'. Error details: ${error.message}`
    );
    return next(new APIError(error.message, STATUS_CODES.BAD_REQUEST));
  }

  const { newAccessToken, newRefreshToken } = await service.GenerateNewToken({
    currentRefreshToken: refreshToken,
  });

  res
    .status(200)
    .cookie("accessToken", newAccessToken, cookieOptions)
    .cookie("refreshToken", newRefreshToken, cookieOptions)
    .json({
      status: "success",
      data: {
        tokens: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
      },
    });
});

exports.logoutUser = catchAsync(async (req, res, next) => {
  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json({ status: "success" });
});
