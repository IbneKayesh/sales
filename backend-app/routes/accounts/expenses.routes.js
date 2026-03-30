const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");

// get all
router.post("/", async (req, res) => {
  try {
    const {
      exptr_users,
      exptr_bsins,
      exptr_exctg,
      exptr_trdat,
      exptr_trnte,
      search_option,
    } = req.body;

    // Validate input
    if (!exptr_users || !exptr_bsins) {
      return res.json({
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    //database action
    let sql = `SELECT ptr.*, 0 as edit_stop, exctg.exctg_cname
      FROM tmtb_exptr ptr
      LEFT JOIN tmtb_exctg exctg ON ptr.exptr_exctg = exctg.id
      WHERE ptr.exptr_users = $1
      AND ptr.exptr_bsins = $2`;
    let params = [exptr_users, exptr_bsins];

    // Optional filters
    if (exptr_exctg) {
      params.push(`%${exptr_exctg}%`);
      sql += ` AND exctg.exctg_cname ILIKE $${params.length}`;
    }

    //console.log("params", minvc_trdat);
    if (exptr_trdat) {
      const dateObj = new Date(exptr_trdat);
      const formattedDate =
        dateObj.getFullYear() +
        "-" +
        String(dateObj.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(dateObj.getDate()).padStart(2, "0");

      // console.log("formattedDate", formattedDate);

      params.push(formattedDate);
      sql += ` AND DATE(ptr.exptr_trdat) = $${params.length}`;
    }

    if (exptr_trnte) {
      params.push(`%${exptr_trnte}%`);
      sql += ` AND ptr.exptr_trnte LIKE $${params.length}`;
    }

    if (search_option) {
      switch (search_option) {
        case "last_3_days":
          sql += ` AND ptr.exptr_trdat >= CURRENT_DATE - INTERVAL '3 days'`;
          break;
        case "last_7_days":
          sql += ` AND ptr.exptr_trdat >= CURRENT_DATE - INTERVAL '7 days'`;
          break;
        case "last_15_days":
          sql += ` AND ptr.exptr_trdat >= CURRENT_DATE - INTERVAL '15 days'`;
          break;
        default:
          sql += ``;
          break;
          ``;
      }
      //params.push(`%${search_option}%`);
    } else if (!search_option && params.length === 2) {
      //default 3 days
      sql += ` AND ptr.exptr_trdat >= CURRENT_DATE - INTERVAL '3 days'`;
    }

    sql += ` ORDER BY ptr.exptr_trdat DESC`;

    //console.log("sql ", req.body);

    const rows = await dbGetAll(sql, params, `Get expenses for ${exptr_bsins}`);
    res.json({
      success: true,
      message: "Expenses fetched successfully",
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
      exptr_users,
      exptr_bsins,
      exptr_exctg,
      exptr_trdat,
      exptr_trnte,
      exptr_examt,
      muser_id,
      suser_id,
    } = req.body;

    // Validate input
    if (!id || !exptr_exctg || !exptr_trdat || !exptr_trnte || !exptr_examt) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `INSERT INTO tmtb_exptr
    (id,exptr_users,exptr_bsins,exptr_exctg,exptr_trdat,exptr_trnte,exptr_examt,
    exptr_crusr,exptr_upusr)
    VALUES ($1,$2,$3,$4,$5,$6,$7,
    $8,$9)`;
    const params = [
      id,
      exptr_users,
      exptr_bsins,
      exptr_exctg,
      exptr_trdat,
      exptr_trnte,
      exptr_examt,
      suser_id,
      suser_id,
    ];

    await dbRun(sql, params, `Create expenses for ${exptr_bsins}`);
    res.json({
      success: true,
      message: "Expenses created successfully",
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
  try {
    const {
      id,
      exptr_users,
      exptr_bsins,
      exptr_exctg,
      exptr_trdat,
      exptr_trnte,
      exptr_examt,
      muser_id,
      suser_id,
    } = req.body;

    // Validate input
    if (!id || !exptr_exctg || !exptr_trdat || !exptr_trnte || !exptr_examt) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmtb_exptr
    SET exptr_exctg = $1,
    exptr_trdat = $2,
    exptr_trnte = $3,
    exptr_examt = $4,
    exptr_upusr = $5,
    exptr_updat = CURRENT_TIMESTAMP,
    exptr_rvnmr = exptr_rvnmr + 1
    WHERE id = $6`;
    const params = [
      exptr_exctg,
      exptr_trdat,
      exptr_trnte,
      exptr_examt,
      suser_id,
      id,
    ];

    await dbRun(sql, params, `Update expenses for ${exptr_bsins}`);
    res.json({
      success: true,
      message: "Expenses updated successfully",
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
    const { id, muser_id, suser_id } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "Expenses ID is required",
        data: null,
      });
    }

    //database action

    const sql = `DELETE FROM tmtb_exptr
    WHERE id = $1`;
    const params = [id];

    await dbRun(sql, params, `Delete expenses for ${muser_id}`);
    res.json({
      success: true,
      message: "Expenses deleted successfully",
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

module.exports = router;
