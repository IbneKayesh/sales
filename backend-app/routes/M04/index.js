const express = require("express");
const router = express.Router();

const brandsV1Routes = require("./brands.v1.routes.js");
const unitsV1Routes = require("./units.v1.routes.js");
const categoryV1Routes = require("./category.v1.routes");
const subCategoryV1Routes = require("./subCategory.v1.routes");
const groupV1Routes = require("./group.v1.routes");
const subGroupV1Routes = require("./subGroup.v1.routes");
const itemsV1Routes = require("./items.v1.routes");
const priceV1Routes = require("./price.v1.routes");
const attributesV1Routes = require("./attributes.v1.routes");
const stockV1Routes = require("./stock.v1.routes");
const itemContactV1Routes = require("./itemContact.v1.routes");
const priceCostingV1Routes = require("./priceCosting.v1.routes");
const bundleV1Routes = require("./bundle.v1.routes");
const adjustmentsV1Routes = require("./adjustments.v1.routes.js");


router.use("/v1/brands", brandsV1Routes);
router.use("/v1/units", unitsV1Routes);
router.use("/v1/categories", categoryV1Routes);
router.use("/v1/sub-categories", subCategoryV1Routes);
router.use("/v1/groups", groupV1Routes);
router.use("/v1/sub-groups", subGroupV1Routes);
router.use("/v1/items", itemsV1Routes);
router.use("/v1/prices", priceV1Routes);
router.use("/v1/attributes", attributesV1Routes);
router.use("/v1/stock", stockV1Routes);
router.use("/v1/item-contact", itemContactV1Routes);
router.use("/v1/price-costing", priceCostingV1Routes);
router.use("/v1/bundle", bundleV1Routes);
router.use("/v1/adjustments", adjustmentsV1Routes);
module.exports = router;
