const express = require("express");
const router = express.Router();


const productsRoutes = require("./products.routes.js");
const attributesRoutes = require("./attributes.routes.js");
const stockreportsRoutes = require("./stockreports.routes.js");
const itransferRoutes = require("./itransfer.routes.js");
const stockFormulaRoutes = require("./stockFormula.routes.js");

router.use("/products", productsRoutes);
router.use("/attributes", attributesRoutes);
router.use("/stockreports", stockreportsRoutes);
router.use("/itransfer", itransferRoutes);
router.use("/products/formula", stockFormulaRoutes);




const brandsV1Routes = require("./brands.v1.routes");
const unitsV1Routes = require("./units.v1.routes");
const categoryV1Routes = require("./category.v1.routes");

router.use("/v1/brands", brandsV1Routes);
router.use("/v1/units", unitsV1Routes);
router.use("/v1/category", categoryV1Routes);


module.exports = router;
