var express = require("express");

// if we have reverse proxy we could skip this part for performance
const helmet = require("helmet");
var compression = require("compression");

// used to catch async error in routers
// require("express-async-errors");

var path = require("path");
var cookieParser = require("cookie-parser");
const morgan = require("morgan");
var logger = require("./common/logger");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var errTestRouter = require("./routes/errTest");

var docsRouter = require("./common/docs");

var errorHandler = require("./common/errorHandler");
const { ApiResponseCodes } = require("./common/apiResponseCodeList");

var app = express();

// if we have reverse proxy we could skip this part for performance
app.use(helmet());
app.use(compression());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

const morganFormat = process.env.NODE_ENV !== "production" ? "dev" : "combined";
app.use(
  morgan(morganFormat, {
    skip: function (req, res) {
      return res.statusCode < 400;
    },
    stream: process.stderr,
  })
);

app.use(
  morgan(morganFormat, {
    skip: function (req, res) {
      return res.statusCode >= 400;
    },
    stream: process.stdout,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/errTest", errTestRouter);

app.use("/docs", docsRouter);

// catch 404
app.use(function (req, res) {
  // log ip and url to check if there is a scan from hacker
  logger.warn("404", {
    ip: req.headers["x-forwarded-for"] || req.socket.remoteAddress || "none",
    url: req.protocol + "://" + req.get("host") + req.originalUrl,
  });
  res.send({
    responseCode: ApiResponseCodes.ServiceNotFound.errorcode,
    description: ApiResponseCodes.ServiceNotFound.description,
  });
});

// error handler
app.use(async function (err, req, res, next) {
  errorHandler.handleError(err, req, res, next);
});

// last layer for error handling
process.on("unhandledRejection", function (err) {
  logger.error("this is my unhandledRejection.");
  throw err;
});
process.on("uncaughtException", function (err) {
  logger.error("this is my uncaughtException.");
  logger.error("uncaughtException:", err);
  process.exit(1);
});

module.exports = app;
