const express = require("express");
const swaggerUi = require("swagger-ui-express");
const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");

const swaggerRouter = express.Router();

swaggerRouter.use("/", swaggerUi.serve);
swaggerRouter.get("/", (req, res, next) => {
  const swaggerDocument = yaml.load(
    fs.readFileSync(path.join(__dirname, "../docs/bundled.yaml"), "utf8")
  );
  swaggerUi.setup(swaggerDocument)(req, res, next);
});

module.exports = swaggerRouter;
