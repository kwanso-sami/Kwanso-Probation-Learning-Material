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
  const { error, value: validatedParams } = signupSchema.validate(req.body, {
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

  const user = validatedParams;
  await service.SignUp(user);

  res.status(STATUS_CODE.CREATED).json(
    success({
      message: "User signed up successfully",
    })
  );
});

exports.sendOTP = catchAsync(async (req, res, next) => {
  const { error, value: validatedParams } = otpSchema.validate(req.body, {
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

  const { email: userEmail } = validatedParams;
  const otpCode = await service.sendOTP(userEmail);

  res.status(STATUS_CODE.OK).json(
    success({
      message: "OTP Code sent successfully",
      response: { otpCode },
    })
  );
});

exports.login = catchAsync(async (req, res, next) => {
  const { error, value: validatedParams } = loginSchema.validate(req.body, {
    abortEarly: false,
  });
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
  const user = validatedParams;
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
      success({
        message: "User logged in successfully",
        response: {
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
        },
      })
    );
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { error, value: validatedParams } = forgotPasswordSchema.validate(
    req.body,
    {
      abortEarly: false,
    }
  );
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
  const { email } = validatedParams;
  const passwordResetLink = await service.ForgotPassword(email);

  res.status(STATUS_CODE.OK).json(
    success({
      message: "Password reset email successfully",
      response: passwordResetLink,
    })
  );
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { error, value: validatedParams } = resetPasswordSchema.validate(
    req.body,
    {
      abortEarly: false,
    }
  );
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

  const { newPassword } = validatedParams;
  const { id: userId } = req.user;
  await service.ResetPassword(userId, newPassword);

  res.status(STATUS_CODE.OK).json(
    success({
      message: "Password reset successfully",
    })
  );
});

exports.changeCurrentPassword = catchAsync(async (req, res, next) => {
  const { error, value: validatedParams } = changePasswordSchema.validate(
    req.body,
    {
      abortEarly: false,
    }
  );
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

  const { oldPassword, newPassword } = validatedParams;
  const { user } = req;
  await service.ChangeCurrentPassword(user, oldPassword, newPassword);

  res.status(STATUS_CODE.OK).json(
    success({
      message: "Password changed successfully",
    })
  );
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
      success({
        message: "Token Refreshed Successfully",
        response: {
          tokens: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          },
        },
      })
    );
});

exports.logoutUser = catchAsync(async (req, res, next) => {
  return res
    .status(STATUS_CODE.OK)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(
      success({
        message: "User logged out successfully",
      })
    );
});
