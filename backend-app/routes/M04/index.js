const express = require("express");
const router = express.Router();

const brandsV1Routes = require("./brands.v1.routes.js");
const unitsV1Routes = require("./units.v1.routes.js");
const categoryV1Routes = require("./category.v1.routes");
const subCategoryV1Routes = require("./subCategory.v1.routes");
const groupV1Routes = require("./group.v1.routes");
const subGroupV1Routes = require("./subGroup.v1.routes");


router.use("/v1/brands", brandsV1Routes);
router.use("/v1/units", unitsV1Routes);
router.use("/v1/categories", categoryV1Routes);
router.use("/v1/sub-categories", subCategoryV1Routes);
router.use("/v1/groups", groupV1Routes);
router.use("/v1/sub-groups", subGroupV1Routes);
module.exports = router;
