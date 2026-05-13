const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const { GenNewCode } = require("../../db/genHelper");

// get-trial-balance
router.post("/get-trial-balance", async (req, res) => {
  try {
    const { mjrnl_dpart, mjrnl_fsyar, mjrnl_acprd, user_s, user_c, user_b } =
      req.body;

    // Validate input
    if (!mjrnl_dpart || !mjrnl_fsyar || !mjrnl_acprd || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT cht.chtac_ctype, cht.chtac_cname,
    SUM(djr.djrnl_drval)dr, SUM(djr.djrnl_crval)cr
    from tmtb_djrnl djr
    JOIN tmtb_mjrnl mjr ON djr.djrnl_mjrnl = mjr.id
    JOIN tmtb_chtac cht ON djr.djrnl_chtac = cht.id
    WHERE mjr.mjrnl_apusr = $1
    AND mjr.mjrnl_bsins = $2
    AND mjr.mjrnl_dpart = $3
    AND mjr.mjrnl_fsyar = $4
    AND mjr.mjrnl_acprd = $5
    GROUP BY cht.chtac_ctype, cht.chtac_cname
    ORDER BY cht.chtac_ctype, cht.chtac_cname`;

    const params = [user_c, user_b, mjrnl_dpart, mjrnl_fsyar, mjrnl_acprd];
    const rows = await dbGetAll(sql, params, `get trial balance- ${user_c}`);
    res.json({
      success: true,
      message: "Query executed successfully.",
      data: rows,
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: [],
    });
  }
});

// get-pnl
router.post("/get-pnl", async (req, res) => {
  try {
    const { mjrnl_dpart, mjrnl_fsyar, mjrnl_acprd, user_s, user_c, user_b } =
      req.body;

    // Validate input
    if (!mjrnl_dpart || !mjrnl_fsyar || !mjrnl_acprd || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT cht.chtac_ctype, cht.chtac_cname,
    SUM(djr.djrnl_drval)dr, SUM(djr.djrnl_crval)cr
    from tmtb_djrnl djr
    JOIN tmtb_mjrnl mjr ON djr.djrnl_mjrnl = mjr.id
    JOIN tmtb_chtac cht ON djr.djrnl_chtac = cht.id
    WHERE mjr.mjrnl_apusr = $1
    AND mjr.mjrnl_bsins = $2
    AND mjr.mjrnl_dpart = $3
    AND mjr.mjrnl_fsyar = $4
    AND mjr.mjrnl_acprd = $5
    AND cht.chtac_ctype IN ('Income','Expense')
    GROUP BY cht.chtac_ctype, cht.chtac_cname
    ORDER BY cht.chtac_ctype, cht.chtac_cname`;

    const params = [user_c, user_b, mjrnl_dpart, mjrnl_fsyar, mjrnl_acprd];
    const rows = await dbGetAll(sql, params, `get pnl- ${user_c}`);
    res.json({
      success: true,
      message: "Query executed successfully.",
      data: rows,
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: [],
    });
  }
});

//get-ledger-data
router.post("/get-ledger-data", async (req, res) => {
  try {
    const { mjrnl_dpart, mjrnl_fsyar, mjrnl_acprd, user_s, user_c, user_b } =
      req.body;

    // Validate input
    if (!mjrnl_dpart || !mjrnl_fsyar || !mjrnl_acprd || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT cht.chtac_ctype, cht.chtac_cname,
    SUM(djr.djrnl_drval)dr, SUM(djr.djrnl_crval)cr
    from tmtb_djrnl djr
    JOIN tmtb_mjrnl mjr ON djr.djrnl_mjrnl = mjr.id
    JOIN tmtb_chtac cht ON djr.djrnl_chtac = cht.id
    WHERE mjr.mjrnl_apusr = $1
    AND mjr.mjrnl_bsins = $2
    AND mjr.mjrnl_dpart = $3
    AND mjr.mjrnl_fsyar = $4
    AND mjr.mjrnl_acprd = $5
    GROUP BY cht.chtac_ctype, cht.chtac_cname
    ORDER BY cht.chtac_ctype, cht.chtac_cname`;

    const params = [user_c, user_b, mjrnl_dpart, mjrnl_fsyar, mjrnl_acprd];
    const rows = await dbGetAll(sql, params, `get pnl- ${user_c}`);
    res.json({
      success: true,
      message: "Query executed successfully.",
      data: rows,
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: [],
    });
  }
});
module.exports = router;
