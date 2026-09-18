const express = require("express");
const router = express.Router();

const invoiceV1Routes = require("./invoice.v1.routes.js");
const deliveryTripV1Routes = require("./deliveryTrip.v1.routes.js");
const ordersV1Routes = require("./orders.v1.routes.js");

router.use("/v1/invoice", invoiceV1Routes);
router.use("/v1/delivery-trip", deliveryTripV1Routes);
router.use("/v1/orders", ordersV1Routes);
module.exports = router;
