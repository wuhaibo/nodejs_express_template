const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const config = require("config");
const path = require("path");

const customLevels = {
  trace: 5,
  debug: 4,
  info: 3,
  warn: 2,
  error: 1,
  fatal: 0,
};

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.splat(),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...meta } = info;
    return `${timestamp} [${level}]: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""
    }`;
  })

  //winston.format.json()
);

// use filter if we want to exclude error info in combined log
const transportFile = [
  //only for error
  new DailyRotateFile({
    filename: path.join(
      config.get("logConfig.logFolder"),
      "APP-%DATE%.log.err"
    ),
    datePattern: "YYYY-MM-DD-HH",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    prepend: true,
    level: "error",
    handleExceptions: true,
  }),

  //combined log
  new DailyRotateFile({
    filename: path.join(config.get("logConfig.logFolder"), "APP-%DATE%.log"),
    datePattern: "YYYY-MM-DD-HH",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    prepend: true,
    level: "debug",
    handleExceptions: true,
  }),
];

const _logger = winston.createLogger({
  format: logFormat,
  levels: customLevels,
  transports: [
    ...transportFile,
    new winston.transports.Console({
      level: config.get("logConfig.logLevel"),
    }),
  ],
});

// logger
var logger = {};

// debug
logger.debug = function (msg, meta) {
  _logger.debug(msg, meta);
};

// info
logger.info = function (msg, meta) {
  _logger.info(msg, meta);
};

// warning
logger.warn = function (msg, meta) {
  _logger.warn(msg, meta);
};

// error
logger.error = function (msg, meta) {
  _logger.error(msg, meta);
};

// fatal
logger.fatal = function (msg, meta) {
  _logger.log("fatal", msg, meta);
};

// trace
logger.fatal = function (msg, meta) {
  _logger.log("trace", msg, meta);
};

// get instance
logger.getInstance = function () {
  return _logger;
};

module.exports = logger;
