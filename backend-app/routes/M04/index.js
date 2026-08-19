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
const taxV1Routes = require("./tax.v1.routes");
const itemTaxV1Routes = require("./itemTax.v1.routes");


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
router.use("/v1/tax", taxV1Routes);
router.use("/v1/item-tax", itemTaxV1Routes);
module.exports = router;
