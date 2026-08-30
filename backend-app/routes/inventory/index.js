const express = require("express");
const router = express.Router();

const productsRoutes = require("./products.routes.js");
//const itransferRoutes = require("./itransfer.routes.js");
const stockFormulaRoutes = require("./stockFormula.routes.js");

router.use("/products", productsRoutes);
//router.use("/itransfer", itransferRoutes);
router.use("/products/formula", stockFormulaRoutes);


const itemsvmartV1Routes = require("./items.vmart.v1.routes.js");


router.use("/v1/items/vmart", itemsvmartV1Routes);

module.exports = router;
