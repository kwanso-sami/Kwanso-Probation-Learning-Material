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
const {
  STATUS_CODE,
  ERROR_TYPE,
  SUCCESS_MESSAGE,
} = require("../utils/constants");

const service = new AuthService();

exports.signup = catchAsync(async (req, res, next) => {
  const { error, value: validatedParams } = signupSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    logger.error(`${ERROR_TYPE.VALIDATION_ERROR}: ${ERROR_TYPE.message}`);
    return next(
      new APIError(
        error.message,
        STATUS_CODE.BAD_REQUEST,
        ERROR_TYPE.VALIDATION_ERROR
      )
    );
  }

  const user = validatedParams;
  await service.SignUp(user);

  res.status(STATUS_CODE.CREATED).json(
    success({
      message: SUCCESS_MESSAGE.USER_SIGN_UP,
    })
  );
});

exports.sendOTP = catchAsync(async (req, res, next) => {
  const { error, value: validatedParams } = otpSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    logger.error(`${ERROR_TYPE.VALIDATION_ERROR}: ${ERROR_TYPE.message}`);
    return next(
      new APIError(
        error.message,
        STATUS_CODE.BAD_REQUEST,
        ERROR_TYPE.VALIDATION_ERROR
      )
    );
  }

  const { email: userEmail } = validatedParams;
  const otpCode = await service.sendOTP(userEmail);

  res.status(STATUS_CODE.OK).json(
    success({
      message: SUCCESS_MESSAGE.OPT_SENT,
      response: { otpCode },
    })
  );
});

exports.login = catchAsync(async (req, res, next) => {
  const { error, value: validatedParams } = loginSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    logger.error(`${ERROR_TYPE.VALIDATION_ERROR}: ${ERROR_TYPE.message}`);
    return next(
      new APIError(
        error.message,
        STATUS_CODE.BAD_REQUEST,
        ERROR_TYPE.VALIDATION_ERROR
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
        message: SUCCESS_MESSAGE.USER_LOG_IN,
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
    logger.error(`${ERROR_TYPE.VALIDATION_ERROR}: ${ERROR_TYPE.message}`);
    return next(
      new APIError(
        error.message,
        STATUS_CODE.BAD_REQUEST,
        ERROR_TYPE.VALIDATION_ERROR
      )
    );
  }
  const { email } = validatedParams;
  const passwordResetLink = await service.ForgotPassword(email);

  res.status(STATUS_CODE.OK).json(
    success({
      message: SUCCESS_MESSAGE.PASSWORD_RESET_EMAIL_SENT,
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
    logger.error(`${ERROR_TYPE.VALIDATION_ERROR}: ${ERROR_TYPE.message}`);
    return next(
      new APIError(
        error.message,
        STATUS_CODE.BAD_REQUEST,
        ERROR_TYPE.VALIDATION_ERROR
      )
    );
  }

  const { newPassword } = validatedParams;
  const { id: userId } = req.user;
  await service.ResetPassword(userId, newPassword);

  res.status(STATUS_CODE.OK).json(
    success({
      message: SUCCESS_MESSAGE.PASSWORD_RESET,
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
    logger.error(`${ERROR_TYPE.VALIDATION_ERROR}: ${ERROR_TYPE.message}`);
    return next(
      new APIError(
        error.message,
        STATUS_CODE.BAD_REQUEST,
        ERROR_TYPE.VALIDATION_ERROR
      )
    );
  }

  const { oldPassword, newPassword } = validatedParams;
  const { user } = req;
  await service.ChangeCurrentPassword(user, oldPassword, newPassword);

  res.status(STATUS_CODE.OK).json(
    success({
      message: SUCCESS_MESSAGE.PASSWORD_CHANGE,
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
    logger.error(`${ERROR_TYPE.VALIDATION_ERROR}: ${ERROR_TYPE.message}`);
    return next(
      new APIError(
        error.message,
        STATUS_CODE.BAD_REQUEST,
        ERROR_TYPE.VALIDATION_ERROR
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
        message: SUCCESS_MESSAGE.TOKEN_REFRESH,
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
        message: SUCCESS_MESSAGE.USER_LOG_OUT,
      })
    );
});
