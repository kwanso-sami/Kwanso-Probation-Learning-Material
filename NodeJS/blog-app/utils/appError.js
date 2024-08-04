const { STATUS_CODE, ERROR_TYPE, ERROR_MESSAGE } = require("./constants");
class AppError extends Error {
  constructor(message, statusCode, status, isOperational, errorStack) {
    if (message) {
      super(message);
    } else {
      super(ERROR_MESSAGE.GENERIC);
    }
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.status = status;
    this.isOperational = isOperational;
    this.errorStack = errorStack;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }
}

class APIError extends AppError {
  constructor(
    message = ERROR_TYPE.INTERNAL_SERVER_ERROR,
    statusCode = STATUS_CODE.INTERNAL_SERVER_ERROR,
    status = ERROR_MESSAGE.DEFAULT,
    isOperational = true,
    errorStack
  ) {
    super(message, statusCode, status, isOperational, errorStack);
  }
}

module.exports = {
  AppError,
  APIError,
};
