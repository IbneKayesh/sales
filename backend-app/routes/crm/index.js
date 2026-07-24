const express = require("express");
const router = express.Router();

const contactsRoutes = require("./contacts.routes.js");
const orderRouteRoutes = require("./orderRoute.routes.js");
const deliveryVanRoutes = require("./deliveryVan.routes.js");

router.use("/contacts", contactsRoutes);
router.use("/order-route", orderRouteRoutes);
router.use("/delivery-van", deliveryVanRoutes);




const contactsV1Routes = require("./contacts.v1.routes.js");


router.use("/v1/contacts", contactsV1Routes);
module.exports = router;
