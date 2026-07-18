const express = require("express");
const router = express.Router();

const { modules, menus } = require("../data/data");

// Get all modules
router.get("/", (req, res) => {
  res.json(modules);
});

// Get modules with menus
router.get("/with-menus", (req, res) => {
  const result = modules
    .sort((a, b) => a.order_by - b.order_by)
    .map((module) => ({
      ...module,
      menus: menus.filter((menu) => menu.parent_id === module.id),
    }));

  res.json(result);
});

// Get single module
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  const module = modules.find((m) => m.id === id);

  if (!module) {
    return res.status(404).json({
      message: "Module not found",
    });
  }

  res.json(module);
});

module.exports = router;