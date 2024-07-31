const AuthService = require("../services/authService");
const catchAsync = require("../utils/catchAsync");
const logger = require("../utils/loggers/appLogger");
const { APIError } = require("../utils/appError");
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
const { success } = require("../utils/apiResponse");
const { STATUS_CODE, ERROR } = require("../utils/constants");

const service = new AuthService();

exports.signup = catchAsync(async (req, res, next) => {
  const { error } = signupSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'USER_SIGNUP'. Error details: ${error.message}`
    );
    return next(
      new APIError(
        error.message,
        STATUS_CODE.BAD_REQUEST,
        ERROR.VALIDATION_ERROR
      )
    );
  }

  const user = req.body;
  await service.SignUp(user);

  res.status(STATUS_CODE.CREATED).json(success("User signed up successfully"));
});

exports.sendOTP = catchAsync(async (req, res, next) => {
  const { error } = otpSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'SEND_OTP'. Error details: ${error.message}`
    );
    return next(
      new APIError(
        error.message,
        STATUS_CODE.BAD_REQUEST,
        ERROR.VALIDATION_ERROR
      )
    );
  }

  const { email: userEmail } = req.body;
  const otpCode = await service.sendOTP(userEmail);

  res.status(STATUS_CODE.OK).json(
    success("OTP Code sent successfully", {
      otpCode,
    })
  );
});

exports.login = catchAsync(async (req, res, next) => {
  const { error } = loginSchema.validate(req.body, { abortEarly: false });
  if (error) {
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'USER_LOGIN'. Error details: ${error.message}`
    );
    return next(
      new APIError(
        error.message,
        STATUS_CODE.BAD_REQUEST,
        ERROR.VALIDATION_ERROR
      )
    );
  }
  const user = req.body;
  const {
    accessToken,
    refreshToken,
    user: loggedInUser,
  } = await service.SignIn(user);

  res
    .status(STATUS_CODE.OK)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      success("User logged in successfully", {
        tokens: {
          accessToken,
          refreshToken,
        },
        user: {
          id: loggedInUser.id,
          email: loggedInUser.id,
          firstName: loggedInUser.firstName,
          lastName: loggedInUser.lastName,
          profileThumbnail: loggedInUser.profileThumbnail,
          profileImage: loggedInUser.profileImage,
        },
      })
    );
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { error } = forgotPasswordSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'FORGOT_PASSWORD'. Error details: ${error.message}`
    );
    return next(
      new APIError(
        error.message,
        STATUS_CODE.BAD_REQUEST,
        ERROR.VALIDATION_ERROR
      )
    );
  }
  const { email } = req.body;
  const passwordResetLink = await service.ForgotPassword(email);

  res.status(STATUS_CODE.OK).json(
    success("Password reset email successfully", {
      passwordResetLink,
    })
  );
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { error } = resetPasswordSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'RESET_PASSWORD'. Error details: ${error.message}`
    );
    return next(
      new APIError(
        error.message,
        STATUS_CODE.BAD_REQUEST,
        ERROR.VALIDATION_ERROR
      )
    );
  }

  const { password: newPassword } = req.body;
  const { id: userId } = req.user;
  await service.ResetPassword(userId, newPassword);

  res.status(STATUS_CODE.OK).json(success("Password reset successfully"));
});

exports.changeCurrentPassword = catchAsync(async (req, res, next) => {
  const { error } = changePasswordSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    logger.error(
      `Unable to validate arguments in [ENDPOINT] 'CHANGE_CURRENT_PASSWORD'. Error details: ${error.message}`
    );
    return next(
      new APIError(
        error.message,
        STATUS_CODE.BAD_REQUEST,
        ERROR.VALIDATION_ERROR
      )
    );
  }

  const { oldPassword, newPassword } = req.body;
  const { user } = req;
  await service.ChangeCurrentPassword(user, oldPassword, newPassword);

  res.status(STATUS_CODE.OK).json(success("Password changed successfully"));
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
    return next(
      new APIError(
        error.message,
        STATUS_CODE.BAD_REQUEST,
        ERROR.VALIDATION_ERROR
      )
    );
  }

  const { newAccessToken, newRefreshToken } = await service.GenerateNewToken({
    currentRefreshToken: refreshToken,
  });

  res
    .status(STATUS_CODE.OK)
    .cookie("accessToken", newAccessToken, cookieOptions)
    .cookie("refreshToken", newRefreshToken, cookieOptions)
    .json(
      success("Password changed successfully", {
        tokens: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
      })
    );
});

exports.logoutUser = catchAsync(async (req, res, next) => {
  return res
    .status(STATUS_CODE.OK)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(success("User logged out successfully"));
});
