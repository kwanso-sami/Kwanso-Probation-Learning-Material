const { PORT} = require("./config");
const app = require("./app");
const logger = require("./utils/loggers/appLogger");

//Start the server
const port = PORT || 3000;
app.listen(port, () => {
  logger.info(`App running on port ${port}...`);
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

