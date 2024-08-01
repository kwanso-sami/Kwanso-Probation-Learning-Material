const { AppError} = require("./appError");
const logger = require("./loggers/appLogger");
const { error } = require("./apiResponse");

function errorHandler(err, req, res, next) {
  let message = "Internal Server Error";

  // if the error is a custom defined error
  if (err instanceof AppError) {
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
  logger.error(err);

  let stackTrace = undefined;
  // return the stack trace only when
  // developing locally or in stage
  if (process.env.NODE_ENV !== "prod") {
    stackTrace = err.stack;
  }

  // return the standard error response
  res.status(err.statusCode).send(error(err.status, message));

  return next(err);
}

module.exports = { errorHandler };
