// server/featureTableRoute.js
import express from "express";
import { pool } from "./db.js";

const router = express.Router();

// get-by-table
router.post("/get-by-table", async (req, res) => {
  const { table_id } = req.body;
  try {
    const result = await pool.query(
      `SELECT ft.*, f.feature_name
       FROM t_feature_table ft
       JOIN t_features f ON ft.feature_id = f.id
       WHERE ft.table_id = $1
       ORDER BY ft.created_at DESC`,
      [table_id],
    );
    res.json({ success: true, message: "Ok", data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: [] });
  }
});

// table ids linked to leaf features (feature_type = 'feature') under a scope node
router.post("/get-table-ids-by-feature-filter", async (req, res) => {
  const { project_id, module_id, submodule_id, feature_id } = req.body;
  const scopeId = feature_id || submodule_id || module_id || project_id;

  if (!scopeId) {
    return res.json({ success: true, message: "Ok", data: [] });
  }

  try {
    if (project_id === "NM") {
      const result = await pool.query(
        `SELECT tbl.id AS table_id
        FROM t_tables tbl
        LEFT JOIN t_feature_table ftb ON tbl.id = ftb.table_id
        WHERE ftb.table_id IS NULL`,
        [],
      );
      return res.json({
        success: true,
        message: "Ok",
        data: result.rows.map((row) => row.table_id),
      });
    }

    const result = await pool.query(
      `WITH RECURSIVE descendants AS (
         SELECT id, feature_type FROM t_features WHERE id = $1
         UNION ALL
         SELECT f.id, f.feature_type
         FROM t_features f
         INNER JOIN descendants d ON f.feature_id = d.id
       ),
       leaf_features AS (
         SELECT id FROM descendants WHERE feature_type = 'feature'
       )
       SELECT DISTINCT ft.table_id
       FROM t_feature_table ft
       INNER JOIN leaf_features lf ON ft.feature_id = lf.id`,
      [scopeId],
    );
    res.json({
      success: true,
      message: "Ok",
      data: result.rows.map((row) => row.table_id),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: [] });
  }
});

//get-by-feature-without-tables
router.post("/get-by-feature-without-tables", async (req, res) => {
  const { feature_id } = req.body;
  try {
    const result = await pool.query(
      `SELECT tb.*
      FROM t_tables tb
      LEFT JOIN t_feature_table ft ON tb.id = ft.table_id
      AND ft.feature_id = $1
      WHERE ft.table_id is null
      ORDER BY tb.serial_number ASC`,
      [feature_id],
    );
    res.json({ success: true, message: "Ok", data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: [] });
  }
});

// get-by-feature-with-tables
router.post("/get-by-feature-with-tables", async (req, res) => {
  const { feature_id } = req.body;
  try {
    const result = await pool.query(
      `SELECT ft.*, t.table_name
       FROM t_feature_table ft
       JOIN t_tables t ON ft.table_id = t.id
       WHERE ft.feature_id = $1
       ORDER BY ft.created_at DESC`,
      [feature_id],
    );
    res.json({ success: true, message: "Ok", data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: [] });
  }
});

// add
router.post("/add", async (req, res) => {
  const { id, feature_id, table_id } = req.body;
  if (!feature_id || !table_id) {
    return res.status(400).json({
      success: false,
      message: "feature_id and table_id are required",
      data: [],
    });
  }
  try {
    const query = `
      INSERT INTO t_feature_table (id, feature_id, table_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await pool.query(query, [id, feature_id, table_id]);
    res.json({ success: true, message: "Ok", data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: [] });
  }
});

// delete
router.post("/delete", async (req, res) => {
  const { id } = req.body;
  try {
    await pool.query("DELETE FROM t_feature_table WHERE id = $1", [id]);
    res.json({
      success: true,
      message: "Feature-Table mapping deleted successfully",
      data: [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: [] });
  }
});

export default router;
