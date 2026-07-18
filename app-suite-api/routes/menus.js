const express = require("express");
const router = express.Router();

const { menus } = require("../data/data");

// Get all menus
router.get("/", (req, res) => {
  res.json(menus);
});

// Get menus by module id
router.get("/module/:moduleId", (req, res) => {
  const moduleId = Number(req.params.moduleId);

  const result = menus.filter(
    (menu) => menu.parent_id === moduleId
  );

  res.json(result);
});

module.exports = router;