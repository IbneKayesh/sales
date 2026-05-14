const express = require("express");
const router = express.Router();

const productsRoutes = require("./products.routes.js");
const stockreportsRoutes = require("./stockreports.routes.js");
//const itransferRoutes = require("./itransfer.routes.js");
const stockFormulaRoutes = require("./stockFormula.routes.js");

router.use("/products", productsRoutes);
router.use("/stockreports", stockreportsRoutes);
//router.use("/itransfer", itransferRoutes);
router.use("/products/formula", stockFormulaRoutes);

const brandsV1Routes = require("./brands.v1.routes");
const unitsV1Routes = require("./units.v1.routes");
const categoryV1Routes = require("./category.v1.routes");
const subCategoryV1Routes = require("./subCategory.v1.routes");
const attributesV1Routes = require("./attributes.v1.routes");
const groupV1Routes = require("./group.v1.routes");
const subGroupV1Routes = require("./subGroup.v1.routes");
const priceV1Routes = require("./price.v1.routes");

router.use("/v1/brands", brandsV1Routes);
router.use("/v1/units", unitsV1Routes);
router.use("/v1/category", categoryV1Routes);
router.use("/v1/sub-category", subCategoryV1Routes);
router.use("/v1/attributes", attributesV1Routes);
router.use("/v1/group", groupV1Routes);
router.use("/v1/sub-group", subGroupV1Routes);
router.use("/v1/price", priceV1Routes);

module.exports = router;
