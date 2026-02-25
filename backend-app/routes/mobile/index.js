const express = require("express");
const router = express.Router();

const mauthRoutes = require("./auth/mauth.routes.js");
const mcontactsRoutes = require("./crm/mcontacts.routes.js");
const mordersRoutes = require("./sales/morders.routes.js");
const mproductsRoutes = require("./inventory/mproducts.routes.js");

router.use("/auth", mauthRoutes);
router.use("/crm/contacts", mcontactsRoutes);
router.use("/sales/orders", mordersRoutes);
router.use("/inventory/products", mproductsRoutes);

module.exports = router;
