const express = require("express");
const router = express.Router();
const { dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const { GenNewCode, GenNewTrn } = require("../../db/genHelper");

// =====================
// Get All
// =====================
router.post("/", async (req, res) => {
  try {
    const { user_s, user_c, user_b } = req.body;

    if (!user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    const sql = `SELECT bm.*, dpt.dpart_cname, pdt.prods_cname, unt.units_cname,
             csr.emply_cname AS crusr_cname,
             usr.emply_cname AS upusr_cname,
             0 AS edit_stop
      FROM tmmb_bommf bm
	    JOIN tmsb_dpart dpt ON bm.bommf_dpart = dpt.id
	    JOIN tmmb_prods pdt ON bm.bommf_prods = pdt.id
      JOIN tmib_units unt ON bm.bommf_units = unt.id
      LEFT JOIN tmhb_emply csr ON bm.bommf_crusr = csr.id
      LEFT JOIN tmhb_emply usr ON bm.bommf_upusr = usr.id
      WHERE bm.bommf_users = $1
      ORDER BY bm.bommf_cname;`

    const rows = await dbGetAll(sql, [user_c], `Get BOM - ${user_c}`);

    res.json({
      success: true,
      message: "Query executed successfully.",
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: [],
    });
  }
});

// =====================
// Get Active
// =====================
router.post("/get-all-active", async (req, res) => {
  try {
    const { user_c } = req.body;

    if (!user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    const sql = `
      SELECT pd.*,0 AS edit_stop
      FROM tmmb_prods pd
      WHERE pd.prods_users = $1
      AND pd.prods_actve = TRUE
      ORDER BY pd.prods_cname ASC`;

    const rows = await dbGetAll(
      sql,
      [user_c],
      `Get Active Production - ${user_c}`,
    );

    res.json({
      success: true,
      message: "Query executed successfully.",
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: [],
    });
  }
});

// =====================
// Create
// =====================
const create = async (req, res) => {
  try {
    const {
      id,
      bommf_users,
      bommf_bsins,
      bommf_ccode,
      bommf_dpart,
      bommf_prods,
      bommf_trnno,
      bommf_trdat,
      bommf_cname,
      bommf_prono,
      bommf_inout,
      bommf_units,
      bommf_bmqty,
      bommf_bmval,
      bommf_frdat,
      bommf_todat,
      bommf_estim,
      bommf_notes,
      user_s,
      user_c,
      user_b,
      tmmb_borpm,
      tmmb_bofoh,
      tmmb_bosfg,
    } = req.body;

    if (
      !bommf_dpart ||
      !bommf_prods ||
      !bommf_cname ||
      !bommf_prono ||
      !bommf_inout ||
      !bommf_units ||
      !bommf_bmqty ||
      !bommf_frdat ||
      !bommf_todat ||
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

    const newId = uuidv4();
    const newCode = await GenNewCode(user_c, "tmmb_bommf");
    const newTrnNo = await GenNewTrn(
      user_c,
      user_b,
      "tmmb_bommf",
      "BOM",
      bommf_dpart,
    );
    //build scripts
    const scripts = [];
    scripts.push({
      sql: `INSERT INTO tmmb_bommf(id, bommf_users, bommf_bsins, bommf_ccode, bommf_dpart, bommf_prods,
    bommf_trnno, bommf_cname, bommf_prono, bommf_inout, bommf_units, 
    bommf_bmqty, bommf_bmval, bommf_frdat, bommf_todat, bommf_estim, bommf_notes, 
    bommf_crusr, bommf_upusr)
      VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12,
      $13, $14, $15, $16, $17, $18,
      $19)`,
      params: [
        newId,
        user_c,
        user_b,
        newCode,
        bommf_dpart,
        bommf_prods,
        newTrnNo,
        bommf_cname,
        bommf_prono,
        bommf_inout,
        bommf_units,
        bommf_bmqty,
        bommf_bmval,
        bommf_frdat,
        bommf_todat,
        bommf_estim,
        bommf_notes,
        user_s,
        user_s,
      ],
      label: `Created BOM ${newTrnNo}`,
    });
    //Insert RM PM details
    for (const det of tmmb_borpm) {
      scripts.push({
        sql: `INSERT INTO tmmb_borpm(id, borpm_users, borpm_bsins, borpm_bommf, borpm_items, borpm_units,
        borpm_types, borpm_rmqty, borpm_rmrto, borpm_rmrat, borpm_rmval, borpm_notes,
        borpm_crusr, borpm_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14)`,
        params: [
          uuidv4(),
          user_c,
          user_b,
          newId,
          det.borpm_items,
          det.borpm_units,
          det.borpm_types,
          det.borpm_rmqty || 0,
          det.borpm_rmrto || 0,
          det.borpm_rmrat || 0,
          det.borpm_rmval || 0,
          det.borpm_notes || "",
          user_s,
          user_s,
        ],
        label: `Created RM/PM detail ${newTrnNo}`,
      });
    }
    //Insert FOH details
    for (const det of tmmb_bofoh) {
      scripts.push({
        sql: `INSERT INTO tmmb_bofoh(id, bofoh_users, bofoh_bsins, bofoh_bommf, bofoh_items, bofoh_units, 
        bofoh_types, bofoh_foqty, bofoh_forto, bofoh_forat, bofoh_foval, bofoh_notes, 
        bofoh_crusr, bofoh_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14)`,
        params: [
          uuidv4(),
          user_c,
          user_b,
          newId,
          det.bofoh_items,
          det.bofoh_units,
          det.bofoh_types,
          det.bofoh_foqty || 0,
          det.bofoh_forto || 0,
          det.bofoh_forat || 0,
          det.bofoh_foval || 0,
          det.bofoh_notes || "",
          user_s,
          user_s,
        ],
        label: `Created FOH detail ${newTrnNo}`,
      });
    }
    //Insert SFG/FG details
    for (const det of tmmb_bosfg) {
      scripts.push({
        sql: `INSERT INTO tmmb_bosfg(id, bosfg_users, bosfg_bsins, bosfg_bommf, bosfg_items, bosfg_units, 
        bosfg_types, bosfg_group, bosfg_fgqty, bosfg_fgrto, bosfg_fgrat, bosfg_fgval, 
        bosfg_notes, bosfg_crusr, bosfg_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14, $15)`,
        params: [
          uuidv4(),
          user_c,
          user_b,
          newId,
          det.bosfg_items,
          det.bosfg_units,
          det.bosfg_types,
          det.bosfg_group,
          det.bosfg_fgqty || 0,
          det.bosfg_fgrto || 0,
          det.bosfg_fgrat || 0,
          det.bosfg_fgval || 0,
          det.bosfg_notes || "",
          user_s,
          user_s,
        ],
        label: `Created SFG/FG detail ${newTrnNo}`,
      });
    }

    await dbRunAll(scripts);

    res.json({
      success: true,
      message: "BOM created successfully",
      data: {
        ...req.body,
        bommf_trnno: newTrnNo,
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
};

// =====================
// Update
// =====================
const update = async (req, res) => {
  try {
    const {
      id,
      bommf_users,
      bommf_bsins,
      bommf_ccode,
      bommf_dpart,
      bommf_prods,
      bommf_trnno,
      bommf_trdat,
      bommf_cname,
      bommf_prono,
      bommf_inout,
      bommf_units,
      bommf_bmqty,
      bommf_bmval,
      bommf_frdat,
      bommf_todat,
      bommf_estim,
      bommf_notes,
      user_s,
      user_c,
      user_b,
      tmmb_borpm,
      tmmb_bofoh,
      tmmb_bosfg,
    } = req.body;

    if (
      !bommf_dpart ||
      !bommf_prods ||
      !bommf_cname ||
      !bommf_prono ||
      !bommf_inout ||
      !bommf_units ||
      !bommf_bmqty ||
      !bommf_frdat ||
      !bommf_todat ||
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

    const sql = `
      UPDATE tmmb_prods
      SET
        prods_cname = $1,
        prods_prono = $2,
        prods_upusr = $3,
        prods_updat = CURRENT_TIMESTAMP,
        prods_rvnmr = prods_rvnmr + 1
      WHERE id = $4`;

    const params = [bommf_units, bommf_units, user_s, id];

    await dbRun(sql, params, `Update Production - ${user_c}`);

    res.json({
      success: true,
      message: `${bommf_units} - Updated successfully.`,
      data: {},
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: {},
    });
  }
};

// =====================
// Upsert
// =====================
router.post("/upsert", async (req, res) => {
  if (req.body.id) {
    return update(req, res);
  }
  return create(req, res);
});

// =====================
// Create
// =====================
router.post("/create", create);

// =====================
// Update
// =====================
router.post("/update", update);

// =====================
// Activate / Deactivate
// =====================
router.post("/delete", async (req, res) => {
  try {
    const { id, bommf_cname, bommf_actve, user_s, user_c, user_b } = req.body;

    if (!id || !bommf_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    const sql = `
      UPDATE tmmb_bommf
      SET
        bommf_actve = NOT bommf_actve,
        bommf_upusr = $1,
        bommf_updat = CURRENT_TIMESTAMP,
        bommf_rvnmr = bommf_rvnmr + 1
      WHERE id = $2`;

    await dbRun(sql, [user_s, id], `Delete BOM - ${user_c}`);

    res.json({
      success: true,
      message: `${bommf_cname} - ${
        bommf_actve ? "Deactivate" : "Activate"
      } successfully.`,
      data: {},
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: {},
    });
  }
});

// =====================
// Get get-rmpm-by-bom
// =====================
router.post("/get-rmpm-by-bom", async (req, res) => {
  try {
    const { borpm_bommf, user_c } = req.body;

    if (!borpm_bommf || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    const sql = `SELECT rpm.*,
  itm.items_iname, unt.units_cname
  FROM tmmb_borpm rpm
  JOIN tmib_items itm ON rpm.borpm_items = itm.id
  JOIN tmib_units unt ON rpm.borpm_units = unt.id
  WHERE rpm.borpm_bommf = $1
  AND rpm.borpm_users = $2
  ORDER BY rpm.borpm_items ASC`;

    const rows = await dbGetAll(
      sql,
      [borpm_bommf, user_c],
      `Get RM/PM by BOM - ${user_c}`,
    );

    res.json({
      success: true,
      message: "Query executed successfully.",
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: [],
    });
  }
});

// =====================
// Get get-foh-by-bom
// =====================
router.post("/get-foh-by-bom", async (req, res) => {
  try {
    const { bofoh_bommf, user_c } = req.body;

    if (!bofoh_bommf || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    const sql = `SELECT foh.*,
itm.items_iname, unt.units_cname
FROM tmmb_bofoh foh
JOIN tmib_items itm ON foh.bofoh_items = itm.id
JOIN tmib_units unt ON foh.bofoh_units = unt.id
  WHERE foh.bofoh_bommf = $1
  AND foh.bofoh_users = $2
  ORDER BY foh.bofoh_items ASC`;

    const rows = await dbGetAll(
      sql,
      [bofoh_bommf, user_c],
      `Get FOH by BOM - ${user_c}`,
    );

    res.json({
      success: true,
      message: "Query executed successfully.",
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: [],
    });
  }
});


// =====================
// Get get-sfg-by-bom
// =====================
router.post("/get-sfg-by-bom", async (req, res) => {
  try {
    const { bosfg_bommf, user_c } = req.body;

    if (!bosfg_bommf || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    const sql = `SELECT sfg.*,
itm.items_iname, unt.units_cname
FROM tmmb_bosfg sfg
JOIN tmib_items itm ON sfg.bosfg_items = itm.id
JOIN tmib_units unt ON sfg.bosfg_units = unt.id
  WHERE sfg.bosfg_bommf = $1
  AND sfg.bosfg_users = $2
  ORDER BY sfg.bosfg_items ASC`;

    const rows = await dbGetAll(
      sql,
      [bosfg_bommf, user_c],
      `Get SFG/FG by BOM - ${user_c}`,
    );

    res.json({
      success: true,
      message: "Query executed successfully.",
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: error.message || "An error occurred during db action",
      data: [],
    });
  }
});

module.exports = router;
