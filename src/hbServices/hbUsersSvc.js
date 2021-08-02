const axios = require("axios");
const logger = require("../common/logger");
const { AppError } = require("../common/appError");
const uuid = require("uuid");

/** a fake user service */
var hbUsersSvc = {};

/**
 * get user list.
 * @returns  returns a list of users
 */
hbUsersSvc.fetchUserlist = async function () {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/users"
    );
    return response.data;
  } catch (error) {
    let uid = uuid.v1();
    logger.warn("error in fetchUserlist: " + uid, error);
    throw new AppError(uid, "fetchUserlist error.");
  }
};

/**
 * get user list.
 * @returns  returns a list of users
 */
hbUsersSvc.login = async function (usr, psd) {
  if (usr === "test" && psd === "test") {
    return true;
  }
  return false;
};

/** exports a fake user service */
module.exports = hbUsersSvc;
