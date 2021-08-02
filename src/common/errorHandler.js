const { AppError } = require("./appError");
const { ApiResponseCodes } = require("./apiResponseCodeList");

const logger = require("./logger");

var errorHandler = {};

function isTrustedError(err) {
  if (err instanceof AppError) {
    return err.isOperational;
  }
  return false;
}

errorHandler.handleError = function (err, req, res, next) {
  if (isTrustedError(err)) {
    // operational error
    logger.warn("handleError:", err);
    res.send({
      responseCode: ApiResponseCodes.OperationalError.errorcode,
      description: ApiResponseCodes.OperationalError.description,
    });
  } else {
    // uncaught error
    logger.error("uncaught error in handleError", err);

    // send email
    // send SMS

    res.send({
      responseCode: ApiResponseCodes.UncaughtError.errorcode,
      description: ApiResponseCodes.UncaughtError.description,
    });
  }
};
module.exports = errorHandler;
