const { PORT } = require("./config");
const app = require("./app");
const logger = require("./utils/loggers/appLogger");
const { sequelize } = require("./models");
const { ERROR_MESSAGE, SUCCESS_MESSAGE } = require("./utils/constants");

//Start the server
const port = PORT || 3000;
app.listen(port, async () => {
  logger.info(`App running on port ${port}...`);
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    logger.info(SUCCESS_MESSAGE.DB_CONNECTION_SUCCESS);
  } catch (err) {
    logger.error(`${ERROR_MESSAGE.DB_CONNECTION_ERROR}: ${err.message}`);
    process.exit(1);
  }
});

//Handle unhandled promise rejections and uncaught exceptions
process.on("uncaughtException", () => {
  logger.error(ERROR_MESSAGE.UNCAUGHT_EXCEPTION_ERROR);
  process.exit(1);
});

process.on("unhandledRejection", () => {
  logger.error(ERROR_MESSAGE.UNHANDLED_REJECTION_ERROR);
  server.close(() => {
    process.exit(1);
  });
});
