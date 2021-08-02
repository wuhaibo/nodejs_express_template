var express = require("express");
var router = express.Router();
var hbUsersSvc = require("../hbServices/hbUsersSvc");
var logger = require("../common/logger");
const { ApiResponseCodes } = require("../common/apiResponseCodeList");
const uuid = require("uuid");
const { AppError } = require("../common/appError");
const config = require("config");
const auth = require("../common/auth");

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users.
 *     description: Retrieve a list of users from some where. Can be used to populate a list of fake users when prototyping or testing an API.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 responseCode:
 *                   type: integer
 *                   description: the response code
 *                   example: 0
 *                 description:
 *                   type: string
 *                   description: the response description
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The user ID.
 *                         example: 0
 *                       name:
 *                         type: string
 *                         description: The user's name.
 *                         example: Leanne Graham
 */
router.get("/", auth.authenticate, async function (req, res, next) {
  try {
    var r = await hbUsersSvc.fetchUserlist();
    r = r.map((e) => {
      return { id: e.id, name: e.name };
    });
    res.send({
      responseCode: ApiResponseCodes.Success.errorcode,
      description: ApiResponseCodes.Success.description,
      data: r,
    });
  } catch (error) {
    logger.warn("error in get /users.", error);
    next(error);
  }
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: user login.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               type: object
 *               properties:
 *                 username:
 *                  type: string
 *                  description: username
 *                  example: test
 *                 password:
 *                  type: string
 *                  description: password
 *                  example: test
 *     responses:
 *       200:
 *         description: result of login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 responseCode:
 *                   type: integer
 *                   description: the response code
 *                   example: 0
 *                 description:
 *                   type: string
 *                   description: the response description
 *                   example: success
 */
router.post("/login", async function (req, res, next) {
  let uid = uuid.v1();
  try {
    if (!req.body.username || !req.body.password) {
      logger.debug("input not valid in /users/login. usr:" + req.body.username);
      res.send({
        responseCode: ApiResponseCodes.InputNotValid.errorcode,
        description: ApiResponseCodes.InputNotValid.description,
      });
      return;
    }

    let loginResult = await hbUsersSvc.login(
      req.body.username,
      req.body.password
    );
    if (!loginResult) {
      res.send({
        responseCode: ApiResponseCodes.LoginFailed.errorcode,
        description: ApiResponseCodes.LoginFailed.description,
      });
      return;
    }

    const secret = config.get("authConfig.secret");
    let tokenLife = config.get("authConfig.jwtTokenLife");
    let token = auth.getJwtToken(req.body.username, secret, tokenLife);
    logger.debug("token:" + token);

    if (token) {
      //set cookie
      res.cookie(config.get("authConfig.jwtTokenName"), token, {
        httpOnly: config.get("authConfig.httpOnly"),
        secure: config.get("authConfig.secure"),
        maxAge: config.get("authConfig.maxAge"),
      });
      res.send({
        responseCode: ApiResponseCodes.Success.errorcode,
        description: ApiResponseCodes.Success.description,
      });

      return;
    }
    // empty token error
    next(new AppError(uid, "get /users/login error: empty token"));
  } catch (error) {
    logger.warn("get /users/login error");
    next(new AppError(uid, "get /users/login error"));
  }
});

router.get("/logout", auth.authenticate, async function (req, res, next) {
  let uid = uuid.v1();

  try {
    res.cookie(config.get("authConfig.jwtTokenName"), "", {
      httpOnly: config.get("authConfig.httpOnly"),
      secure: config.get("authConfig.secure"),
      maxAge: config.get("authConfig.maxAge"),
    });
    res.send({
      responseCode: ApiResponseCodes.Success.errorcode,
      description: ApiResponseCodes.Success.description,
    });
  } catch (error) {
    logger.warn("get /users/logout error");
    next(new AppError(uid, "get /users/logout error"));
  }
});

module.exports = router;
