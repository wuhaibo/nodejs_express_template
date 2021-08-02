var express = require("express");
var router = express.Router();

/* errTest */
router.get("/", function (req, res) {
  throw new Error("uncaught error in /errTest.");
});

// eslint-disable-next-line no-unused-vars
router.get("/rejectinpromise", async function (req, res) {
  await new Promise((resolve, reject) => {
    return reject(new Error("program error in /errTest/rejectinpromise"));
  });
});

module.exports = router;
