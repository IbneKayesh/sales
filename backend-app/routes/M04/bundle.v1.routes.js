const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const { GenNewCode } = require("../../db/genHelper");

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
    const sql = `SELECT bdm.*, dpt.dpart_cname, prc.price_cname,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmib_bndlm bdm
    JOIN tmsb_dpart dpt ON bdm.bndlm_dpart = dpt.id
    JOIN tmib_price prc ON bdm.bndlm_price = prc.id
    LEFT JOIN tmhb_emply csr ON bdm.bndlm_crusr = csr.id
    LEFT JOIN tmhb_emply usr ON bdm.bndlm_upusr = usr.id
    WHERE bdm.bndlm_users = $1
    ORDER BY bdm.bndlm_dpart, bdm.bndlm_cname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get bndlm- ${user_c}`);
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
    const sql = `SELECT bdm.*, 0 as edit_stop
    FROM tmib_bndlm bdm
    WHERE bdm.bndlm_users = $1
    AND bdm.bndlm_actve = TRUE
    ORDER BY bdm.bndlm_untgr, bdm.bndlm_cname ASC`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `get bndlm- ${user_c}`);
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
      bndlm_users,
      bndlm_bsins,
      bndlm_ccode,
      bndlm_dpart,
      bndlm_cname,
      bndlm_itype,
      bndlm_items,
      bndlm_price,
      bndlm_itqty,
      bndlm_itrat,
      tmib_bndlc,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !bndlm_dpart ||
      !bndlm_cname ||
      !bndlm_itype ||
      !bndlm_items ||
      !bndlm_price ||
      !bndlm_itqty ||
      !tmib_bndlc ||
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
    const newId = uuidv4();
    const newCode = await GenNewCode(user_c, "tmib_bndlm");

    //build scripts
    const scripts = [];
    scripts.push({
      sql: `INSERT INTO tmib_bndlm(id, bndlm_users, bndlm_bsins, bndlm_ccode, bndlm_dpart, bndlm_cname,
                              bndlm_itype, bndlm_items, bndlm_price, bndlm_itqty, bndlm_itrat, bndlm_crusr,
                              bndlm_upusr)
    VALUES ($1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10, $11, $12,
          $13)`,
      params: [
        newId,
        user_c,
        user_b,
        newCode,
        bndlm_dpart,
        bndlm_cname,
        bndlm_itype,
        bndlm_items,
        bndlm_price,
        bndlm_itqty,
        bndlm_itrat,
        user_s,
        user_s,
      ],

      label: `Created bundle ${newCode}`,
    });
    for (const det of tmib_bndlc) {
      const lineId = uuidv4();
      scripts.push({
        sql: `INSERT INTO tmib_bndlc(id, bndlc_users, bndlc_bsins, bndlc_bndlm, bndlc_items, bndlc_price,
                          bndlc_itqty, bndlc_itrat, bndlc_crusr, bndlc_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10)`,
        params: [
          lineId,
          user_c,
          user_b,
          newId,
          det.bndlc_items,
          det.bndlc_price,
          det.bndlc_itqty || 0,
          det.bndlc_itrat || 0,
          user_s,
          user_s,
        ],
        label: `Created bundle detail ${newCode}`,
      });
    }
    await dbRunAll(scripts);

    res.json({
      success: true,
      message: "Bundle created successfully",
      data: {
        ...req.body,
        bndlm_ccode: newCode,
      },
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
      bndlm_users,
      bndlm_bsins,
      bndlm_ccode,
      bndlm_dpart,
      bndlm_cname,
      bndlm_itype,
      bndlm_items,
      bndlm_price,
      bndlm_itqty,
      bndlm_itrat,
      user_s,
      user_c,
      user_b,
    } = req.body;

    // Validate input
    if (
      !bndlm_dpart ||
      !bndlm_cname ||
      !bndlm_itype ||
      !bndlm_items ||
      !bndlm_price ||
      !bndlm_itqty ||
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
    const sql = `UPDATE tmib_bndlm
    SET bndlm_cname = $1,
    bndlm_itype = $2,
    bndlm_itqty = $3,
    bndlm_itrat = $4,
    bndlm_upusr = $5,
    bndlm_updat = CURRENT_TIMESTAMP,
    bndlm_rvnmr = bndlm_rvnmr + 1
    WHERE id = $6`;
    const params = [
      bndlm_cname,
      bndlm_itype,
      bndlm_itqty,
      bndlm_itrat,
      user_s,
      id,
    ];

    await dbRun(sql, params, `update bndlm- ${user_c}`);
    res.json({
      success: true,
      message: `${bndlm_cname} - Updated successfully.`,
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
    const { id, bndlm_cname, bndlm_actve, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!id || !bndlm_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const sql = `UPDATE tmib_bndlm
    SET bndlm_actve = NOT bndlm_actve,
    bndlm_upusr = $1,
    bndlm_updat = CURRENT_TIMESTAMP,
    bndlm_rvnmr = bndlm_rvnmr + 1
    WHERE id = $2`;
    const params = [user_s, id];

    await dbRun(sql, params, `delete bndlm- ${user_c}`);
    res.json({
      success: true,
      message: `${bndlm_cname} - ${bndlm_actve ? "Deactivate" : "Activate"} successfully.`,
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
