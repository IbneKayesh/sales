// server/featureRoute.js
import express from "express";
import { pool } from "./db.js";
import { normalizeFeatureBody } from "./normalize.js";

const router = express.Router();

// get-all-test
// router.get("/get-all-test", async (req, res) => {
//   try {
//     const result = await pool.query(
//       "SELECT * FROM t_features WHERE id ='e90fe74a-a3d3-46aa-9c1d-b3277c50356c'",
//     );
//     console.log("data", result.rows)
//     res.json({ success: true, message: "Ok", data: result.rows });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message, data: [] });
//   }
// });

router.post("/get-all", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM t_features ORDER BY serial_number ASC, created_at DESC",
    );
    res.json({ success: true, message: "Ok", data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: [] });
  }
});

// add
router.post("/add", async (req, res) => {
  const {
    id,
    feature_id,
    feature_type,
    feature_name,
    feature_description,
    feature_status,
    feature_priority,
    work_type,
    work_user,
    start_date,
    end_date,
    progress_percent,
    serial_number,
    url_link
  } = normalizeFeatureBody(req.body);

  if (
    !feature_type ||
    !feature_name ||
    !feature_status ||
    !feature_priority ||
    !work_type ||
    !work_user
  ) {
    return res.status(400).json({
      success: false,
      message:
        "feature_type, feature_name, feature_status, feature_priority, work_type, and work_user are required",
      data: [],
    });
  }

  try {
    const query = `
      INSERT INTO t_features (
        id, feature_id, feature_type, feature_name, feature_description,
        feature_status, feature_priority, work_type, work_user,
        start_date, end_date, progress_percent, serial_number, url_link
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;
    const values = [
      id,
      feature_id,
      feature_type,
      feature_name,
      feature_description,
      feature_status,
      feature_priority,
      work_type,
      work_user,
      start_date,
      end_date,
      progress_percent,
      serial_number,
      url_link
    ];
    const result = await pool.query(query, values);
    res.json({ success: true, message: "Ok", data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: [] });
  }
});

// edit
router.post("/edit", async (req, res) => {
  const {
    id,
    feature_id,
    feature_type,
    feature_name,
    feature_description,
    feature_status,
    feature_priority,
    work_type,
    work_user,
    start_date,
    end_date,
    progress_percent,
    serial_number,
    url_link
  } = normalizeFeatureBody(req.body);

  if (
    !feature_type ||
    !feature_name ||
    !feature_status ||
    !feature_priority ||
    !work_type ||
    !work_user
  ) {
    return res.status(400).json({
      success: false,
      message:
        "feature_type, feature_name, feature_status, feature_priority, work_type, and work_user are required",
      data: [],
    });
  }

  try {
    const query = `
      UPDATE t_features SET
        feature_id = $2, feature_type = $3, feature_name = $4, feature_description = $5,
        feature_status = $6, feature_priority = $7, work_type = $8, work_user = $9,
        start_date = $10, end_date = $11, progress_percent = $12, serial_number = $13,
        url_link = $14, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const values = [
      id,
      feature_id,
      feature_type,
      feature_name,
      feature_description,
      feature_status,
      feature_priority,
      work_type,
      work_user,
      start_date,
      end_date,
      progress_percent,
      serial_number,
      url_link
    ];
    const result = await pool.query(query, values);
    res.json({ success: true, message: "Ok", data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: [] });
  }
});

// delete
router.post("/delete", async (req, res) => {
  const { id } = req.body;
  try {
    await pool.query("DELETE FROM t_features WHERE id = $1", [id]);
    res.json({ success: true, message: "Feature deleted successfully", data: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, data: [] });
  }
});

export default router;
