const express = require("express");
const router = express.Router();

const contactsRoutes = require("./contacts.routes.js");
const orderRouteRoutes = require("./orderRoute.routes.js");
const territoryRoutes = require("./territory.routes.js");
const deliveryVanRoutes = require("./deliveryVan.routes.js");

router.use("/contacts", contactsRoutes);
router.use("/order-route", orderRouteRoutes);
router.use("/territory", territoryRoutes);
router.use("/delivery-van", deliveryVanRoutes);




const contactsV1Routes = require("./contacts.v1.routes.js");
const dzoneV1Routes = require("./dzone.v1.routes.js");
const tareaV1Routes = require("./tarea.v1.routes.js");
const territoryV1Routes = require("./territory.v1.routes.js");


router.use("/v1/contacts", contactsV1Routes);
router.use("/v1/dzone", dzoneV1Routes);
router.use("/v1/tarea", tareaV1Routes);
router.use("/v1/territory", territoryV1Routes);
module.exports = router;
