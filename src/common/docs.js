var swaggerJSDoc = require("swagger-jsdoc");
var swaggerUi = require("swagger-ui-express");
var express = require("express");
var router = express.Router();

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Express API for Application",
    version: "1.0.0",
    description: "This is a REST API application made with Express.",
    license: {
      name: "Licensed Under MIT",
      url: "https://spdx.org/licenses/MIT.html",
    },
    contact: {
      name: "API contact",
      url: "https://jsonplaceholder.typicode.com",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
};

const options = {
  swaggerDefinition,
  // Path to the API docs
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

router.use(
  "/",
  async (req, res, next) => {
    next();
  },
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);
module.exports = router;
