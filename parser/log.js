const winston = require("winston");
const path = require("path");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.label({ label: "[my-label]" }),
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    winston.format.printf(
      info => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, process.env.ERROR_LOG_FILE),
      level: "error"
    }),
    new winston.transports.File({
      filename: path.join(__dirname, process.env.INFO_LOG_FILE),
      level: "info"
    }),
    new winston.transports.Console()
  ]
});

module.exports = logger;
