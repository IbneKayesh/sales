const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const { GenNewCode } = require("../../db/genHelper");

// get-by-item
router.post("/get-by-item", async (req, res) => {
  try {
    const { itmct_items, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!itmct_items || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT itm.*, cnt.cntct_cname
FROM tmib_itmct itm
JOIN tmcb_cntct cnt ON itm.itmct_cntct = cnt.id
WHERE itm.itmct_items = $1
ORDER BY cnt.cntct_cname`;

    const params = [itmct_items];
    const rows = await dbGetAll(sql, params, `get itmct- ${itmct_items}`);
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
      itmct_users,
      itmct_bsins,
      itmct_ccode,
      itmct_items,
      itmct_cntct,
      cntct_cname,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (!itmct_items || !itmct_cntct || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const newCode = await GenNewCode(user_c, "tmib_itmct");

    const sql = `INSERT INTO tmib_itmct(id, itmct_users, itmct_bsins, itmct_ccode, itmct_items, itmct_cntct, itmct_crusr, itmct_upusr)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
    const params = [
      uuidv4(),
      user_c,
      user_b,
      newCode,
      itmct_items,
      itmct_cntct,
      user_s,
      user_s,
    ];

    await dbRun(sql, params, `create item contact- ${user_c}`);
    res.json({
      success: true,
      message: `${cntct_cname} - Created successfully.`,
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
    const { id, cntct_cname, itmct_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !cntct_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmib_itmct
    SET itmct_actve = NOT itmct_actve,
    itmct_upusr = $1,
    itmct_updat = CURRENT_TIMESTAMP,
    itmct_rvnmr = itmct_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete itmct- ${user_c}`);
    res.json({
      success: true,
      message: `${cntct_cname} - ${itmct_actve ? "Deactivate" : "Activate"} successfully.`,
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
