const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const { GenNewCode } = require("../../db/genTableCode");

// get all
router.post("/", async (req, res) => {
  try {
    const { user_s, user_c, user_b } = req.body;

    // Validate input
    if (!user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT prty.*,
    csr.users_uname AS crusr_cname, usr.users_uname AS upusr_cname, 0 as edit_stop
    FROM tmtb_party prty
    LEFT JOIN tmnb_users csr ON prty.party_crusr = csr.id
    LEFT JOIN tmnb_users usr ON prty.party_upusr = usr.id
    WHERE prty.party_apusr = $1
    ORDER BY prty.party_chtrc ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get party accounts- ${user_c}`);
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

// get-all-active
router.post("/get-all-active", async (req, res) => {
  try {
    const { user_s, user_c, user_b } = req.body;

    // Validate input
    if (!user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT prty.*, 0 as edit_stop
    FROM tmtb_party prty
    WHERE prty.party_apusr = $1
    AND prty.party_actve = TRUE
    ORDER BY prty.party_chtrc ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get party accounts- ${user_c}`);
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
      party_apusr,
      party_bsins,
      party_ptype,
      party_vndor,
      party_pcode,
      party_pname,
      party_chtrc,
      party_chtpy,
      party_chtad,
      party_opbal,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !party_ptype ||
      !party_vndor ||
      !party_pname ||
      !party_chtrc ||
      !party_chtpy ||
      !party_chtad ||
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
    const newCode = await GenNewCode(user_c, "tmtb_party");

    const sql = `INSERT INTO tmtb_party(id, party_apusr, party_bsins, party_ptype, party_vndor, party_pcode,
    party_pname, party_chtrc, party_chtpy, party_chtad, party_opbal, party_crusr, party_upusr)
    VALUES ($1, $2, $3, $4, $5, $6,
    $7, $8, $9, $10, $11, $12, $13)`;
    const params = [
      uuidv4(),
      user_c,
      user_b,
      party_ptype,
      party_vndor,
      newCode,
      party_pname,
      party_chtrc,
      party_chtpy,
      party_chtad,
      party_opbal,
      user_s,
      user_s,
    ];

    //console.log("params", params);

    await dbRun(sql, params, `create party accounts- ${user_c}`);
    res.json({
      success: true,
      message: `${party_pname} - Created successfully.`,
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

const update = async (req, res) => {
  try {
    const {
      id,
      party_apusr,
      party_bsins,
      party_ptype,
      party_vndor,
      party_pcode,
      party_pname,
      party_chtrc,
      party_chtpy,
      party_chtad,
      party_opbal,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !party_ptype ||
      !party_vndor ||
      !party_pname ||
      !party_chtrc ||
      !party_chtpy ||
      !party_chtad ||
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
    const sql = `UPDATE tmtb_party
    SET party_ptype = $1,
    party_vndor = $2,
    party_pname = $3,
    party_chtrc = $4,
    party_chtpy = $5,
    party_chtad = $6,
    party_opbal = $7,
    party_upusr = $8,
    party_updat = CURRENT_TIMESTAMP,
    party_rvnmr = party_rvnmr + 1
    WHERE id = $9`;
    const params = [
      party_ptype,
      party_vndor,
      party_pname,
      party_chtrc,
      party_chtpy,
      party_chtad,
      party_opbal,
      user_s,
      id,
    ];

    await dbRun(sql, params, `update party accounts- ${user_c}`);
    res.json({
      success: true,
      message: `${party_pname} - Updated successfully.`,
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

// upsert — dispatches to create or update based on presence of id
router.post("/upsert", async (req, res) => {
  const { id } = req.body;
  if (id) {
    return update(req, res);
  } else {
    return create(req, res);
  }
});

// create
router.post("/create", create);

// update
router.post("/update", update);

// delete
router.post("/delete", async (req, res) => {
  try {
    const { id, party_pname, party_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !party_pname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmtb_party
    SET party_actve = NOT party_actve,
    party_upusr = $1,
    party_updat = CURRENT_TIMESTAMP,
    party_rvnmr = party_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete party accounts- ${user_c}`);
    res.json({
      success: true,
      message: `${party_pname} - ${party_actve ? "Deactivate" : "Activate"} successfully.`,
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
