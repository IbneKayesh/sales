const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");

// get-by-item
router.post("/get-by-item", async (req, res) => {
  try {
    const { frmla_users, frmla_mitem } = req.body;

    // Validate input
    if (!frmla_users || !frmla_mitem) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT ing.*,
      mtm.items_icode AS mitem_icode,
      mtm.items_iname AS mitem_iname,
      stm.items_icode AS sitem_icode,
      stm.items_iname AS sitem_iname,
      snt.iuofm_untnm AS sitem_untnm	
    FROM tmib_frmla ing
    JOIN tmib_items mtm ON ing.frmla_mitem = mtm.id
    JOIN tmib_items stm ON ing.frmla_sitem = stm.id
    JOIN tmib_iuofm snt ON stm.items_puofm = snt.id
    WHERE ing.frmla_users = $1
    AND ing.frmla_mitem = $2`;
    const params = [frmla_users, frmla_mitem];

    const rows = await dbGetAll(sql, params, `Get recipe for ${frmla_mitem}`);
    res.json({
      success: true,
      message: "Recipe fetched successfully",
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
      frmla_users,
      frmla_mitem,
      frmla_mtmqt,
      frmla_sitem,
      frmla_stmqt,
      frmla_costp,
      frmla_inote,
      muser_id,
      suser_id,
    } = req.body;

    // Validate input
    if (!id || !frmla_mitem || !frmla_sitem || !muser_id) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql_val_1 = `SELECT *
    FROM tmib_frmla
    WHERE frmla_mitem = $1
    AND frmla_sitem = $2`;
    const params_val_1 = [frmla_mitem, frmla_sitem];
    const val_1 = await dbGet(sql_val_1, params_val_1);

    if (val_1) {
      return res.json({
        success: false,
        message: "Already exists",
        data: null,
      });
    }

    const sql = `INSERT INTO tmib_frmla
    (id,frmla_users,frmla_mitem,frmla_mtmqt,
    frmla_sitem,frmla_stmqt,frmla_costp,frmla_inote,
    frmla_crusr,frmla_upusr)
    VALUES ($1,$2,$3,$4,
    $5,$6,$7,$8,
    $9,$10)`;
    const params = [
      id,
      muser_id,
      frmla_mitem,
      frmla_mtmqt,
      frmla_sitem,
      frmla_stmqt,
      frmla_costp,
      frmla_inote,
      suser_id,
      suser_id,
    ];

    await dbRun(sql, params, `Create formula for ${frmla_mitem}`);
    res.json({
      success: true,
      message: "Formula created successfully",
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
    return res.json({
      success: true,
      message: "Formula updated successfully",
      data: null,
    });

    const { id, muser_id, brand_brnam, suser_id } = req.body;

    // Validate input
    if (!id || !muser_id || !brand_brnam) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `UPDATE tmib_brand
    SET brand_brnam = $1,
    brand_upusr = $2,
    brand_updat = CURRENT_TIMESTAMP,
    brand_rvnmr = brand_rvnmr + 1
    WHERE id = $3`;
    const params = [brand_brnam, suser_id, id];

    await dbRun(sql, params, `Update brand for ${brand_brnam}`);
    res.json({
      success: true,
      message: "Brand updated successfully",
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
    const { id } = req.body;

    // Validate input
    if (!id) {
      return res.json({
        success: false,
        message: "ID is required",
        data: null,
      });
    }

    //database action
    const sql = `DELETE FROM tmib_frmla
    WHERE id = $1`;
    const params = [id];

    await dbRun(sql, params, `Delete formula for ${id}`);
    res.json({
      success: true,
      message: "Formula deleted successfully",
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

// get-by-item
router.post("/get-by-item-convert", async (req, res) => {
  try {
    const { frmla_users, frmla_mitem, bitem_bsins } = req.body;

    // Validate input
    if (!frmla_users || !frmla_mitem) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    const sql = `SELECT ing.frmla_users AS cnstk_users, btm.bitem_bsins AS cnstk_bsins,
ing.frmla_mitem AS cnstk_mitem, ing.frmla_mtmqt AS cnstk_mtmqt, 0 AS cnstk_mstkq,
ing.frmla_sitem AS cnstk_sitem, ing.frmla_stmqt AS cnstk_stmqt,
btm.bitem_gstkq AS cnstk_sstkq, 0 AS cnstk_cnqty,
      mtm.items_icode AS mitem_icode,
      mtm.items_iname AS mitem_iname,
      stm.items_icode AS sitem_icode,
      stm.items_iname AS sitem_iname,
      snt.iuofm_untnm AS sitem_untnm,
      ing.frmla_mtmqt, ing.frmla_stmqt
    FROM tmib_frmla ing
    JOIN tmib_items mtm ON ing.frmla_mitem = mtm.id
    JOIN tmib_items stm ON ing.frmla_sitem = stm.id
    JOIN tmib_iuofm snt ON stm.items_puofm = snt.id
	JOIN tmib_bitem btm ON ing.frmla_users = btm.bitem_users
	AND btm.bitem_items = stm.id
	AND btm.bitem_bsins = $1
	WHERE ing.frmla_users = $2
	AND ing.frmla_mitem = $3`;
    const params = [bitem_bsins, frmla_users, frmla_mitem];

    const rows = await dbGetAll(sql, params, `Get recipe for ${frmla_mitem}`);
    res.json({
      success: true,
      message: "Recipe fetched successfully",
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

//convert-stock
router.post("/convert-stock", async (req, res) => {
  try {
    const { id, muser_id, suser_id, tmib_cnstk } = req.body;
    //console.log("req.body", req.body);

    // Validate input
    if (!id || !muser_id || !suser_id || !tmib_cnstk) {
      return res.json({
        success: false,
        message: "All fields are required",
        data: null,
      });
    }

    //database action
    //build scripts
    const scripts = [];
    for (const det of tmib_cnstk) {
      //create history
      scripts.push({
        sql: `INSERT INTO tmib_cnstk(id, cnstk_users, cnstk_bsins, cnstk_mitem, cnstk_mtmqt, cnstk_mstkq,
        cnstk_sitem, cnstk_stmqt, cnstk_sstkq, cnstk_cnqty, cnstk_crusr, cnstk_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12)`,
        params: [
          uuidv4(),
          det.cnstk_users,
          det.cnstk_bsins,
          det.cnstk_mitem,
          det.cnstk_mtmqt || 0,
          det.cnstk_mstkq || 0,
          det.cnstk_sitem,
          det.cnstk_stmqt || 0,
          det.cnstk_sstkq || 0,
          det.cnstk_cnqty || 0,
          suser_id,
          suser_id,
        ],
        label: `Created stock ${det.cnstk_mitem}`,
      });

      //reduce associate stock
      scripts.push({
        sql: `UPDATE tmib_bitem
      SET bitem_gstkq = bitem_gstkq - $1,
      bitem_upusr = $2,
      bitem_updat = CURRENT_TIMESTAMP,
      bitem_rvnmr = bitem_rvnmr + 1
      WHERE bitem_users = $3
      AND bitem_items = $4
      AND bitem_bsins = $5`,
        params: [
          det.cnstk_stmqt,
          suser_id,
          det.cnstk_users,
          det.cnstk_sitem,
          det.cnstk_bsins,
        ],
        label: `Reduce associate stock ${det.cnstk_sitem}`,
      });
    }

    if (tmib_cnstk.length > 0) {
      const item = tmib_cnstk[0];
      //increase master stock
      scripts.push({
        sql: `UPDATE tmib_bitem
      SET bitem_gstkq = bitem_gstkq + $1,
      bitem_upusr = $2,
      bitem_updat = CURRENT_TIMESTAMP,
      bitem_rvnmr = bitem_rvnmr + 1
      WHERE bitem_users = $3
      AND bitem_items = $4
      AND bitem_bsins = $5`,
        params: [
          item.cnstk_mtmqt,
          suser_id,
          item.cnstk_users,
          item.cnstk_mitem,
          item.cnstk_bsins,
        ],
        label: `Increased master stock ${item.cnstk_mitem}`,
      });
    }

    //console.log("scripts", scripts);


    await dbRunAll(scripts);

    res.json({
      success: true,
      message: "Stock created successfully",
      data: {
        ...req.body,
      },
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
