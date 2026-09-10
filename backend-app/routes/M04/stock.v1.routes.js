const express = require("express");
const router = express.Router();
const { dbGet, dbGetAll, dbRun, dbRunAll } = require("../../db/sqlManagerpg");
const { v4: uuidv4 } = require("uuid");
const { GenNewCode } = require("../../db/genHelper");

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

    const sql = `SELECT brnd.*,0 AS edit_stop
      FROM tmib_brand brnd
      WHERE brnd.brand_users = $1
      AND brnd.brand_actve = TRUE
      ORDER BY brnd.brand_cname ASC`;

    const rows = await dbGetAll(sql, [user_c], `Get Active Brand - ${user_c}`);

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
    const { id, stock_lines, user_s, user_c, user_b } = req.body;

    if (!stock_lines || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    //build scripts
    const scripts = [];
    const newCode = await GenNewCode(user_c, "tmib_stkmg");
    const newId = uuidv4();
    let gdStk = 0;
    let gdAmt = 0;
    let bdStk = 0;
    let bdAmt = 0;
    for (const det of stock_lines) {
      scripts.push({
        sql: `INSERT INTO tmib_stkmg(id, stkmg_users, stkmg_bsins, stkmg_dpart, stkmg_ccode, stkmg_stock,
                             stkmg_refid, stkmg_trdat, stkmg_gdstk, stkmg_bdstk, stkmg_cprat, stkmg_avrat,
                             stkmg_notes, stkmg_crusr, stkmg_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12,
      $13, $14, $15)`,
        params: [
          uuidv4(),
          user_c,
          user_b,
          det.stock_dpart,
          newCode,
          newId,
          det.id,
          new Date(),
          det.stock_ohqty,
          det.stock_dmqty,
          det.stock_cprat || 0,
          det.stock_cprat || 0,
          det.stock_notes || "",
          user_s,
          user_s,
        ],
        label: `Created Merge stock detail ${newCode}`,
      });
      gdStk = gdStk + Number(det.stock_ohqty);
      gdAmt = gdAmt + Number(det.stock_ohqty) * Number(det.stock_cprat);
      bdStk = bdStk + Number(det.stock_dmqty);
      bdAmt = bdAmt + Number(det.stock_dmqty) * Number(det.stock_cprat);
      const outQty = Number(det.stock_ohqty) + Number(det.stock_dmqty);

      scripts.push({
        sql: `UPDATE tmib_stock
        SET stock_ohqty = 0,
        stock_dmqty = 0,
        stock_aoqty = $1,
        stock_upusr = $2,
        stock_updat = CURRENT_TIMESTAMP,
        stock_rvnmr = stock_rvnmr + 1
        WHERE id = $3`,
        params: [outQty, user_s, det.id],
        label: `Update stock detail ${newCode}`,
      });
    }

    const cprat = (gdAmt + bdAmt) / (gdStk + bdStk);
    //console.log("stock_lines", stock_lines);

    scripts.push({
      sql: `INSERT INTO tmib_stock(id, stock_users, stock_bsins, stock_dpart, stock_sorce, stock_trnno,
        stock_refid, stock_items, stock_price, stock_brcod, stock_batch, stock_srial,
        stock_wrdat, stock_fgdat, stock_exdat, stock_trqty, stock_ohqty, stock_dmqty,
        stock_cprat, stock_lprat, stock_notes, stock_crusr, stock_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12,
      $13, $14, $15, $16, $17, $18,
      $19, $20, $21, $22, $23)`,
      params: [
        uuidv4(),
        user_c,
        user_b,
        stock_lines[0].stock_dpart,
        "Merged Stock",
        newCode,
        newId,
        stock_lines[0].stock_items,
        stock_lines[0].stock_price,
        "", //
        "", //
        "", //
        null, //
        null, //
        null, //
        gdStk || 0,
        gdStk || 0,
        bdStk || 0,
        cprat || 0,
        cprat || 0,
        stock_lines.length + " lines merged",
        user_s,
        user_s,
      ],
      label: `Created merge stock ${newCode}`,
    });

    //console.log("scripts", scripts);
    await dbRunAll(scripts);
    res.json({
      success: true,
      message: `New Stock Line - Created successfully.`,
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
// Update
// =====================
const update = async (req, res) => {
  try {
    const {
      id,
      brand_users,
      brand_bsins,
      brand_ccode,
      brand_cntry,
      brand_cname,
      user_s,
      user_c,
      user_b,
    } = req.body;

    if (!brand_cntry || !brand_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    const sql = `
      UPDATE tmib_brand
      SET
        brand_cntry = $1,
        brand_cname = $2,
        brand_upusr = $3,
        brand_updat = CURRENT_TIMESTAMP,
        brand_rvnmr = brand_rvnmr + 1
      WHERE id = $4`;

    const params = [brand_cntry, brand_cname, user_s, id];

    await dbRun(sql, params, `Update Brand - ${user_c}`);

    res.json({
      success: true,
      message: `${brand_cname} - Updated successfully.`,
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
    const { id, brand_cname, brand_actve, user_s, user_c, user_b } = req.body;

    if (!id || !brand_cname || !user_s || !user_c || !user_b) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: {},
      });
    }

    const sql = `
      UPDATE tmib_brand
      SET
        brand_actve = NOT brand_actve,
        brand_upusr = $1,
        brand_updat = CURRENT_TIMESTAMP,
        brand_rvnmr = brand_rvnmr + 1
      WHERE id = $2`;

    await dbRun(sql, [user_s, id], `Delete Product - ${user_c}`);

    res.json({
      success: true,
      message: `${brand_cname} - ${
        brand_actve ? "Deactivate" : "Activate"
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
// Get Available
// =====================
router.post("/get-available", async (req, res) => {
  try {
    const { user_s, user_c, user_b } = req.body;

    if (!user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    const sql = `SELECT *
            FROM tmib_price prc
            WHERE (prc.price_gdstk > 0
            OR prc.price_bdstk > 0)
            AND prc.price_users = $1`;

    const params = [user_c];
    const rows = await dbGetAll(sql, params, `Get stock - ${user_c}`);

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
// Get All
// =====================
router.post("/get-price-ledger", async (req, res) => {
  try {
    const { price_id, user_s, user_c, user_b } = req.body;

    if (!price_id || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //mrr (+), sales (-), production (-), batch (+), adjustment (+)
    const sql = `SELECT stk.*, stk.mrrdc_itqty * stk.mrrdc_csrat line_value,
    COALESCE(cnt.cntct_cname, stk.mrrdm_cntct) as cntct_cname, itm.items_iname, prc.price_cname, unt.units_cname
    FROM(
      SELECT mrm.mrrdm_trnno, mrm.mrrdm_trdat, mrm.mrrdm_cntct,
      mrc.mrrdc_price, mrc.mrrdc_items, mrc.mrrdc_units, mrc.mrrdc_itqty, mrc.mrrdc_csrat
      FROM tmpb_mrrdc mrc
      JOIN tmpb_mrrdm mrm ON mrc.mrrdc_mrrdm = mrm.id
      WHERE mrc.mrrdc_price = $1
      AND mrm.mrrdm_users = $2
      UNION ALL
      SELECT ivm.invcm_trnno, ivm.invcm_trdat, ivm.invcm_cntct,
      ivc.invcc_price, ivc.invcc_items, ivc.invcc_units, 0 - ivc.invcc_itqty, ivc.invcc_csrat
      FROM tmob_invcc ivc
      JOIN tmob_invcm ivm ON ivc.invcc_invcm = ivm.id
      WHERE ivc.invcc_price = $1
      AND ivm.invcm_users = $2
      UNION ALL
      SELECT prm.promf_trnno, prm.promf_trdat, prm.promf_cname,
      rpm.prrpm_price, rpm.prrpm_items, rpm.prrpm_units, 0 - rpm.prrpm_rmqty, rpm.prrpm_rmrat
      FROM tmmb_prrpm rpm
      JOIN tmmb_promf prm ON rpm.prrpm_promf = prm.id
      WHERE rpm.prrpm_price = $1
      AND rpm.prrpm_users = $2
      UNION ALL
      SELECT prm.promf_trnno || ', ' || btc.prbtc_batch , prm.promf_trdat, prm.promf_cname,
      btc.prbtc_price, btc.prbtc_items, btc.prbtc_units, btc.prbtc_gdstk, btc.prbtc_fgrat
      FROM tmmb_prbtc btc
      JOIN tmmb_promf prm ON btc.prbtc_promf = prm.id
      WHERE btc.prbtc_price = $1
      AND btc.prbtc_users = $2
      UNION ALL
      SELECT ajm.adjsm_trnno, ajm.adjsm_trdat, ajm.adjsm_ttype,
      ajc.adjsc_price, ajc.adjsc_items, ajc.adjsc_units, 0 - ajc.adjsc_itqty, ajc.adjsc_itrat
      FROM tmib_adjsc ajc
      JOIN tmib_adjsm ajm ON ajc.adjsc_adjsm = ajm.id
      WHERE ajm.adjsm_ttype = 'Adjustment Out'
      AND ajc.adjsc_price = $1
      AND ajm.adjsm_users = $2
      UNION ALL
      SELECT ajm.adjsm_trnno, ajm.adjsm_trdat, ajm.adjsm_ttype,
      ajc.adjsc_price, ajc.adjsc_items, ajc.adjsc_units, ajc.adjsc_itqty, ajc.adjsc_itrat
      FROM tmib_adjsc ajc
      JOIN tmib_adjsm ajm ON ajc.adjsc_adjsm = ajm.id
      WHERE ajm.adjsm_ttype = 'Adjustment In'
      AND ajc.adjsc_price = $1
      AND ajm.adjsm_users = $2
    )stk
    LEFT JOIN tmcb_cntct cnt ON stk.mrrdm_cntct = cnt.id
    JOIN tmib_items itm ON stk.mrrdc_items = itm.id
    JOIN tmib_price prc ON stk.mrrdc_price = prc.id
    JOIN tmib_units unt ON stk.mrrdc_units = unt.id
    ORDER BY 2 DESC
    `;

    //ORDER BY mrm.mrrdm_trdat
    const params = [price_id, user_c];
    const rows = await dbGetAll(sql, params, `Get stock - ${user_c}`);

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
// get item price stock fr process
// =====================
router.post("/get-item-price-stock-fr-process", async (req, res) => {
  try {
    const { stock_dpart, stock_price, user_s, user_c, user_b } = req.body;

    if (!stock_dpart || !stock_price || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    const sql = `SELECT stk.id stock_id, stk.stock_trnno, stk.stock_batch, stk.stock_cprat, stk.stock_ohqty,
prc.id price_id, prc.price_cname, itm.id items_id, itm.items_runit, unt.units_cname runit_cname
FROM tmib_stock stk
JOIN tmib_price prc ON stk.stock_price = prc.id
JOIN tmib_items itm ON stk.stock_items = itm.id
JOIN tmib_units unt ON itm.items_runit = unt.id
WHERE stk.stock_dpart = $1
AND stk.stock_price = $2
AND stk.stock_users = $3
AND stk.stock_ohqty > 0
ORDER BY stk.stock_trdat`;

    //ORDER BY mrm.mrrdm_trdat
    const params = [stock_dpart, stock_price, user_c];
    const rows = await dbGetAll(sql, params, `Get stock - ${user_c}`);

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
// get stock line
// =====================
router.post("/get-stock-line", async (req, res) => {
  try {
    const { dpart_id, user_s, user_c, user_b } = req.body;

    if (!dpart_id || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    const sql = `SELECT stk.*, 
    itm.items_iname, itm.items_pkqty, itm.items_szqty,
    prc.price_cname,    
    runit.units_cname as runit_cname,
    punit.units_cname as punit_cname,
    sunit.units_cname as sunit_cname,
    sgrup.sgrup_cname as sgrup_cname,
    scatg.scatg_cname as scatg_cname,
    brand.brand_cname as brand_cname
        FROM tmib_stock stk
        JOIN tmib_price prc ON stk.stock_price = prc.id
        JOIN tmib_items itm ON stk.stock_items = itm.id
        LEFT JOIN tmib_units runit ON itm.items_runit = runit.id
        LEFT JOIN tmib_units punit ON itm.items_punit = punit.id
        LEFT JOIN tmib_units sunit ON itm.items_sunit = sunit.id
        LEFT JOIN tmib_sgrup sgrup ON itm.items_sgrup = sgrup.id
        LEFT JOIN tmib_scatg scatg ON itm.items_scatg = scatg.id
        LEFT JOIN tmib_brand brand ON itm.items_brand = brand.id
         WHERE stk.stock_ohqty > 0
         AND stk.stock_dpart = $1
         AND stk.stock_users = $2
         AND stk.stock_bsins = $3`;

    const params = [dpart_id, user_c, user_b];
    const rows = await dbGetAll(sql, params, `Get stock line - ${user_c}`);

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
