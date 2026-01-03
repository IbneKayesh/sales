const express = require("express");
const router = express.Router();

const {
  runScriptsSequentially,
  dbRun,
  dbGet,
  dbAll,
} = require("../../db/asyncScriptsRunner");

//Get all shops
router.get("/", async (req, res) => {
  try {
    const sql = `SELECT u.*, 0 as edit_stop
    FROM shops u ORDER BY shop_id`;
    const rows = await dbAll(sql, []);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//get by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "SELECT u.*, 0 as edit_stop FROM shops u WHERE shop_id = ?";
    const row = await dbGet(sql, [id]);
    if (!row) {
      return res.status(404).json({ error: "Shop not found" });
    }
    res.json(row);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//create new shop
router.post("/", async (req, res) => {
  const {
    shop_id,
    shop_name,
    shop_address,
  } = req.body;

  if (!shop_id) {
    return res.status(400).json({ error: "Shop ID is required" });
  }
  if (!shop_name) {
    return res.status(400).json({ error: "Shop name is required" });
  }

  if (!shop_address) {
    return res.status(400).json({ error: "Shop address is required" });
  }

  try {
    const sql = `INSERT INTO shops (shop_id, shop_name, shop_address)
    VALUES (?, ?, ?)`;
    const params = [
      shop_id,
      shop_name,
      shop_address,
    ];
    await dbRun(sql, params, `Created shop ${shop_name}`);
    res.status(201).json({ shop_id, ...req.body });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//update shop
router.post("/update", async (req, res) => {
  const {
    shop_id,
    shop_name,
    shop_address,
  } = req.body;

  
  if (!shop_id) {
    return res.status(400).json({ error: "Shop ID is required" });
  }
  if (!shop_name) {
    return res.status(400).json({ error: "Shop name is required" });
  }

  if (!shop_address) {
    return res.status(400).json({ error: "Shop address is required" });
  }

  try {
    const sql = `UPDATE shops SET
    shop_name = ?,
    shop_address = ?,
    updated_at = CURRENT_TIMESTAMP
    WHERE shop_id = ?`;
    const params = [
      shop_name,
      shop_address,
      shop_id,
    ];
    const result = await dbRun(sql, params, `Updated shop ${shop_name}`);
    if (result.changes === 0) {
      return res.status(404).json({ error: "Shop not found" });
    }
    res.json({ shop_id, ...req.body });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Delete shop
router.post("/delete", async (req, res) => {
  const { shop_id } = req.body;

  if (!shop_id) {
    return res.status(400).json({ error: "Shop ID is required" });
  }

  try {
    const sql = "DELETE FROM shops WHERE shop_id = ?";
    const result = await dbRun(sql, [shop_id], `Deleted shop ${shop_id}`);
    if (result.changes === 0) {
      return res.status(404).json({ error: "Shop not found" });
    }
    res.json({ message: "Shop deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
