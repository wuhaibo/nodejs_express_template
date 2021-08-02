var uuid = require("uuid");

class AppError extends Error {
  constructor(errId, description, isOperational = true, errType = "") {
    super();
    Error.captureStackTrace(this);
    this.errId = errId || uuid.v1();
    this.description = description;
    this.isOperational = isOperational;
    this.errType = errType;
  }
}

module.exports.AppError = AppError;
