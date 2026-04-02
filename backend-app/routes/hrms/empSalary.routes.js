const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const { empsl_users, empsl_bsins, empsl_emply } = req.body;

    // Validate input
    if (!empsl_users || !empsl_bsins || !empsl_emply) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT psl.*, 0 as edit_stop
      FROM tmhb_empsl psl
      WHERE psl.empsl_users = $1
      AND psl.empsl_bsins = $2
      AND psl.empsl_emply = $3
      ORDER BY psl.empsl_slcat`;
    const params = [empsl_users, empsl_bsins, empsl_emply];

    const rows = await dbGetAll(sql, params, `Get salary for ${empsl_users}`);
    res.json({
      success: true,
      message: "Salary fetched successfully",
      data: rows,
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: null,
    });
  }
});

// create
router.post("/create", async (req, res) => {
  try {
    const {
      id,
      empsl_users,
      empsl_bsins,
      empsl_emply,
      empsl_slcat,
      empsl_cramt,
      empsl_dbamt,
      empsl_notes,
      muser_id,
      suser_id,
    } = req.body;

    //console.log("req.body", req.body);

    // Validate input
    if (
      !id ||
      !empsl_users ||
      !empsl_bsins ||
      !empsl_emply ||
      !empsl_slcat ||
      !muser_id ||
      !suser_id
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `INSERT INTO tmhb_empsl(id, empsl_users, empsl_bsins, empsl_emply, empsl_slcat,
    empsl_cramt, empsl_dbamt, empsl_notes, empsl_crusr, empsl_upusr)
    VALUES ($1, $2, $3, $4, $5,
    $6, $7, $8, $9, $10)`;
    const params = [
      id,
      empsl_users,
      empsl_bsins,
      empsl_emply,
      empsl_slcat,
      empsl_cramt,
      empsl_dbamt,
      empsl_notes,
      suser_id,
      suser_id,
    ];

    await dbRun(sql, params, `Create salary for ${empsl_users}`);

    updateEmpSalary(empsl_emply);

    res.json({
      success: true,
      message: "Salary created successfully",
      data: null,
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: null,
    });
  }
});

// update
router.post("/update", async (req, res) => {
  res.json({
    success: false,
    message: "Feature is not required",
    data: null,
  });

  try {
    const {
      id,
      empsl_users,
      empsl_bsins,
      empsl_emply,
      empsl_slcat,
      empsl_cramt,
      empsl_dbamt,
      empsl_notes,
      muser_id,
      suser_id,
    } = req.body;

    //console.log("req.body", req.body);

    // Validate input
    if (
      !id ||
      !empsl_users ||
      !empsl_bsins ||
      !empsl_emply ||
      !empsl_slcat ||
      !muser_id ||
      !suser_id
    ) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmhb_empsl
    SET empsl_slcat = $1,
    empsl_cramt = $2,
    empsl_dbamt = $3,
    empsl_notes = $4,
    empsl_upusr = $5,
    empsl_updat = CURRENT_TIMESTAMP,
    empsl_rvnmr= empsl_rvnmr + 1
    WHERE id = $6`;
    const params = [
      empsl_slcat,
      empsl_cramt,
      empsl_dbamt,
      empsl_notes,
      suser_id,
      id,
    ];

    await dbRun(sql, params, `Update salary shift for ${empsl_cramt}`);
    res.json({
      success: true,
      message: "Salary updated successfully",
      data: null,
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: null,
    });
  }
});

// delete
router.post("/delete", async (req, res) => {
  try {
    const { id, empsl_emply, empsl_slcat } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `DELETE FROM tmhb_empsl
    WHERE id = $1`;
    const params = [id];

    await dbRun(sql, params, `Delete salary for ${empsl_slcat}`);

    updateEmpSalary(empsl_emply);
    res.json({
      success: true,
      message: "Salary deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: null,
    });
  }
});

//update count of business items
const updateEmpSalary = async (id) => {
  const sql = `UPDATE tmhb_emply e
SET emply_gssal = q.total
FROM (
    SELECT 
        psl.empsl_emply,
        SUM(psl.empsl_cramt) - SUM(psl.empsl_dbamt) AS total
    FROM tmhb_empsl psl
    GROUP BY psl.empsl_emply
) q
WHERE e.id = q.empsl_emply
AND e.id = $1`;
  const params = [id];

  await dbRun(sql, params, `Update salary for ${id}`);
};

module.exports = router;
