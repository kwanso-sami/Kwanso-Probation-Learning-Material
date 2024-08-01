const { STATUS_CODE,ERROR } = require("./constants");
class AppError extends Error {
  constructor(message, statusCode, status, isOperational, errorStack) {
    if (message) {
      super(message);
    } else {
      super("A generic error occurred!");
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
    message = "Internal Server Error",
    statusCode = STATUS_CODE.INTERNAL_SERVER_ERROR,
    status = ERROR.DEFAULT,
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
