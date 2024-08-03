const apiRouter = require("./routes");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const { APIError } = require("./utils/appError");
const swagger = require("./swagger");
const { STATUS_CODE, ERROR_MESSAGE } = require("./utils/constants");
const httpLogger = require("./utils/loggers/httpLogger");
const { errorHandler } = require("./utils/errorHandler");
const { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS } = require("./config");
require("express-validator");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(helmet());
app.use(xss());
app.use(cookieParser());

// setting logger
if (process.env.NODE_ENV !== "prod") {
  app.use(morgan("dev"));
} else {
  app.use(httpLogger);
}

// Configure CORS settings for requests.
app.use(
  cors({
    origin: "*",
    allowedHeaders: ["Accept", "Content-Type", "Authorization"],
    credentials: true,
  })
);

// Apply the rate limiting middleware to all requests
app.use(
  rateLimit({
    windowMs: RATE_LIMIT_WINDOW_MS, // 20 minutes
    max: RATE_LIMIT_MAX_REQUESTS, //Limit each IP to 50 request per window (per 20 minutes)
    standardHeaders: true, //Return rate limit info in the RateLimit-* headers
    legacyHeaders: false, // Disable the X-RateLimit-* headers
    message: {
      status: ERROR_MESSAGE.DEFAULT,
      message: ERROR_MESSAGE.RATE_LIMIT_ERROR,
    },
  })
);

// initialize swagger
swagger(app);

//routing
app.use("/api/v1", apiRouter);

// Handling invalid routes
app.all("*", (req, res, next) => {
  const err = new APIError(
    `Can't find ${req.originalUrl} on the server!`,
    STATUS_CODE.NOT_FOUND
  );
  next(err);
});

//Error Handling Middleware
app.use(errorHandler);

module.exports = app;
