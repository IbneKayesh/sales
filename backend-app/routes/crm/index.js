const express = require("express");
const router = express.Router();

const contactsRoutes = require("./contacts.routes.js");
const orderRouteRoutes = require("./orderRoute.routes.js");
const dzoneRoutes = require("./dzone.routes.js");
const tareaRoutes = require("./tarea.routes.js");
const territoryRoutes = require("./territory.routes.js");
const deliveryVanRoutes = require("./deliveryVan.routes.js");



const contactsV1Routes = require("./contacts.v1.routes.js");
const dzoneV1Routes = require("./dzone.v1.routes.js");

router.use("/contacts", contactsRoutes);
router.use("/order-route", orderRouteRoutes);
router.use("/dzone", dzoneRoutes);
router.use("/tarea", tareaRoutes);
router.use("/territory", territoryRoutes);
router.use("/delivery-van", deliveryVanRoutes);

router.use("/v1/contacts", contactsV1Routes);
router.use("/v1/dzone", dzoneV1Routes);
module.exports = router;
