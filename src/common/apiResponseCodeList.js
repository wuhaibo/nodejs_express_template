var ApiResponseCodes = {};

ApiResponseCodes.Success = { errorcode: 0, description: "success" };
ApiResponseCodes.OperationalError = {
  errorcode: -1,
  description: "server error.",
};
ApiResponseCodes.UncaughtError = {
  errorcode: -2,
  description: "server error.",
};

ApiResponseCodes.InputNotValid = {
  errorcode: 100,
  description: "input not valid.",
};

ApiResponseCodes.LoginFailed = {
  errorcode: 200,
  description: "login failed",
};

ApiResponseCodes.ServiceNotFound = {
  errorcode: 400,
  description: "service not found",
};

module.exports.ApiResponseCodes = ApiResponseCodes;
