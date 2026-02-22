const express = require("express");
const router = express.Router();

const businessRoutes = require("./business.routes.js");
const usersRoutes = require("./users.routes.js");
const databaseRoutes = require("./database.routes.js");
const closingRoutes = require("./closing.routes.js");
const configsRoutes = require("./configs.routes.js");
const defaultDataRoutes = require("./defaultData.routes.js");

router.use("/business", businessRoutes);
router.use("/users", usersRoutes);
router.use("/database", databaseRoutes);
router.use("/closing", closingRoutes);
router.use("/configs", configsRoutes);
router.use("/default-data", defaultDataRoutes);

module.exports = router;
