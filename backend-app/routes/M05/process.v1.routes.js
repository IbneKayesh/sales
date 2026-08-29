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

    const sql = `SELECT pfm.*, dpt.dpart_cname,
      csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 AS edit_stop
      FROM tmmb_promf pfm
	    JOIN tmsb_dpart dpt ON pfm.promf_dpart = dpt.id
      LEFT JOIN tmhb_emply csr ON pfm.promf_crusr = csr.id
      LEFT JOIN tmhb_emply usr ON pfm.promf_upusr = usr.id      
      WHERE pfm.promf_users = $1
      ORDER BY pfm.promf_trdat`;

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
      promf_users,
      promf_bsins,
      promf_ccode,
      promf_dpart,
      promf_bommf,
      promf_bkngm,
      promf_trnno,
      promf_trdat,
      promf_cname,
      promf_prono,
      promf_frdat,
      promf_todat,
      promf_prtim,
      promf_notes,
      user_s,
      user_c,
      user_b,
      tmmb_prrpm,
      tmmb_prfoh,
      tmmb_prsfg,
      tmmb_prbtc,
    } = req.body;

    // Validate input
    if (
      !promf_dpart ||
      !promf_bommf ||
      !promf_trdat ||
      !promf_cname ||
      !promf_prono ||
      !promf_frdat ||
      !promf_todat ||
      !user_s ||
      !user_c ||
      !user_b ||
      !tmmb_prrpm ||
      !tmmb_prfoh ||
      !tmmb_prsfg
    ) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const newId = uuidv4();
    const newCode = await GenNewCode(user_c, "tmmb_promf");
    const newTrnNo = await GenNewTrn(
      user_c,
      user_b,
      "tmmb_promf",
      "Production Process",
      promf_dpart,
    );
    //build scripts
    const scripts = [];
    scripts.push({
      sql: `INSERT INTO tmmb_promf(id, promf_users, promf_bsins, promf_ccode, promf_dpart, promf_bommf,
                        promf_bkngm, promf_trnno, promf_trdat, promf_cname, promf_prono, promf_frdat,
                        promf_todat, promf_prtim, promf_notes, promf_crusr, promf_upusr)
            VALUES ($1, $2, $3, $4, $5, $6,
            $7, $8, $9, $10, $11, $12,
            $13, $14, $15, $16, $17)`,
      params: [
        newId,
        user_c,
        user_b,
        newCode,
        promf_dpart,
        promf_bommf,
        promf_bkngm,
        newTrnNo,
        promf_trdat,
        promf_cname,
        promf_prono,
        promf_frdat,
        promf_todat,
        promf_prtim,
        promf_notes,
        user_s,
        user_s,
      ],
      label: `Created PP ${newTrnNo}`,
    });
    //Insert RM PM details
    for (const det of tmmb_prrpm) {
      scripts.push({
        sql: `INSERT INTO tmmb_prrpm(id, prrpm_users, prrpm_bsins, prrpm_promf, prrpm_borpm, prrpm_items,
                          prrpm_price, prrpm_units, prrpm_itype, prrpm_boqty, prrpm_borat, prrpm_rmqty,
                          prrpm_rmrat, prrpm_rmval, prrpm_notes, prrpm_stock, prrpm_jrnlm, prrpm_crusr,
                          prrpm_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17, $18,
        $19)`,
        params: [
          uuidv4(),
          user_c,
          user_b,
          newId,
          det.prrpm_borpm,
          det.prrpm_items,
          det.prrpm_price,
          det.prrpm_units,
          det.prrpm_itype,
          det.prrpm_boqty || 0,
          det.prrpm_borat || 0,
          det.prrpm_rmqty || 0,
          det.prrpm_rmrat || 0,
          det.prrpm_rmval || 0,
          det.prrpm_notes || "",
          det.prrpm_stock || "",
          det.prrpm_jrnlm || "",
          user_s,
          user_s,
        ],
        label: `Created RM/PM detail ${newTrnNo}`,
      });

      //add condition if no tracking then off
      scripts.push({
        sql: `UPDATE tmib_stock
        SET stock_cnqty = stock_cnqty + $1,
            stock_ohqty = stock_ohqty - $2,
            stock_upusr = $3,
            stock_updat = CURRENT_TIMESTAMP,
            stock_rvnmr = stock_rvnmr + 1
        WHERE id = $4
        AND stock_users = $5
        AND stock_bsins = $6
        AND stock_dpart = $7`,
        params: [
          det.prrpm_rmqty || 0,
          det.prrpm_rmqty || 0,
          user_s,
          det.prrpm_stock || "",
          user_c,
          user_b,
          promf_dpart,
        ],
        label: `Update reduce stock detail ${newTrnNo}`,
      });

      //update summary stock
      scripts.push({
        sql: `UPDATE tmib_price
              SET price_gdstk = price_gdstk - $1,
                  price_upusr = $2,
                  price_updat = CURRENT_TIMESTAMP,
                  price_rvnmr = price_rvnmr + 1
                  WHERE id = $3
                  AND price_users = $4
                  AND price_items = $5`,
        params: [
          det.prrpm_rmqty || 0,
          user_s,
          det.prrpm_price,
          user_c,
          det.prrpm_items,
        ],
        label: `Update reduce price stock detail ${newTrnNo}`,
      });
    }

    //Insert FOH details
    for (const det of tmmb_prfoh) {
      scripts.push({
        sql: `INSERT INTO tmmb_prfoh(id, prfoh_users, prfoh_bsins, prfoh_promf, prfoh_bofoh, prfoh_items,
                          prfoh_price, prfoh_units, prfoh_itype, prfoh_boqty, prfoh_borat, prfoh_foqty,
                          prfoh_forat, prfoh_foval, prfoh_notes, prfoh_stock, prfoh_jrnlm, prfoh_crusr,
                          prfoh_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17, $18,
        $19)`,
        params: [
          uuidv4(),
          user_c,
          user_b,
          newId,
          det.prfoh_bofoh,
          det.prfoh_items,
          det.prfoh_price,
          det.prfoh_units,
          det.prfoh_itype,
          det.prfoh_boqty || 0,
          det.prfoh_borat || 0,
          det.prfoh_foqty || 0,
          det.prfoh_forat || 0,
          det.prfoh_foval || 0,
          det.prfoh_notes || "",
          det.prfoh_stock || "",
          det.prfoh_jrnlm || "",
          user_s,
          user_s,
        ],
        label: `Created FOH detail ${newTrnNo}`,
      });
    }

    //Insert SFG/FG details
    for (const det of tmmb_prsfg) {
      scripts.push({
        sql: `INSERT INTO tmmb_prsfg(id, prsfg_users, prsfg_bsins, prsfg_promf, prsfg_bosfg, prsfg_items,
                          prsfg_price, prsfg_units, prsfg_itype, prsfg_group, prsfg_boqty, prsfg_borat,
                          prsfg_rtrto, prsfg_fgqty, prsfg_fgrat, prsfg_fgval, prsfg_notes, prsfg_stock,
                          prsfg_jrnlm, prsfg_refid, prsfg_crusr, prsfg_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17, $18,
        $19, $20, $21, $22)`,
        params: [
          uuidv4(),
          user_c,
          user_b,
          newId,
          det.prsfg_bosfg,
          det.prsfg_items,
          det.prsfg_price,
          det.prsfg_units,
          det.prsfg_itype,
          det.prsfg_group,
          det.prsfg_boqty || 0,
          det.prsfg_borat || 0,
          det.prsfg_rtrto || 0,
          det.prsfg_fgqty || 0,
          det.prsfg_fgrat || 0,
          det.prsfg_fgval || 0,
          det.prsfg_notes || "",
          det.prsfg_stock || "",
          det.prsfg_jrnlm || "",
          det.prsfg_refid || "",
          user_s,
          user_s,
        ],
        label: `Created SFG/FG detail ${newTrnNo}`,
      });
    }
    await dbRunAll(scripts);

    res.json({
      success: true,
      message: "Process created successfully",
      data: {
        ...req.body,
        promf_bkngm: newTrnNo,
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
    return res.json({
      success: false,
      message: "Work In Progress.",
      data: {},
    });
    const {
      id,
      promf_users,
      promf_bsins,
      promf_ccode,
      promf_dpart,
      promf_bommf,
      promf_bkngm,
      promf_trnno,
      promf_trdat,
      promf_cname,
      bommf_inout,
      bommf_units,
      bommf_bmqty,
      bommf_bmval,
      promf_prono,
      promf_frdat,
      promf_todat,
      promf_prtim,
      user_s,
      user_c,
      user_b,
      tmmb_borpm,
      tmmb_bofoh,
      tmmb_bosfg,
    } = req.body;

    if (
      !promf_dpart ||
      !promf_bommf ||
      !promf_trdat ||
      !promf_cname ||
      !bommf_inout ||
      !bommf_units ||
      !bommf_bmqty ||
      !promf_prono ||
      !promf_frdat ||
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
    const { id, promf_trdat, bommf_actve, user_s, user_c, user_b } = req.body;

    if (!id || !promf_trdat || !user_s || !user_c || !user_b) {
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
      message: `${promf_trdat} - ${
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
// get by department
// =====================
router.post("/get-by-department", async (req, res) => {
  try {
    const { promf_dpart, user_c } = req.body;

    if (!promf_dpart || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    const sql1 = `
      SELECT bm.*, unt.units_cname, 0 AS edit_stop
      FROM tmmb_bommf bm
      JOIN tmib_units unt ON bm.bommf_units = unt.id
      WHERE bm.promf_users = $1
      AND bm.promf_dpart = $2
      AND bm.bommf_actve = TRUE
      ORDER BY bm.promf_trdat ASC`;
    const sql = `SELECT bmf.*, 0 AS edit_stop
      FROM tmmb_bommf bmf
      WHERE bmf.bommf_actve = TRUE
      AND bmf.promf_users = $1
      AND bmf.promf_dpart = $2
      ORDER BY bmf.promf_trdat`;

    const rows = await dbGetAll(
      sql,
      [user_c, promf_dpart],
      `Get Active BOM - ${user_c}`,
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
// get-rmpm-by-process
// =====================
router.post("/get-rmpm-by-process", async (req, res) => {
  try {
    const { prrpm_promf, user_c } = req.body;

    if (!prrpm_promf || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }
    const sql = `SELECT rpm.*, prc.price_cname, unt.units_cname
              FROM tmmb_prrpm rpm
              JOIN tmib_price prc ON rpm.prrpm_price = prc.id
              JOIN tmib_units unt ON rpm.prrpm_units = unt.id
              WHERE rpm.prrpm_promf = $1
              AND rpm.prrpm_users = $2
              ORDER BY rpm.prrpm_items`;

    const rows = await dbGetAll(
      sql,
      [prrpm_promf, user_c],
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
// get-foh-by-process
// =====================
router.post("/get-foh-by-process", async (req, res) => {
  try {
    const { prfoh_promf, user_c } = req.body;

    if (!prfoh_promf || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }
    const sql = `SELECT foh.*, prc.price_cname, unt.units_cname
              FROM tmmb_prfoh foh
              JOIN tmib_price prc ON foh.prfoh_price = prc.id
              JOIN tmib_units unt ON foh.prfoh_units = unt.id
              WHERE foh.prfoh_promf = $1
              AND foh.prfoh_users = $2
              ORDER BY foh.prfoh_items`;

    const rows = await dbGetAll(
      sql,
      [prfoh_promf, user_c],
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
// get-sfg-by-process
// =====================
router.post("/get-sfg-by-process", async (req, res) => {
  try {
    const { prsfg_promf, user_c } = req.body;

    if (!prsfg_promf || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }
    const sql1 = `SELECT sfg.*, prc.price_cname, unt.units_cname,
    ( btc.prbtc_gdstk + btc.prbtc_bdstk ) avail_fgqty
              FROM tmmb_prsfg sfg
              JOIN tmib_price prc ON sfg.prsfg_price = prc.id
              JOIN tmib_units unt ON sfg.prsfg_units = unt.id
              LEFT JOIN tmmb_prbtc btc ON sfg.id = btc.prbtc_prsfg
              WHERE sfg.prsfg_promf = $1
              AND sfg.prsfg_users = $2
              ORDER BY sfg.prsfg_items`;
    const sql = `SELECT sfg.*, prc.price_cname, unt.units_cname,
                COALESCE(SUM(btc.prbtc_gdstk), 0) +
                COALESCE(SUM(btc.prbtc_bdstk), 0) AS avail_fgqty
              FROM tmmb_prsfg sfg
              JOIN tmib_price prc ON sfg.prsfg_price = prc.id
              JOIN tmib_units unt ON sfg.prsfg_units = unt.id
              LEFT JOIN tmmb_prbtc btc ON sfg.id = btc.prbtc_prsfg
              WHERE sfg.prsfg_promf = $1
                AND sfg.prsfg_users = $2
              GROUP BY sfg.id, prc.price_cname, unt.units_cname
              ORDER BY sfg.prsfg_items`;

    const rows = await dbGetAll(
      sql,
      [prsfg_promf, user_c],
      `Get SFG by BOM - ${user_c}`,
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
// Create-batch
// =====================
router.post("/create-batch", async (req, res) => {
  try {
    const {
      id,
      promf_users,
      promf_bsins,
      promf_ccode,
      promf_dpart,
      promf_bommf,
      promf_bkngm,
      promf_trnno,
      promf_trdat,
      promf_cname,
      promf_prono,
      promf_frdat,
      promf_todat,
      promf_prtim,
      promf_notes,
      user_s,
      user_c,
      user_b,
      tmmb_prbtc,
    } = req.body;

    // Validate input
    if (
      !promf_dpart ||
      !promf_bommf ||
      !promf_trnno ||
      !promf_trdat ||
      !promf_cname ||
      !promf_prono ||
      !promf_frdat ||
      !promf_todat ||
      !user_s ||
      !user_c ||
      !user_b ||
      !tmmb_prbtc
    ) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //database action
    const newId = uuidv4();
    // const newCode = await GenNewCode(user_c, "tmmb_promf");
    // const newTrnNo = await GenNewTrn(
    //   user_c,
    //   user_b,
    //   "tmmb_promf",
    //   "Production Process",
    //   promf_dpart,
    // );
    //build scripts
    const scripts = [];
    //Insert BATCH details
    for (const det of tmmb_prbtc) {
      const lineId = uuidv4();
      scripts.push({
        sql: `INSERT INTO tmmb_prbtc(id, prbtc_users, prbtc_bsins, prbtc_promf, prbtc_bosfg, prbtc_prsfg,
                        prbtc_items, prbtc_price, prbtc_units, prbtc_itype, prbtc_group, prbtc_brcod,
                        prbtc_batch, prbtc_srial, prbtc_gdstk, prbtc_bdstk, prbtc_fgrat, prbtc_fgval,
                        prbtc_dpart, prbtc_wkshf, prbtc_emply, prbtc_notes, prbtc_stock, prbtc_jrnlm,
                        prbtc_crusr, prbtc_upusr)
            VALUES ($1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17, $18,
        $19, $20, $21, $22, $23, $24,
        $25, $26)`,
        params: [
          lineId,
          user_c,
          user_b,
          id,
          det.prbtc_bosfg,
          det.prbtc_prsfg,
          det.prbtc_items,
          det.prbtc_price,
          det.prbtc_units,
          det.prbtc_itype,
          det.prbtc_group,
          det.prbtc_brcod,
          det.prbtc_batch,
          det.prbtc_srial,
          det.prbtc_gdstk || 0,
          det.prbtc_bdstk || 0,
          det.prbtc_fgrat || 0,
          det.prbtc_fgval || 0,
          promf_dpart || "",
          det.prbtc_wkshf || "",
          det.prbtc_emply || "",
          det.prbtc_notes || "",
          det.prbtc_stock || "",
          det.prbtc_jrnlm || "",
          user_s,
          user_s,
        ],
        label: `Created BATCH detail Qty:${det.prbtc_gdstk}`,
      });

      //add condition if no tracking then off
      scripts.push({
        sql: `INSERT INTO tmib_stock(id, stock_users, stock_bsins, stock_dpart, stock_sorce, stock_trnno,
        stock_refid, stock_items, stock_price, stock_brcod, stock_batch, stock_srial,
        stock_wrdat, stock_fgdat, stock_exdat, stock_trqty, stock_dmqty, stock_ohqty,
        stock_cprat, stock_lprat, stock_notes, stock_crusr, stock_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12,
      $13, $14, $15, $16, $17, $18,
      $19, $20, $21, $22, $23)`,
        params: [
          uuidv4(),
          user_c,
          user_b,
          promf_dpart,
          "Production Process Batch",
          promf_trnno,
          lineId,
          det.prbtc_items,
          det.prbtc_price,
          det.prbtc_brcod, //
          det.prbtc_batch, //
          det.prbtc_srial, //
          new Date(), //
          new Date(), //
          new Date(), //
          det.prbtc_gdstk || 0,
          det.prbtc_bdstk || 0,
          det.prbtc_gdstk || 0,
          det.prbtc_fgrat || 0,
          det.prbtc_fgrat || 0,
          det.prbtc_notes || "",
          user_s,
          user_s,
        ],
        label: `Created MRR stock detail ${det.prbtc_gdstk}`,
      });

      //update summary stock, last price
      scripts.push({
        sql: `UPDATE tmib_price
              SET price_lprat = $1,
                  price_gdstk = price_gdstk + $2,
                  price_upusr = $3,
                  price_updat = CURRENT_TIMESTAMP,
                  price_rvnmr = price_rvnmr + 1
                  WHERE id = $4
                  AND price_users = $5
                  AND price_items = $6`,
        params: [
          det.prbtc_fgrat,
          det.prbtc_gdstk || 0,
          user_s,
          det.prbtc_price,
          user_c,
          det.prbtc_items,
        ],
        label: `Update price stock detail ${det.prbtc_gdstk}`,
      });
    }
    //console.log(scripts)

    await dbRunAll(scripts);

    res.json({
      success: true,
      message: "Batch created successfully",
      data: {
        ...req.body,
        promf_trnno: promf_trnno,
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

// =====================
// get-batch-by-process
// =====================
router.post("/get-batch-by-process", async (req, res) => {
  try {
    const { prbtc_promf, user_c } = req.body;

    if (!prbtc_promf || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }
    const sql = `SELECT btc.*, prc.price_cname, unt.units_cname, dpt.dpart_cname
              FROM tmmb_prbtc btc
              JOIN tmib_price prc ON btc.prbtc_price = prc.id
              JOIN tmib_units unt ON btc.prbtc_units = unt.id
              JOIN tmsb_dpart dpt ON btc.prbtc_dpart = dpt.id
              WHERE btc.prbtc_promf = $1
                AND btc.prbtc_users = $2
              ORDER BY btc.prbtc_items`;

    const rows = await dbGetAll(
      sql,
      [prbtc_promf, user_c],
      `Get Batch by process - ${user_c}`,
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
