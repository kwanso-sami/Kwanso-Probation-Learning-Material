const STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

class AppError extends Error {
  constructor(message, statusCode, isOperational, errorStack) {
    if (message) {
      super(message);
    } else {
      super("A generic error occurred!");
    }
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errorStack = errorStack;
    this.timestamp = new Date().toISOString();
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    Error.captureStackTrace(this, this.constructor);
  }
}

class APIError extends AppError {
  constructor(
    message = "Internal Server Error",
    statusCode = STATUS_CODES.INTERNAL_SERVER_ERROR,
    isOperational = true,
    errorStack
  ) {
    super(message, statusCode, isOperational, errorStack);
  }
}

module.exports = {
  AppError,
  APIError,
  STATUS_CODES,
};
