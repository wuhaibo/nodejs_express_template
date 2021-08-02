const jwt = require("jsonwebtoken");
const logger = require("./logger");
const config = require("config");
const { AppError } = require("./appError");
const uuid = require("uuid");
const { ApiResponseCodes } = require("./apiResponseCodeList");

var auth = {};
auth.getJwtToken = function (username, secret, expiresIn) {
  try {
    var token = jwt.sign(
      {
        username: username,
      },
      secret,
      {
        expiresIn: expiresIn,
      }
    );
  } catch (error) {
    logger.error(error);
    let uid = uuid.v1();
    throw new AppError(uid, "auth getJwtToken error.");
  }

  return token;
};

auth.handleLoginFailed = function (res) {
  if (!res) throw new Error("res in auth.handleLoginFailed is null.");
  res.send({
    responseCode: ApiResponseCodes.LoginFailed.errorcode,
    description: ApiResponseCodes.LoginFailed.description,
  });
};

auth.authenticate = async function (req, res, next) {
  try {
    logger.debug("auth");

    const jwtname = config.get("authConfig.jwtTokenName");
    const SECRET = config.get("authConfig.secret");

    const rawToken = String(req.cookies[jwtname]);
    logger.debug("token:" + rawToken);

    if (rawToken === "undefined") {
      logger.debug("no token found.");
      auth.handleLoginFailed(res);

      return;
    }
    const tokenData = jwt.verify(rawToken, SECRET);
    logger.debug("tokenData", tokenData);
    const username = tokenData.username;
    req.user = {
      username: username,
    };
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      logger.debug("token not valid.");
      auth.handleLoginFailed(res);
      return;
    }
    if (error.name === "TokenExpiredError") {
      logger.debug("TokenExpiredError");
      auth.handleLoginFailed(res);
      return;
    }
    let uid = uuid.v1();
    logger.warn("authenticate error", error);
    next(new AppError(uid, "authenticate error"));
  }
};

module.exports = auth;
