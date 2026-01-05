const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun } = require("../../db/database");

// ---------------- GET ALL SHOPS ----------------
router.get("/", async (req, res) => {
  try {
    const sql = `SELECT u.*, 0 as edit_stop FROM shops u ORDER BY shop_name`;
    const rows = await dbGetAll(sql, [], "Get all shops");

    res.json({
      message: "Fetched all shops",
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      message: "Internal server error",
      data: [],
    });
  }
});

// ---------------- GET SHOP BY ID ----------------
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT u.*, 0 as edit_stop FROM shops u WHERE shop_id = $1";
    const row = await dbGet(sql, [id], "Get shop by id");

    if (!row) {
      return res.status(404).json({
        message: "Shop not found",
        data: {},
      });
    }

    res.json({
      message: "Fetched shop",
      data: row,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      message: "Internal server error",
      data: {},
    });
  }
});

// ---------------- CREATE SHOP ----------------
router.post("/", async (req, res) => {
  const { shop_id, shop_name, shop_address, bin_no, open_date } = req.body;

  if (!shop_id || !shop_name || !shop_address) {
    return res.status(400).json({
      message: "shop_id, shop_name, and shop_address are required",
      data: req.body,
    });
  }

  try {
    const sql = `
      INSERT INTO shops (shop_id, shop_name, shop_address, bin_no, open_date)
      VALUES ($1, $2, $3, $4, $5)
    `;
    const params = [shop_id, shop_name, shop_address, bin_no, open_date];
    await dbRun(sql, params, `Created shop ${shop_name}`);

    res.status(201).json({
      message: "Shop created successfully",
      data: req.body,
    });
  } catch (error) {
    console.error("Error creating shop:", error);
    res.status(500).json({
      message: "Internal server error",
      data: {},
    });
  }
});

// ---------------- UPDATE SHOP ----------------
router.post("/update", async (req, res) => {
  const { shop_id, shop_name, shop_address, bin_no, open_date } = req.body;

  if (!shop_id || !shop_name || !shop_address) {
    return res.status(400).json({
      message: "shop_id, shop_name, and shop_address are required",
      data: req.body,
    });
  }

  try {
    const sql = `
      UPDATE shops
      SET shop_name = $1,
          shop_address = $2,
          bin_no = $3,
          open_date = $4,
          updated_at = CURRENT_TIMESTAMP
      WHERE shop_id = $5
    `;
    const params = [shop_name, shop_address, bin_no, open_date, shop_id];
    const resultCount = await dbRun(sql, params, `Updated shop ${shop_name}`);

    if (resultCount === 0) {
      return res.status(404).json({
        message: "Shop not found",
        data: req.body,
      });
    }

    res.json({
      message: "Shop updated successfully",
      data: req.body,
    });
  } catch (error) {
    console.error("Error updating shop:", error);
    res.status(500).json({
      message: "Internal server error",
      data: {},
    });
  }
});

// ---------------- DELETE SHOP ----------------
router.post("/delete", async (req, res) => {
  const { shop_id, shop_name } = req.body;

  if (!shop_id) {
    return res.status(400).json({
      message: "shop_id is required",
      data: req.body,
    });
  }

  try {
    const sql = "DELETE FROM shops WHERE shop_id = $1";
    const resultCount = await dbRun(sql, [shop_id], `Deleted shop ${shop_name}`);

    if (resultCount === 0) {
      return res.status(404).json({
        message: "Shop not found",
        data: req.body,
      });
    }

    res.json({
      message: "Shop deleted successfully",
      data: req.body,
    });
  } catch (error) {
    console.error("Error deleting shop:", error);
    res.status(500).json({
      message: "Internal server error",
      data: {},
    });
  }
});

module.exports = router;
