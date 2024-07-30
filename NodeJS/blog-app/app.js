const apiRouter = require("./routes");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const { APIError, STATUS_CODES } = require("./utils/appError");
const httpLogger = require("./utils/loggers/httpLogger");
const { errorHandler } = require("./utils/errorHandler");
require("express-validator");
const app = express();

app.use(
  cors({
    origin: "*",
    allowedHeaders: ["Accept", "Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(helmet());
app.use(xss());
app.use(cookieParser());

if (process.env.NODE_ENV !== "prod") {
  app.use(morgan("dev"));
} else {
  app.use(httpLogger);
}

// Apply the rate limiting middleware to all requests
app.use(
  rateLimit({
    windowMs: 20 * 60 * 60, // 20 minutes
    max: 50, //Limit each IP to 50 request per window (per 20 minutes)
    standardHeaders: true, //Return rate limit info in the RateLimit-* headers
    legacyHeaders: false, // Disable the X-RateLimit-* headers
    message: {
      status: "error",
      message: "Too many requests, please try again later.",
    },
  })
);

//routing
app.use("/api/v1", apiRouter);

app.all("*", (req, res, next) => {
  const err = new APIError(
    `Can't find ${req.originalUrl} on the server!`,
    STATUS_CODES.NOT_FOUND
  );
  next(err);
});

app.use(errorHandler);

module.exports = app;
