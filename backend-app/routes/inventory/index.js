const express = require("express");
const router = express.Router();

const unitsRoutes = require("./units.routes.js");
const categoriesRoutes = require("./categories.routes.js");
const productsRoutes = require("./products.routes.js");
const attributesRoutes = require("./attributes.routes.js");
const stockreportsRoutes = require("./stockreports.routes.js");
const itransferRoutes = require("./itransfer.routes.js");

router.use("/units", unitsRoutes);
router.use("/categories", categoriesRoutes);
router.use("/products", productsRoutes);
router.use("/attributes", attributesRoutes);
router.use("/stockreports", stockreportsRoutes);
router.use("/itransfer", itransferRoutes);

module.exports = router;
