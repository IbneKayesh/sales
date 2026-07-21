const express = require("express");
const router = express.Router();

const productionsV1Routes = require("./productions.v1.routes.js");
const bomV1Routes = require("./bom.v1.routes.js");


router.use("/v1/productions", productionsV1Routes);
router.use("/v1/bom", bomV1Routes);
module.exports = router;
