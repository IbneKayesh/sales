const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const { GenNewCode } = require("../../db/genHelper");

// get-by-item
router.post("/get-by-item", async (req, res) => {
  try {
    const { itmtx_items, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!itmtx_items || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT itx.*, tax.txcod_txtyp, tax.txcod_txmod, tax.txcod_txrat, tax.txcod_trcod
FROM tmib_itmtx itx
JOIN tmib_txcod tax ON itx.itmtx_txcod = tax.id
WHERE itx.itmtx_items = $1
ORDER BY tax.txcod_trcod`;

    const params = [itmtx_items];
    const rows = await dbGetAll(sql, params, `get itmtx- ${itmtx_items}`);
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

const create = async (req, res) => {
  try {
    const {
      id,
      itmtx_users,
      itmtx_bsins,
      itmtx_items,
      itmtx_txcod,
      txcod_txtyp,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !itmtx_items ||
      !itmtx_txcod ||
      !txcod_txtyp ||
      !user_s ||
      !user_c ||
      !user_b
    ) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql_1 =
      "SELECT * FROM tmib_itmtx WHERE itmtx_items = $1 AND itmtx_txcod = $2";
    const params_1 = [itmtx_items, itmtx_txcod];
    const rows_1 = await dbGetAll(sql_1, params_1, "Validate item Tax");
    if (rows_1.length > 0) {
      return res.json({
        success: false,
        message: "Tax already exists.",
        data: [],
      });
    }

    const newCode = await GenNewCode(user_c, "tmib_itmtx");

    const sql = `INSERT INTO tmib_itmtx(id, itmtx_users, itmtx_bsins, itmtx_ccode, itmtx_items, itmtx_txcod, itmtx_crusr, itmtx_upusr)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
    const params = [
      uuidv4(),
      user_c,
      user_b,
      newCode,
      itmtx_items,
      itmtx_txcod,
      user_s,
      user_s,
    ];

    await dbRun(sql, params, `create item tax- ${user_c}`);
    res.json({
      success: true,
      message: `${txcod_txtyp} - Created successfully.`,
      data: {},
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: {},
    });
  }
};

// create
router.post("/create", create);

// delete
router.post("/delete", async (req, res) => {
  try {
    const { id, txcod_txtyp, itmtx_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !txcod_txtyp || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmib_itmtx
    SET itmtx_actve = NOT itmtx_actve,
    itmtx_upusr = $1,
    itmtx_updat = CURRENT_TIMESTAMP,
    itmtx_rvnmr = itmtx_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete itmtx- ${user_c}`);
    res.json({
      success: true,
      message: `${txcod_txtyp} - ${itmtx_actve ? "Deactivate" : "Activate"} successfully.`,
      data: {},
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: {},
    });
  }
});

// create-category
router.post("/create-category", async (req, res) => {
  try {
    return res.json({
      success: false,
      message: `Not Yet Implemented`,
      data: {},
    });

    const {
      id,
      itmtx_users,
      itmtx_bsins,
      itmtx_items,
      itmtx_txcod,
      txcod_txtyp,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !itmtx_items ||
      !itmtx_txcod ||
      !txcod_txtyp ||
      !user_s ||
      !user_c ||
      !user_b
    ) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmib_itmtx
    SET itmtx_actve = NOT itmtx_actve,
    itmtx_upusr = $1,
    itmtx_updat = CURRENT_TIMESTAMP,
    itmtx_rvnmr = itmtx_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete itmtx- ${user_c}`);
    res.json({
      success: true,
      message: `${txcod_txtyp} - ${itmtx_actve ? "Deactivate" : "Activate"} successfully.`,
      data: {},
    });
  } catch (error) {
    console.error("database action error:", error);
    return res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: {},
    });
  }
});

module.exports = router;
