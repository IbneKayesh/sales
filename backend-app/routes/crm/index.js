const express = require("express");
const router = express.Router();

const contactsRoutes = require("./contacts.routes.js");
const orderRoutes = require("./orderRoute.routes.js");
const dzoneRoutes = require("./dzone.routes.js");
const tareaRoutes = require("./tarea.routes.js");
const territoryRoutes = require("./territory.routes.js");
const deliveryVanRoutes = require("./deliveryVan.routes.js");

router.use("/contacts", contactsRoutes);
router.use("/order-route", orderRoutes);
router.use("/dzone", dzoneRoutes);
router.use("/tarea", tareaRoutes);
router.use("/territory", territoryRoutes);
router.use("/delivery-van", deliveryVanRoutes);

module.exports = router;
