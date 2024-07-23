const { PORT } = require("./config");
const app = require("./app");
const logger = require("./utils/loggers/appLogger");
const { sequelize } = require("./models");

//Start the server
const port = PORT || 3000;
app.listen(port, async () => {
  logger.info(`App running on port ${port}...`);
  try {
    await sequelize.authenticate();
    logger.info("DB connection successful!");
    await sequelize.sync();
    logger.info("DB sync successful!");
  } catch (err) {
    logger.error(`Failed to connect to the database: ${err.message}`);
    process.exit(1);
  }
});

//Handle unhandled promise rejections and uncaught exceptions
process.on("uncaughtException", () => {
  logger.error("Uncaught Exception Occur! Shutting down...");
  process.exit(1);
});

process.on("unhandledRejection", () => {
  logger.error("Unhandled Rejection Occur! Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
