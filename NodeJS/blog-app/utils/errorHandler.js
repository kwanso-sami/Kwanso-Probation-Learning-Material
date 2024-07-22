const { AppError, STATUS_CODES } = require("./appError").default.default;
const logger = require("./loggers/appLogger");

function errorHandler(err, req, res, next) {
  // default HTTP status code and error message
  let httpStatusCode = STATUS_CODES.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";

  // if the error is a custom defined error
  if (err instanceof AppError) {
    httpStatusCode = err.statusCode;
    message = err.message;
  } else {
    // hide the detailed error message in production
    // for security reasons
    if (process.env.NODE_ENV !== "prod") {
      // since in JavaScript you can also
      // directly throw strings
      if (typeof err === "string") {
        message = err;
      } else if (err instanceof Error) {
        message = err.message;
      }
    }
  }
  logger.error(message);

  let stackTrace = undefined;
  // return the stack trace only when
  // developing locally or in stage
  if (process.env.NODE_ENV !== "prod") {
    stackTrace = err.stack;
  }

  // return the standard error response
  res.status(httpStatusCode).send({
    error: {
      message: message,
      timestamp: err.timestamp || undefined,
    },
  });

  return next(err);
}

module.exports = { errorHandler };
