const express = require("express");
const router = express.Router();

const brandsV1Routes = require("./brands.v1.routes.js");
const unitsV1Routes = require("./units.v1.routes.js");


router.use("/v1/brands", brandsV1Routes);
router.use("/v1/units", unitsV1Routes);
module.exports = router;
