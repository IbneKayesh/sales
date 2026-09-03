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
    unt.units_cname AS runit_cname,
    csr.emply_cname AS crusr_cname, usr.emply_cname AS upusr_cname, 0 as edit_stop
    FROM tmib_bndlm bdm
    JOIN tmsb_dpart dpt ON bdm.bndlm_dpart = dpt.id  
    JOIN tmib_items itm ON bdm.bndlm_items = itm.id
    JOIN tmib_price prc ON bdm.bndlm_price = prc.id
    JOIN tmib_units unt ON bdm.bndlm_units = unt.id
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
      bndlm_units,
      bndlm_frdat,
      bndlm_todat,
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
      !bndlm_units ||
      !bndlm_frdat ||
      !bndlm_todat ||
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
                              bndlm_itype, bndlm_items, bndlm_price, bndlm_units, bndlm_frdat, bndlm_todat,
                              bndlm_itqty, bndlm_itrat, bndlm_crusr, bndlm_upusr
                              )
    VALUES ($1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10, $11, $12,
          $13, $14, $15, $16)`,
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
        bndlm_units,
        bndlm_frdat,
        bndlm_todat,
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
                          bndlc_units, bndlc_itqty, bndlc_itrat, bndlc_crusr, bndlc_upusr)
        VALUES ($1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11)`,
        params: [
          lineId,
          user_c,
          user_b,
          newId,
          det.bndlc_items,
          det.bndlc_price,
          det.bndlc_units,
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

// get-details-by-master
router.post("/get-details-by-master", async (req, res) => {
  try {
    const { bndlc_bndlm, user_s, user_c, user_b } = req.body;

    // Validate input
    if (!bndlc_bndlm || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    //database action
    const sql = `SELECT bnc.*, bnc.bndlc_itrat * bnc.bndlc_itqty AS bndlc_itamt,
    itm.items_icode, itm.items_iname, prc.price_ccode, prc.price_cname, unt.units_cname AS runit_cname,
     0 as edit_stop
    FROM tmib_bndlc bnc
    LEFT JOIN tmib_items itm ON bnc.bndlc_items = itm.id
    LEFT JOIN tmib_price prc ON bnc.bndlc_price = prc.id
    LEFT JOIN tmib_units unt ON bnc.bndlc_units = unt.id
    WHERE bnc.bndlc_users = $1
    AND bnc.bndlc_bndlm = $2
    ORDER BY bnc.bndlc_price ASC`;

    const params = [user_c, bndlc_bndlm];
    const rows = await dbGetAll(sql, params, `get bundle details- ${user_c}`);
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

// get-bundle-purchase-by-item
router.post("/get-bundle-purchase-by-item", async (req, res) => {
  try {
    const { bndlm_dpart, bndlc_items, user_s, user_c, user_b } =
      req.body;

    // Validate input
    if (!bndlm_dpart || !bndlc_items || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    // Extract item IDs from bndlc_items array
    const itemIds = bndlc_items.map((item) => item.items_id);
    const priceIds = bndlc_items.map((item) => item.price_id);

    //database action
    const sql = `SELECT bnm.id as mrrdf_bndlm, bnm.bndlm_price as mrrdf_pricm, bnm.bndlm_items as mrrdf_itemm,
    bnm.bndlm_units as mrrdf_unitm, bnm.bndlm_itqty as mrrdf_bnqty, bnc.id as mrrdf_bndlc, bnc.bndlc_price as mrrdf_pricc,
    bnc.bndlc_items as mrrdf_itemc, bnc.bndlc_units as mrrdf_unitc, bnc.bndlc_itqty as mrrdf_pkqty, 0 as mrrdf_trqty,
    0 as mrrdf_ofcnt, 0 as mrrdf_ofqty, '' as mrrdf_notes, 0 as mrrdf_csrat, '' as mrrdf_refid,
    bnm.bndlm_ccode, bnm.bndlm_cname, bnm.bndlm_itype, prcm.price_cname as bndlm_price_cname,
    untm.units_cname as bndlm_units_cname, bnm.bndlm_frdat, bnm.bndlm_todat, bnm.bndlm_itrat,
    prc.price_ccode, prc.price_cname, unt.units_cname,
      CASE
        WHEN bnc.bndlc_itrat > 0 THEN prc.price_mrrat
        ELSE bnc.bndlc_itrat
      END bndlc_itrat
    FROM tmib_bndlm bnm
    JOIN tmib_price prcm ON bnm.bndlm_price = prcm.id
    JOIN tmib_units untm ON bnm.bndlm_units = untm.id
    JOIN tmib_bndlc bnc ON  bnm.id = bnc.bndlc_bndlm
    JOIN tmib_price prc ON bnc.bndlc_price = prc.id
    JOIN tmib_units unt ON bnc.bndlc_units = unt.id 
    WHERE bnm.bndlm_users = $1
    AND bnm.bndlm_bsins = $2
    AND bnm.bndlm_dpart = $3
    AND bnm.bndlm_items = ANY($4)
    AND bnm.bndlm_price = ANY($5)
    AND bnm.bndlm_itype = 'PURCHASE'
    AND bnm.bndlm_actve = TRUE
    AND bnc.bndlc_users = bnm.bndlm_users
    AND bnc.bndlc_bsins = bnm.bndlm_bsins
    AND bnc.bndlc_actve = TRUE`;

    const params = [user_c, user_b, bndlm_dpart, itemIds, priceIds];
    const rows = await dbGetAll(sql, params, `get bundle purchase details- ${user_c}`);
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

// get-bundle-sales-by-item
router.post("/get-bundle-sales-by-item", async (req, res) => {
  try {
    const { bndlm_dpart, bndlc_items, user_s, user_c, user_b } =
      req.body;

    // Validate input
    if (!bndlm_dpart || !bndlc_items || !user_c) {
      return res.json({
        success: false,
        message: "All fields in the request body are required.",
        data: [],
      });
    }

    // Extract item IDs from bndlc_items array
    const itemIds = bndlc_items.map((item) => item.items_id);
    const priceIds = bndlc_items.map((item) => item.price_id);

    //database action
    const sql = `SELECT bnm.id as invcf_bndlm, bnm.bndlm_price as invcf_pricm, bnm.bndlm_items as invcf_itemm,
    bnm.bndlm_units as invcf_unitm, bnm.bndlm_itqty as invcf_bnqty, bnc.id as invcf_bndlc, bnc.bndlc_price as invcf_pricc,
    bnc.bndlc_items as invcf_itemc, bnc.bndlc_units as invcf_unitc, bnc.bndlc_itqty as invcf_pkqty, 0 as invcf_trqty,
    0 as invcf_ofcnt, 0 as invcf_ofqty, '' as invcf_notes, 0 as invcf_csrat, '' as invcf_refid,
    bnm.bndlm_ccode, bnm.bndlm_cname, bnm.bndlm_itype, prcm.price_cname as bndlm_price_cname,
    untm.units_cname as bndlm_units_cname, bnm.bndlm_frdat, bnm.bndlm_todat, bnm.bndlm_itrat,
    prc.price_ccode, prc.price_cname, unt.units_cname,
      CASE
        WHEN bnc.bndlc_itrat > 0 THEN prc.price_mrrat
        ELSE bnc.bndlc_itrat
      END bndlc_itrat, stk.stock_ohqty
    FROM tmib_bndlm bnm
    JOIN tmib_price prcm ON bnm.bndlm_price = prcm.id
    JOIN tmib_units untm ON bnm.bndlm_units = untm.id
    JOIN tmib_bndlc bnc ON  bnm.id = bnc.bndlc_bndlm
    JOIN tmib_price prc ON bnc.bndlc_price = prc.id
    JOIN tmib_units unt ON bnc.bndlc_units = unt.id
    LEFT JOIN (
    SELECT stock_users, stock_bsins, stock_dpart, stock_items, stock_price, SUM(stock_ohqty) AS stock_ohqty
    FROM tmib_stock
    GROUP BY stock_users,stock_bsins,stock_dpart,stock_items,stock_price
    ) stk
    ON bnm.bndlm_users = stk.stock_users
    AND bnm.bndlm_bsins = stk.stock_bsins
    AND bnm.bndlm_dpart = stk.stock_dpart
    AND bnc.bndlc_items = stk.stock_items
    AND bnc.bndlc_price = stk.stock_price
    WHERE bnm.bndlm_users = $1
    AND bnm.bndlm_bsins = $2
    AND bnm.bndlm_dpart = $3
    AND bnm.bndlm_items = ANY($4)
    AND bnm.bndlm_price = ANY($5)
    AND bnm.bndlm_itype = 'SALES'
    AND bnm.bndlm_actve = TRUE
    AND bnc.bndlc_users = bnm.bndlm_users
    AND bnc.bndlc_bsins = bnm.bndlm_bsins
    AND bnc.bndlc_actve = TRUE`;

    const params = [user_c, user_b, bndlm_dpart, itemIds, priceIds];
    const rows = await dbGetAll(sql, params, `get bundle sales details- ${user_c}`);
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
