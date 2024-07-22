const { createLogger, format, transports, config } = require("winston");
const { combine, label, timestamp, json } = format;
const { LOG_LEVEL } = require("../../../config");

const logFormat = format.printf(({ timestamp, label, level, message }) => {
  const formattedTimestamp = new Date(timestamp).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  return `${formattedTimestamp} [${label}] ${level}: ${message}`;
});

const options = {
  file: {
    level: LOG_LEVEL || "info",
    filename: "./logs/app.log",
    handleExceptions: true,
    json: true,
    maxsize: 104857600, // 100MB
    maxFiles: 5,
    colorize: false,
    format: combine(
      label({ label: process.env.NODE_ENV }),
      timestamp(),
      json()
    ),
  },
  console: {
    level: LOG_LEVEL || "debug",
    handleExceptions: true,
    format: combine(
      format.colorize(),
      label({ label: process.env.NODE_ENV }),
      timestamp(),
      logFormat
    ),
  },
};

const logger = createLogger({
  levels: config.npm.levels,
  transports: [new transports.Console(options.console)],
  exitOnError: false,
});

if (process.env.NODE_ENV === "prod") {
  logger.add(new transports.File(options.file));
}

module.exports = logger;
